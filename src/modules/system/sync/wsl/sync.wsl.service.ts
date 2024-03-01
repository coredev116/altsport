/* eslint-disable no-console */
import { Injectable } from "@nestjs/common";
// import { ModuleRef } from "@nestjs/core";
import { InjectRepository } from "@nestjs/typeorm";
import {
  Repository,
  EntityManager,
  In,
  Not,
  IsNull,
  LessThanOrEqual,
  MoreThan,
  FindOptionsWhere,
} from "typeorm";
import { v4 } from "uuid";
import { parse, differenceInDays, differenceInHours, addDays } from "date-fns";
import isAssetEqual from "lodash.isequal";
import { zonedTimeToUtc } from "date-fns-tz";

import Athletes from "../../../../entities/wsl/athletes.entity";
import Events from "../../../../entities/wsl/events.entity";
import Tours from "../../../../entities/wsl/tours.entity";
import TourYears from "../../../../entities/wsl/tourYears.entity";
import Rounds from "../../../../entities/wsl/rounds.entity";
import EventRounds from "../../../../entities/wsl/eventRounds.entity";
import RoundHeats from "../../../../entities/wsl/roundHeats.entity";
import EventParticipants from "../../../../entities/wsl/eventParticipants.entity";
import Scores from "../../../../entities/wsl/scores.entity";
// import SimulationWeights from "../../../../entities/wsl/simulationWeights.entity";
import Futures from "../../../../entities/wsl/futures.entity";

import WSLService from "../../../../services/wsl.service";
// import WSLHelperService from "./sync.wsl.helpers.service";
import OpenbetAPIService from "../../../../services/openbet-api.service";

// import QueueService from "../../../system/queue/queue.service";

import { Event } from "../../../../interfaces/wsl/event";
import ITourEvents, { ITourItem } from "../../../../interfaces/wsl/toursEvents";
import { ITour } from "../../../../interfaces/wsl/tours";
import { IFixtureBodyPayload, Fixture } from "../../../../interfaces/openbet";

import {
  EventStatus,
  RoundStatus,
  HeatStatus,
  Gender,
  AthleteStatus,
} from "../../../../constants/system";

import {
  ParticipantsSide,
  ParticipantsType,
  FixtureType,
  MatchState,
  FixtureStatus,
  ProviderIdentifiers,
} from "../../../../constants/openbet";

const DATE_FORMAT = `yyyy-MM-dd'T'HH:mm:ssxxx`;

// FIXME: revert when not finals
const IS_FINALS = false;

@Injectable()
export default class SyncWSLService {
  // private queueService: QueueService;
  // private mensHeatAverage: number = 0;
  // private womenHeatAverage: number = 0;

  constructor(
    @InjectRepository(Athletes) private readonly athleteRepository: Repository<Athletes>,
    @InjectRepository(Events) private readonly eventsRepository: Repository<Events>,
    @InjectRepository(Rounds) private readonly roundsRepository: Repository<Rounds>,
    @InjectRepository(EventRounds) private readonly eventRoundsRepository: Repository<EventRounds>,
    @InjectRepository(RoundHeats) private readonly heatsRepository: Repository<RoundHeats>,
    @InjectRepository(Scores) private readonly scoresRepository: Repository<Scores>,
    // @InjectRepository(SimulationWeights)
    // private readonly simulationWeightRepository: Repository<SimulationWeights>,
    @InjectRepository(EventParticipants)
    private readonly eventParticipantsRepository: Repository<EventParticipants>,

    private readonly wslService: WSLService,

    // private readonly wslHelperService: WSLHelperService, // private moduleRef: ModuleRef,
    private readonly openbetService: OpenbetAPIService,
  ) {}

  onModuleInit() {
    // this.queueService = this.moduleRef.get(QueueService, { strict: false });
  }

  async syncLiveUpcomingEvents(): Promise<boolean> {
    try {
      const now: Date = new Date();

      const endDate: Date = addDays(now, 8);

      const dbEvents = await this.eventsRepository.find({
        where: {
          eventStatus: In([
            EventStatus.LIVE,
            EventStatus.UPCOMING,
            EventStatus.NEXT,
            EventStatus.IN_WINDOW,
          ]),
          isActive: true,
          isArchived: false,
          providerId: Not(IsNull()),
          // only fetch nearby events that are live, next or upcoming, no need to update
          // event 2 months down the line
          startDate: LessThanOrEqual(endDate),
        },
        select: {
          id: true,
          tourYearId: true,
          eventStatus: true,
          providerId: true,
          startDate: true,
          endDate: true,
          winnerAthleteId: true,
          eventLocationGroup: true,
          updatedAt: true,
        },
        order: {
          startDate: "ASC",
        },
      });

      const validEvents = dbEvents.filter((event) => {
        // if the event is live then it should update quickly
        if ([EventStatus.LIVE, EventStatus.IN_WINDOW].includes(event.eventStatus)) return true;

        // if the event is not live then update every hour instead of eery 5 minutes
        const difference = differenceInHours(now, event.updatedAt);
        return difference > 1;
      });

      const openbetSyncIds: string[] = [];

      await this.eventsRepository.manager.transaction(
        async (transactionalEntityManager: EntityManager) => {
          // running this to ensure that all athletes and all event participants always exist
          await this.updateEventSeeds(transactionalEntityManager, validEvents);

          for await (const dbEvent of validEvents) {
            try {
              openbetSyncIds.push(dbEvent.id);
              // fetch the event from the api
              const [apiEvents, apiEventAlt] = await Promise.all([
                this.wslService.fetchEventDetails(dbEvent.providerId),
                this.wslService.fetchEventAltDetails(dbEvent.providerId),
              ]);
              const { events, athletes: eventAthletes } = apiEvents;
              const { rounds = null, heats = null } = apiEventAlt;
              const apiEvent: Event = events[dbEvent.providerId];

              const isEventInStandby: boolean = apiEvent.eventStatus === "standby";

              // if the event is active then close the future
              await transactionalEntityManager.update(
                Futures,
                {
                  tourYearId: dbEvent.tourYearId,
                },
                {
                  isMarketOpen: !apiEvent.isLive,
                },
              );

              // for upcoming or next events there is no need to update the seeds or heats
              // as seeds are taken care by the seed function and heats do no change for upcoming and next
              let eventStatus: EventStatus = dbEvent.eventStatus;
              if (apiEvent.isActive && apiEvent.isStarted && apiEvent.isLive && !apiEvent.isOver)
                eventStatus = EventStatus.LIVE;
              else if (
                apiEvent.isActive &&
                apiEvent.isStarted &&
                !apiEvent.isLive &&
                !apiEvent.isOver
              )
                eventStatus = EventStatus.IN_WINDOW;
              else if (apiEvent.isOver) eventStatus = EventStatus.COMPLETED;

              let eventStartDate: Date = null;
              let eventEndDate: Date = null;
              if (apiEvent.startTimestamp)
                eventStartDate = parse(apiEvent.startTimestamp, DATE_FORMAT, now);
              else if (apiEvent.startDate)
                eventStartDate = parse(apiEvent.startDate, "yyyy-MM-dd", now);

              if (apiEvent.endTimestamp)
                eventEndDate = parse(apiEvent.endTimestamp, DATE_FORMAT, now);
              else if (apiEvent.endDate) eventEndDate = parse(apiEvent.endDate, "yyyy-MM-dd", now);

              eventStartDate = zonedTimeToUtc(eventStartDate, apiEvent.timezone);
              eventEndDate = zonedTimeToUtc(eventEndDate, apiEvent.timezone);

              if (dbEvent.eventStatus !== eventStatus) {
                await transactionalEntityManager.update(
                  Events,
                  {
                    id: dbEvent.id,
                  },
                  {
                    eventStatus,
                    startDate: eventStartDate,
                    endDate: eventEndDate,
                    isEventWinnerMarketOpen: eventStatus !== EventStatus.COMPLETED,
                  },
                );
              }
              if (eventStatus === EventStatus.NEXT) {
                // check to see if the api has heats and the db does not
                // this happens when the sync events has not run but the new data event has shown up
                const dbHeatsCheck = await transactionalEntityManager.findOne(RoundHeats, {
                  // the provider null check is added because when seeds are updated manually then data is created
                  // without the provider so that would need to be updated
                  where: { eventId: dbEvent.id, providerId: Not(IsNull()) },
                  select: {
                    id: true,
                  },
                });

                if (!dbHeatsCheck && heats && Object.keys(heats)) {
                  // run a manual sync to fetch the data for the event and sync it
                  await this.syncScheduledEvents(transactionalEntityManager);
                  return true;
                }
              } else if (eventStatus === EventStatus.COMPLETED) {
                // mark all rounds and all heats as completed
                await Promise.all([
                  transactionalEntityManager.update(
                    EventRounds,
                    {
                      eventId: dbEvent.id,
                    },
                    {
                      roundStatus: RoundStatus.COMPLETED,
                    },
                  ),
                  transactionalEntityManager.update(
                    RoundHeats,
                    { eventId: dbEvent.id },
                    { heatStatus: HeatStatus.COMPLETED },
                  ),
                ]);
              }

              if (![EventStatus.LIVE, EventStatus.IN_WINDOW].includes(eventStatus)) return true;

              // since the event is live, update the rounds, heats and scores
              if (!rounds || (rounds && !Object.keys(rounds))) return false;
              // fetch the rounds that are not completed and update those
              const dbEventRounds = await transactionalEntityManager.find(EventRounds, {
                where: {
                  eventId: dbEvent.id,
                  roundStatus: In([RoundStatus.NEXT, RoundStatus.LIVE, RoundStatus.UPCOMING]),
                  isActive: true,
                  isArchived: false,
                  providerId: Not(IsNull()),
                },
                select: {
                  id: true,
                  roundStatus: true,
                  providerId: true,
                },
              });

              // loop through the api rounds and update the rounds which don't match
              const roundPromises = Object.keys(rounds)
                .filter((key) => apiEvent.roundIds.includes(key))
                .map((key) => rounds[key])
                .map(async (roundRow) => {
                  let roundStatus: RoundStatus = RoundStatus.UPCOMING;
                  if ((roundRow.isActive || roundRow.isStarted) && !roundRow.isOver)
                    roundStatus = RoundStatus.LIVE;
                  else if (roundRow.isOver) roundStatus = RoundStatus.COMPLETED;

                  const dbRoundRow = dbEventRounds.find(
                    (row) => row.providerId === roundRow.roundId,
                  );
                  if (!dbRoundRow) return null;

                  if (
                    (dbRoundRow.roundStatus === RoundStatus.LIVE ||
                      roundStatus === RoundStatus.LIVE) &&
                    isEventInStandby
                  ) {
                    // hack because the wsl API is broken and returns a heat and round as live even if its completed
                    roundStatus = RoundStatus.COMPLETED;
                  }

                  if (dbRoundRow.roundStatus !== roundStatus) {
                    await transactionalEntityManager.update(
                      EventRounds,
                      {
                        id: dbRoundRow.id,
                      },
                      {
                        roundStatus,
                        startDate: roundRow.startTime
                          ? parse(roundRow.startTime, DATE_FORMAT, now)
                          : null,
                        endDate: roundRow.endTime
                          ? parse(roundRow.endTime, DATE_FORMAT, now)
                          : null,
                      },
                    );
                  }

                  return null;
                });
              await Promise.all(roundPromises);

              if (!heats || (heats && !Object.keys(heats))) return false;

              // update the heats data, fetch all heats from the db that are upcoming or live
              // match against the api and update status
              const dbHeats = await transactionalEntityManager.find(RoundHeats, {
                where: {
                  eventId: dbEvent.id,
                  // heatStatus: In([HeatStatus.NEXT, HeatStatus.LIVE, HeatStatus.UPCOMING]),
                  isActive: true,
                  isArchived: false,
                  providerId: Not(IsNull()),
                },
                select: {
                  id: true,
                  heatStatus: true,
                  providerId: true,
                  winnerAthleteId: true,
                },
              });

              let hasAnyHeatChanged: boolean = false;
              const heatPromises = Object.values(heats)
                .filter((heatRow) => apiEvent.roundIds.includes(heatRow.roundId))
                .map(async (heatRow) => {
                  let heatStatus: HeatStatus = HeatStatus.UPCOMING;
                  if ((heatRow.isActive || heatRow.isStarted || heatRow.isLive) && !heatRow.isOver)
                    heatStatus = HeatStatus.LIVE;
                  else if (heatRow.isOver) heatStatus = HeatStatus.COMPLETED;

                  const dbRoundHeat: RoundHeats = dbHeats.find(
                    (dbHeatsRow) => dbHeatsRow.providerId === heatRow.heatId,
                  );

                  if (!dbRoundHeat) {
                    // console.log("WSL SYNC L&V API creating heat", JSON.stringify(heatRow));
                    // console.log("WSL SYNC L&V API apiEvents", JSON.stringify(apiEvents));
                    // console.log("WSL SYNC L&V API apiEventAlt", JSON.stringify(apiEventAlt));

                    const dbEventRoundRow: EventRounds = await transactionalEntityManager.findOne(
                      EventRounds,
                      {
                        where: {
                          eventId: dbEvent.id,
                          providerId: heatRow.roundId,
                          isActive: true,
                          isArchived: false,
                        },
                        select: {
                          id: true,
                          eventId: true,
                          roundId: true,
                          providerId: true,
                        },
                      },
                    );

                    // this happens because wsl does not send heat data before hand so create it
                    await transactionalEntityManager.save(
                      this.heatsRepository.create({
                        eventId: dbEvent.id,
                        roundId: dbEventRoundRow.roundId,
                        heatNo: heatRow.heatNumber,
                        heatStatus,
                        startDate: heatRow.startTime
                          ? parse(heatRow.startTime, DATE_FORMAT, now)
                          : null,
                        endDate: heatRow.endTime ? parse(heatRow.endTime, DATE_FORMAT, now) : null,

                        heatName: `Heat`,
                        isHeatWinnerMarketOpen: heatStatus === HeatStatus.UPCOMING,
                        isHeatWinnerMarketVoided: false,
                        providerId: heatRow.heatId,
                      }),
                    );

                    // no need to update status because that just happened
                    return null;
                  }

                  if (
                    (dbRoundHeat.heatStatus === HeatStatus.LIVE ||
                      heatStatus === HeatStatus.LIVE) &&
                    isEventInStandby
                  ) {
                    // hack because the wsl API is broken and returns a heat and round as live even if its completed
                    heatStatus = HeatStatus.COMPLETED;
                  }

                  if (dbRoundHeat.heatStatus !== heatStatus) {
                    // the heat has changed so it could be going from live to completed
                    // in that case update the scores
                    hasAnyHeatChanged = true;

                    await transactionalEntityManager.update(
                      RoundHeats,
                      {
                        id: dbRoundHeat.id,
                      },
                      {
                        heatStatus,
                        startDate: heatRow.startTime
                          ? parse(heatRow.startTime, DATE_FORMAT, now)
                          : null,
                        endDate: heatRow.endTime ? parse(heatRow.endTime, DATE_FORMAT, now) : null,
                      },
                    );
                  }

                  // check if the heat completed and set the heat winner
                  if (heatRow.isOver && !dbRoundHeat.winnerAthleteId) {
                    const winner = Object.values(heatRow.athletes).find(
                      (itemRow) => itemRow.place === 1,
                    );
                    if (winner) {
                      const dbAthlete = await transactionalEntityManager.findOne(Athletes, {
                        where: {
                          providerId: winner.athleteId,
                          isActive: true,
                          isArchived: false,
                        },
                        select: {
                          id: true,
                          providerId: true,
                        },
                      });
                      const promises = [];
                      promises.push(
                        transactionalEntityManager.update(
                          RoundHeats,
                          {
                            id: dbRoundHeat.id,
                          },
                          {
                            winnerAthleteId: dbAthlete.id,
                          },
                        ),
                      );

                      if (eventStatus === EventStatus.COMPLETED && !dbEvent.winnerAthleteId) {
                        promises.push(
                          transactionalEntityManager.update(
                            Events,
                            {
                              id: dbEvent.id,
                            },
                            {
                              winnerAthleteId: dbAthlete.id,
                            },
                          ),
                        );
                      }
                      await Promise.all(promises);
                    }
                  }

                  return null;
                });
              await Promise.all(heatPromises);

              if (
                hasAnyHeatChanged &&
                [EventStatus.LIVE, EventStatus.IN_WINDOW].includes(eventStatus)
              ) {
                // console.log("WSL SYNC L&V heat status changed so running schedule sync");
                // before the sync starts, check if there are any live events
                // because WSL does not update the rounds and heats of events before hand so all data is not always available
                // hence make a call to sync live data regularly
                await this.syncScheduledEvents(transactionalEntityManager, [dbEvent.providerId]);
                // await this.queueService.notifyEventUpdate({
                //   eventId: dbEvent.id,
                //   delaySeconds: 15,
                //   sportType: SportsTypes.SURFING,
                // });
              }

              const trackingHeatProviderIds: string[] = dbHeats.map((row) => row.providerId);

              const eventParticipants: EventParticipants[] = await transactionalEntityManager.find(
                EventParticipants,
                {
                  where: {
                    eventId: dbEvent.id,
                    isActive: true,
                    isArchived: false,
                  },
                  relations: ["athlete"],
                  select: {
                    id: true,
                    eventId: true,
                    athleteId: true,
                    athlete: {
                      id: true,
                      providerId: true,
                    },
                  },
                },
              );

              const apiHeats = Object.values(heats).filter((heatRow) =>
                trackingHeatProviderIds.includes(heatRow.heatId),
              );

              let maxSeed: number = 1;
              const hasZeroBasedSeed: boolean = Object.values(eventAthletes)
                .map((row) => Object.values(row.eventStats))
                .flat()
                .some((row) => {
                  if (row.seed > maxSeed) maxSeed = row.seed;
                  return row.seed === 0;
                });
              let athleteCount: number = !hasZeroBasedSeed
                ? Object.keys(eventAthletes).length
                : maxSeed;
              const scores: Scores[] = [];
              for await (const apiHeat of apiHeats) {
                const { athletes = null } = apiHeat;
                if (!athletes || (athletes && !Object.keys(athletes))) continue;

                // no need to worry about creating athlete since that is taken care by the seeding function call

                // find the participants for the given heat
                scores.push(
                  ...Object.values(apiHeat.athletes).map((itemRow) => {
                    const eventParticipant = eventParticipants.find(
                      (eventParticipantRow) =>
                        eventParticipantRow.athlete.providerId === itemRow.athleteId,
                    );

                    const dbHeat: RoundHeats = dbHeats.find(
                      (row) => row.providerId === apiHeat.heatId,
                    );

                    const athleteStats = Object.values(eventAthletes).find(
                      (athleteRow) => athleteRow.athleteId === itemRow.athleteId,
                    );

                    return {
                      eventId: dbEvent.id,
                      roundHeatId: dbHeat.id,
                      athleteId: eventParticipant.athleteId,
                      heatScore: itemRow.score,
                      heatPosition: itemRow.place,
                      roundSeed:
                        athleteStats.eventStats[dbEvent.providerId].seed !== 0
                          ? athleteStats.eventStats[dbEvent.providerId].seed
                          : ++athleteCount,
                    } as Scores;
                  }),
                );
              }

              if (scores.length)
                await transactionalEntityManager.upsert(Scores, scores, {
                  conflictPaths: ["eventId", "roundHeatId", "athleteId"],
                });
            } catch (eventError) {
              throw eventError;
            }
          }
        },
      );

      await this.syncOpenBet(openbetSyncIds);

      return true;
    } catch (error) {
      throw error;
    }
  }

  async syncEvents() {
    try {
      await this.eventsRepository.manager.transaction(
        async (transactionalEntityManager: EntityManager) => {
          const result = await this.syncScheduledEvents(transactionalEntityManager);
          return result;
        },
      );

      return true;
    } catch (error) {
      throw error;
    }
  }

  private async syncScheduledEvents(
    transactionalEntityManager: EntityManager,
    liveEventProviderIds: string[] = [],
  ): Promise<boolean> {
    try {
      const openbetSyncIds: string[] = [];
      const now = new Date();
      const currentYear: number = now.getFullYear();
      // manually setting this for the sync
      // const currentYear: number = 2024;
      // since JS is zero based
      const currentMonth = now.getMonth() + 1;

      const tours: ITour[] = await this.wslService.fetchTours();

      // maintain a list of tours locally in order to indentify and query faster
      const localTours: {
        providerTourId: string;
        dbTourId: string;
        dbTourYearId: string;
        gender: Gender;
        year: number;
      }[] = [];

      // ensure tour data is intact
      for await (const tourRow of tours) {
        let tourId: string;
        const tour = await transactionalEntityManager.findOne(Tours, {
          where: {
            providerId: tourRow.id,
          },
          select: {
            id: true,
            providerId: true,
          },
        });
        tourId = tour?.id;

        if (!tour) {
          tourId = v4();
          await transactionalEntityManager.insert(Tours, {
            id: tourId,
            name: tourRow.name,
            gender: tourRow.gender,
            providerId: tourRow.id,
          });
        }

        let dbTourYearId: string;
        const tourYear = await transactionalEntityManager.findOne(TourYears, {
          where: {
            tourId,
            year: currentYear,
          },
          select: {
            id: true,
          },
        });
        dbTourYearId = tourYear?.id;

        if (!tourYear) {
          dbTourYearId = v4();
          await transactionalEntityManager.insert(TourYears, {
            id: dbTourYearId,
            tourId,
            year: currentYear,
          });
        }

        localTours.push({
          dbTourId: tourId,
          dbTourYearId,
          providerTourId: tourRow.id,
          // year: tourRow.year,
          year: currentYear,
          gender: tourRow.gender,
        });
      }

      // query api to get all events for the current year
      const tourEventList: ITourEvents = await this.wslService.fetchEventsByYear(currentYear);

      const { mens = [], womens = [] } = tourEventList;

      // only need to handle the data for the current month and beyond
      const mensEventsIds = mens.filter((row) =>
        currentMonth !== 12 ? row.month >= currentMonth : true,
      );
      const womensEventsIds = womens.filter((row) =>
        currentMonth !== 12 ? row.month >= currentMonth : true,
      );

      const dbRounds: Rounds[] = await transactionalEntityManager.find(Rounds, {
        select: {
          id: true,
          name: true,
          roundNo: true,
        },
      });

      const localDbRounds: Rounds[] = dbRounds.map((row) => row);

      // loop throug the events for each gender and then update the data
      // const genders: Gender[] = [Gender.MALE];
      const genders: Gender[] = [Gender.MALE, Gender.FEMALE];
      for await (const gender of genders) {
        const eventRows: ITourItem[] = gender === Gender.MALE ? mensEventsIds : womensEventsIds;

        // setting it here because based on the gender the rounds change
        // so this will automatically reset at the change of the gender
        const localRounds: {
          providerRoundId: string;
          dbRoundId: string;
          roundNo: number;
          startTime: string | null;
          endTime: string | null;
        }[] = [];

        // only handling events that do not exist
        // so if an event exists then assuming that all is right
        for await (const eventRow of eventRows) {
          // this is to allow quick syncs for live events only
          if (liveEventProviderIds.length && !liveEventProviderIds.includes(eventRow.eventId))
            continue;

          // const apiEvents = await this.wslService.fetchEventDetails(eventRow.eventId);
          // const { events, locations, rounds = null, heats = null } = apiEvents;
          const [apiEvents, apiEventAlt] = await Promise.all([
            this.wslService.fetchEventDetails(eventRow.eventId),
            this.wslService.fetchEventAltDetails(eventRow.eventId),
          ]);
          const { events, locations } = apiEvents;
          const { rounds = null, heats = null } = apiEventAlt;

          // if rounds does not exist or heat does not exist
          // this means the event is upcoming and the api has not updated yet
          // do no insert the event data so it can be picked later

          const event: Event = events[eventRow.eventId];
          const isEventInStandby: boolean = event.eventStatus === "standby";

          // only process if the event is upcoming
          // completed events do not need to be processed and live events are processed by the live function
          if (event.isOver || event.isLive) continue;

          const dbEvent = await transactionalEntityManager.findOne(Events, {
            where: {
              providerId: eventRow.eventId,
            },
            select: {
              id: true,
              providerId: true,
              isEventWinnerMarketOpen: true,
            },
          });

          let eventStatus: EventStatus = EventStatus.UPCOMING;
          if (event.isActive && event.isStarted && event.isLive && !event.isOver)
            eventStatus = EventStatus.LIVE;
          else if (event.isActive && event.isStarted && !event.isLive && !event.isOver)
            eventStatus = EventStatus.IN_WINDOW;
          else if (event.isOver) eventStatus = EventStatus.COMPLETED;

          let eventStartDate: Date = null;
          let eventEndDate: Date = null;
          if (event.startTimestamp) eventStartDate = parse(event.startTimestamp, DATE_FORMAT, now);
          else if (event.startDate) eventStartDate = parse(event.startDate, "yyyy-MM-dd", now);

          if (event.endTimestamp) eventEndDate = parse(event.endTimestamp, DATE_FORMAT, now);
          else if (event.endDate) eventEndDate = parse(event.endDate, "yyyy-MM-dd", now);

          eventStartDate = zonedTimeToUtc(eventStartDate, event.timezone);
          eventEndDate = zonedTimeToUtc(eventEndDate, event.timezone);

          const dbEventRow: Events = this.eventsRepository.create({
            id: !dbEvent ? v4() : dbEvent.id,
            tourYearId: localTours.find(
              (tourRow) => tourRow.year === event.year && tourRow.gender === gender,
            ).dbTourYearId,
            name: event.name,
            startDate: eventStartDate,
            endDate: eventEndDate,
            eventNumber: event.stopNumber,
            eventStatus,
            eventLocation: event.locationName,
            eventLocationGroup: locations?.[event?.locationId]?.name,
            providerId: eventRow.eventId,
            isEventWinnerMarketOpen: dbEvent ? dbEvent.isEventWinnerMarketOpen || true : true,
          });
          await transactionalEntityManager.save(dbEventRow);

          openbetSyncIds.push(dbEventRow.id);

          // if rounds do not exist then no point in going further
          if (!rounds || (rounds && !Object.keys(rounds))) continue;

          // check if all the rounds exists for the event
          const apiEventRounds = Object.keys(rounds)
            .filter((key) => event.roundIds.includes(key))
            .map((key) => rounds[key])
            .map((roundRow) => {
              let roundStatus: RoundStatus = RoundStatus.UPCOMING;
              if ((roundRow.isActive || roundRow.isStarted) && !roundRow.isOver)
                roundStatus = RoundStatus.LIVE;
              else if (roundRow.isOver) roundStatus = RoundStatus.COMPLETED;

              return {
                providerRoundId: roundRow.roundId,
                roundNo: roundRow.roundNumber,
                name: roundRow.name,
                startTime: roundRow.startTime,
                endTime: roundRow.endTime,
                roundStatus,
              };
            });

          // loop through each round and check if it exists in the local copy
          // if not then insert the data into the rounds table
          for await (const apiEventRound of apiEventRounds) {
            const localRound = localRounds.some(
              (localRoundRow) => localRoundRow.providerRoundId === apiEventRound.providerRoundId,
            );
            if (!localRound) {
              // check if it exists in the db
              const dbRoundRow = localDbRounds.find(
                (roundRow) =>
                  roundRow.name === apiEventRound.name &&
                  roundRow.roundNo === apiEventRound.roundNo,
              );

              const dbRoundId = dbRoundRow ? dbRoundRow.id : v4();
              if (!dbRoundRow) {
                const dbRound: Rounds = this.roundsRepository.create({
                  id: dbRoundId,
                  name: apiEventRound.name,
                  roundNo: apiEventRound.roundNo,
                });
                await transactionalEntityManager.save(dbRound);

                localDbRounds.push(dbRound);
              }

              localRounds.push({
                dbRoundId,
                providerRoundId: apiEventRound.providerRoundId,
                roundNo: apiEventRound.roundNo,
                startTime: apiEventRound.startTime,
                endTime: apiEventRound.endTime,
              });
            }
          }
          const validRoundIds: string[] = apiEventRounds.map((row) => row.providerRoundId);

          const dbEventRounds: EventRounds[] = await transactionalEntityManager.find(EventRounds, {
            where: {
              eventId: dbEventRow.id,
            },
            relations: ["round"],
            select: {
              id: true,
              roundStatus: true,
              eventId: true,
              roundId: true,
              providerId: true,
              round: {
                id: true,
                name: true,
                roundNo: true,
              },
            },
          });

          const eventRounds: EventRounds[] = apiEventRounds.map((row) => {
            let dbEventRound: EventRounds = dbEventRounds.find(
              (dbEventRoundRow) => dbEventRoundRow.providerId === row.providerRoundId,
            );

            if (!dbEventRound) {
              // this happens when the data is uploaded manually before the seeds and rounds are available
              // in this case the data exists but the provider id does not so check based on name
              dbEventRound = dbEventRounds.find(
                (dbEventRoundRow) =>
                  dbEventRoundRow.round.name === row.name &&
                  dbEventRoundRow.round.roundNo === row.roundNo,
              );
            }
            let roundStatus: RoundStatus = row.roundStatus;

            if (
              (dbEventRound?.roundStatus === RoundStatus.LIVE ||
                roundStatus === RoundStatus.LIVE) &&
              isEventInStandby
            ) {
              // hack because the wsl API is broken and returns a heat and round as live even if its completed
              roundStatus = RoundStatus.COMPLETED;
            }

            return this.eventRoundsRepository.create({
              id: !dbEventRound ? v4() : dbEventRound.id,
              eventId: dbEventRow.id,
              roundId: localRounds.find(
                (roundRow) => roundRow.providerRoundId === row.providerRoundId,
              ).dbRoundId,
              startDate: row.startTime ? parse(row.startTime, DATE_FORMAT, now) : null,
              endDate: row.endTime ? parse(row.endTime, DATE_FORMAT, now) : null,

              providerId: `${row.providerRoundId}`,
              roundStatus,
            });
          });
          if (eventRounds.length) await transactionalEntityManager.save(eventRounds);

          // heats do not exist for upcoming events so only handle this if heats exist
          if (heats && Object.keys(heats)) {
            const dbHeats: RoundHeats[] = await transactionalEntityManager.find(RoundHeats, {
              where: {
                eventId: dbEventRow.id,
              },
              select: {
                id: true,
                heatStatus: true,
                heatName: true,
                heatNo: true,
                eventId: true,
                roundId: true,
                providerId: true,
                isHeatWinnerMarketOpen: true,
                isHeatWinnerMarketVoided: true,
              },
            });

            // since the event does not exist, insert the heats as well
            const dbHeatRows: RoundHeats[] = Object.values(heats)
              .filter((heatRow) => validRoundIds.includes(heatRow.roundId))
              .map((heatRow) => {
                let heatStatus: HeatStatus = HeatStatus.UPCOMING;
                if ((heatRow.isActive || heatRow.isStarted || heatRow.isLive) && !heatRow.isOver)
                  heatStatus = HeatStatus.LIVE;
                else if (heatRow.isOver) heatStatus = HeatStatus.COMPLETED;

                let dbRoundHeat: RoundHeats = dbHeats.find(
                  (dbHeatsRow) => dbHeatsRow.providerId === heatRow.heatId,
                );

                if (!dbRoundHeat) {
                  // this happens when the data is uploaded manually before the seeds and rounds are available
                  // in this case the data exists but the provider id does not so check based on name

                  const evenRound: EventRounds = eventRounds.find(
                    (eventRoundRow) => eventRoundRow.providerId === heatRow.roundId,
                  );

                  dbRoundHeat = dbHeats.find(
                    (dbHeatsRow) =>
                      dbHeatsRow.heatNo === heatRow.heatNumber &&
                      dbHeatsRow.roundId === evenRound.roundId,
                  );
                }

                if (
                  (dbRoundHeat?.heatStatus === HeatStatus.LIVE || heatStatus === HeatStatus.LIVE) &&
                  isEventInStandby
                ) {
                  // hack because the wsl API is broken and returns a heat and round as live even if its completed
                  heatStatus = HeatStatus.COMPLETED;
                }

                return this.heatsRepository.create({
                  id: !dbRoundHeat ? v4() : dbRoundHeat.id,
                  eventId: dbEventRow.id,
                  roundId: localRounds.find(
                    (roundRow) => roundRow.providerRoundId === heatRow.roundId,
                  ).dbRoundId,
                  heatNo: heatRow.heatNumber,
                  heatStatus,
                  startDate: heatRow.startTime ? parse(heatRow.startTime, DATE_FORMAT, now) : null,
                  endDate: heatRow.endTime ? parse(heatRow.endTime, DATE_FORMAT, now) : null,

                  heatName: `Heat`,
                  isHeatWinnerMarketOpen: dbRoundHeat
                    ? dbRoundHeat.isHeatWinnerMarketOpen || true
                    : true,
                  isHeatWinnerMarketVoided: dbRoundHeat
                    ? dbRoundHeat.isHeatWinnerMarketVoided || false
                    : false,
                  providerId: heatRow.heatId,
                });
              });

            if (dbHeatRows.length) {
              await transactionalEntityManager.save(dbHeatRows);
              // console.log("WSL SYNC API heats", dbHeatRows.length);
              // console.log("WSL SYNC API apiEvents", JSON.stringify(apiEvents));
              // console.log("WSL SYNC API apiEventAlt", JSON.stringify(apiEventAlt));
            }
          }
        }
      }

      await this.syncOpenBet(openbetSyncIds);

      return true;
    } catch (error) {
      throw error;
    }
  }

  private async updateEventSeeds(
    transactionalEntityManager: EntityManager,
    dbEvents: Events[],
  ): Promise<boolean> {
    const now: Date = new Date();

    for await (const dbEvent of dbEvents) {
      const difference = differenceInDays(dbEvent.startDate, now);

      // too early, skip any processing
      if (difference > 7) continue;

      if (dbEvent.eventStatus === EventStatus.UPCOMING && difference <= 7) {
        await transactionalEntityManager.update(
          Events,
          {
            id: dbEvent.id,
          },
          {
            eventStatus: EventStatus.NEXT,
          },
        );
      }

      const [apiEvents, apiEventAlt] = await Promise.all([
        this.wslService.fetchEventDetails(dbEvent.providerId),
        this.wslService.fetchEventAltDetails(dbEvent.providerId),
      ]);
      const { events, athletes } = apiEvents;
      const { rounds = null, heats = null } = apiEventAlt;

      if (!athletes || (athletes && !Object.keys(athletes))) continue;

      const event = events?.[dbEvent.providerId];
      if (!event) continue;

      const athleteIds: string[] = event.athleteIds || [];
      const apiValidAthletes = Object.values(athletes).filter((row) =>
        athleteIds.includes(row.athleteId),
      );

      const existingEventParticipants: EventParticipants[] = await transactionalEntityManager.find(
        EventParticipants,
        {
          where: {
            eventId: dbEvent.id,
            isActive: true,
            isArchived: false,
          },
          relations: ["athlete"],
          select: {
            id: true,
            eventId: true,
            athleteId: true,
            baseProjection: true,
            status: true,
            athlete: {
              id: true,
              providerId: true,
            },
          },
        },
      );

      if ([EventStatus.LIVE, EventStatus.IN_WINDOW].includes(dbEvent.eventStatus)) {
        // if the event is live then validate that all participants exists
        // and no replacement or wildcards have happened
        const dbAthleteProviderIds = existingEventParticipants
          .map((eventParticipant) => +eventParticipant.athlete.providerId)
          .sort((a, b) => a - b);
        const apiAthleteProviderIds = apiValidAthletes
          .map((row) => +row.athleteId)
          .sort((a, b) => a - b);
        const hasParticipantsChanged: boolean = !isAssetEqual(
          dbAthleteProviderIds,
          apiAthleteProviderIds,
        );
        // no change, no need to do anything
        if (!hasParticipantsChanged) continue;
      }

      // const eventGender: Gender = tours[event.tourId].gender === "M" ? Gender.MALE : Gender.FEMALE;

      let maxSeed: number = 1;
      const hasZeroBasedSeed: boolean = Object.values(athletes)
        .map((row) => Object.values(row.eventStats))
        .flat()
        .some((row) => {
          if (row.seed > maxSeed) maxSeed = row.seed;
          return row.seed === 0;
        });
      // const hasZeroBasedTier: boolean = Object.values(athletes)
      //   .map((row) => Object.values(row.eventStats))
      //   .flat()
      //   .some((row) => row.tier === 0);

      let athleteCount: number = !hasZeroBasedSeed ? Object.keys(athletes).length : maxSeed;
      // : Object.keys(athletes).length - 1;
      const lastTier: number = Math.max(
        ...Object.values(athletes)
          .map((row) => Object.values(row.eventStats))
          .flat()
          .map((row) => row.tier),
      );
      // loop throug the athlete and insert them if they do not exist
      const dbEventAthletes: {
        athlete: Athletes;
        seedNo: number;
        tier: number;
      }[] = await Promise.all(
        apiValidAthletes.map(async (row) => {
          // Wsl service does not handle middle name and dumps the middle name in the first name instead
          // so rememdy is to assume that first name is the first word in the string
          // and all words are separated by spaces so everything else is middle name
          const nameSplit: string[] = row.firstName.trim().split(" ");
          const firstName: string = nameSplit[0]?.trim();
          const middleName: string = nameSplit.slice(1).join(" ");

          const nameWhere: FindOptionsWhere<Athletes> = {
            firstName,
            lastName: row.lastName,
          };
          if (middleName) nameWhere.middleName = middleName;

          // fetching out rows because there is inconsitent data where one athlete has 2 rows
          // 1 row has the provider id while the other doesn't and that is causing issues
          const athleteRows: Athletes[] = await transactionalEntityManager.find(Athletes, {
            where: [
              {
                providerId: row.athleteId,
              },
              // keeping this here because when running the interim seeds, there are no provider ids
              nameWhere,
            ],
            select: {
              id: true,
              providerId: true,
            },
          });

          let athleteRow: Athletes = null;

          if (athleteRows.length > 1) {
            // more than 1 row is found
            // find the one that has the provider id and select that
            athleteRow = athleteRows.find((athleteRowItem) => !!athleteRowItem.providerId);
            // pick any if nothing is found
            if (!athleteRow) [athleteRow] = athleteRows;
          } else if (athleteRows.length === 1) {
            // only 1 is found, pick that
            [athleteRow] = athleteRows;
          }

          const athleteItem = this.athleteRepository.create({
            id: athleteRow?.id || v4(),
            firstName,
            middleName: middleName || null,
            lastName: row.lastName,
            dob: row.birthdate ? parse(row.birthdate, "yyyy-MM-dd", now) : null,
            gender: row.gender === "M" ? Gender.MALE : Gender.FEMALE,
            nationality: row.nationAbbr,
            stance: row.stance,
            hometown: row.hometown,
            providerId: row.athleteId,
          });

          if (!athleteRow || !athleteRow.providerId)
            await transactionalEntityManager.save(athleteItem);

          return {
            athlete: athleteItem,
            // if not zero based then take the seed as is,
            // if zero based then move the zero at the end of the event and increment count in case there are other zeros
            seedNo:
              row.eventStats[dbEvent.providerId].seed !== 0
                ? row.eventStats[dbEvent.providerId].seed
                : ++athleteCount,
            // for zero based seed athlete, they are added to the last tier
            tier:
              row.eventStats[dbEvent.providerId].tier !== 0
                ? row.eventStats[dbEvent.providerId].tier
                : lastTier,
            // seedNo: !hasZeroBasedSeed
            //   ? row.eventStats[dbEvent.providerId].seed
            //   : row.eventStats[dbEvent.providerId].seed + 1,
          };
        }),
      );

      // archive existing and re-instate later
      await transactionalEntityManager.update(
        EventParticipants,
        {
          eventId: dbEvent.id,
        },
        {
          isActive: false,
          isArchived: true,
          // status: AthleteStatus.INACTIVE,
        },
      );

      // set the heat averages for the projection calculations
      // if (!this.mensHeatAverage && eventGender === Gender.MALE)
      //   this.mensHeatAverage = await this.wslHelperService.fetchHeatStandardDeviation(Gender.MALE);
      // if (!this.womenHeatAverage && eventGender === Gender.FEMALE)
      //   this.womenHeatAverage = await this.wslHelperService.fetchHeatStandardDeviation(
      //     Gender.FEMALE,
      //   );

      // fetch the weights for the event
      // const eventWeights = await this.simulationWeightRepository.find({
      //   where: {
      //     eventId: dbEvent.id,
      //   },
      //   select: {
      //     type: true,
      //     year: true,
      //     location: true,
      //     weight: true,
      //   },
      // });

      // for upcoming events this will seed the data
      // for live events this might create new athlete event participants
      const characterACode = 64; // subtracting one to account for the addition
      // let currentTier: number = !hasZeroBasedTier ? 1 : 0;
      let currentTier: number = 1;
      let currentTierCount: number = 1;
      const eventParticipantRows: EventParticipants[] = [];
      // sorting in order to make sure that the tiers are aligned correctly
      const sortedAthletes = dbEventAthletes.sort((a, b) => a.seedNo - b.seedNo);

      for await (const { athlete: eventAthlete, seedNo, tier } of sortedAthletes) {
        const eventParticipant = existingEventParticipants.find(
          (row) => row.athleteId === eventAthlete.id,
        );

        if (tier !== currentTier) {
          currentTier = tier;
          currentTierCount = 1;
        }

        // const projection: number = eventParticipant?.baseProjection
        //   ? eventParticipant.baseProjection
        //   : await this.wslHelperService.fetchAthleteProjection(
        //       eventAthlete.id,
        //       eventGender,
        //       eventWeights,
        //     );

        eventParticipantRows.push(
          this.eventParticipantsRepository.create({
            id: eventParticipant?.id || v4(),
            eventId: dbEvent.id,
            athleteId: eventAthlete.id,
            seedNo,
            tier: String.fromCharCode(characterACode + currentTier),
            tierSeed: `${currentTierCount++}`,
            baseProjection: eventParticipant?.baseProjection,
            isActive: true,
            isArchived: false,
            status:
              eventParticipant && ![AthleteStatus.INACTIVE].includes(eventParticipant.status)
                ? eventParticipant.status
                : AthleteStatus.ACTIVE,
          }),
        );
      }

      if (eventParticipantRows.length) await transactionalEntityManager.save(eventParticipantRows);

      if ([EventStatus.LIVE, EventStatus.IN_WINDOW].includes(dbEvent.eventStatus)) {
        // no need to go any further because that only applies to upcoming and next events
        continue;
      }

      if (!heats || (heats && !Object.keys(heats))) continue;
      if (!rounds || (rounds && !Object.keys(rounds))) continue;

      // since the event is upcoming or next, opening round scores can be deleted
      // and re-inserted
      await transactionalEntityManager.delete(Scores, {
        eventId: dbEvent.id,
      });

      let dbHeatsWhere: FindOptionsWhere<RoundHeats> = {
        eventId: dbEvent.id,
        round: {
          roundNo: 1,
        },
      };

      if (IS_FINALS)
        dbHeatsWhere = {
          eventId: dbEvent.id,
        };

      const dbHeats: RoundHeats[] = await transactionalEntityManager.find(RoundHeats, {
        where: dbHeatsWhere,
        select: {
          id: true,
          eventId: true,
          roundId: true,
          providerId: true,
          round: {
            id: true,
            roundNo: true,
          },
        },
        relations: ["round"],
      });
      if (dbEvent.eventStatus === EventStatus.NEXT && dbHeats.length <= 0) {
        // likely that this is the first time this seed is running in which case the data was just added
        // give a change for heats to run before this bit of code runs

        return true;
      }

      const newScores: Scores[] = Object.values(heats)
        .filter((heatRow) => event.roundIds.includes(heatRow.roundId))
        .map((row) => {
          const dbRoundHeat = dbHeats.find((dbHeatRow) => dbHeatRow.providerId === row.heatId);

          const insertScores: Scores[] = row.athleteIds.map((athleteId) => {
            const dbAthlete = dbEventAthletes.find(
              ({ athlete: itemRow }) => itemRow.providerId === athleteId,
            );
            const eventParticipant = eventParticipantRows.find(
              (itemRow) => itemRow.athleteId === dbAthlete.athlete.id,
            );

            return this.scoresRepository.create({
              eventId: dbEvent.id,
              roundHeatId: dbRoundHeat.id,
              athleteId: dbAthlete.athlete.id,
              roundSeed: eventParticipant.seedNo,
            });
          });

          return insertScores;
        })
        .flat();
      if (newScores.length) {
        await transactionalEntityManager.save(newScores);
        // console.log("WSL SYNC API scores", newScores.length);
        // console.log("WSL SYNC API apiEvents", JSON.stringify(apiEvents));
        // console.log("WSL SYNC API apiEventAlt", JSON.stringify(apiEventAlt));
      }

      // const existingEventParticipantProviderIds: number[] = existingEventParticipants
      //   .map((row) => +row.athlete.providerId)
      //   .sort((a, b) => a - b);
      // const updateEventParticipantProviderIds: number[] = apiValidAthletes
      //   .map((row) => +row.athleteId)
      //   .sort((a, b) => a - b);
      // const isParticipantsModified: boolean = !isAssetEqual(
      //   existingEventParticipantProviderIds,
      //   updateEventParticipantProviderIds,
      // );

      // // if there were no event participants or the list has changed then run the sim
      // if (!existingEventParticipantProviderIds.length || isParticipantsModified)
      //   await this.queueService.notifyEventUpdate({
      //     eventId: dbEvent.id,
      //     delaySeconds: 10,
      //     sportType: SportsTypes.SURFING,
      //   });
    }

    return true;
  }

  private async syncOpenBet(eventIds: string[]) {
    // for each event, fetch the event data and sync with openbet
    // this only takes place after all the data has been synced between our database and wsl
    const promises = eventIds.map(async (eventId) => {
      const event = await this.eventsRepository.findOne({
        where: {
          id: eventId,
        },
        select: {
          id: true,
          providerOpenbetFixtureId: true,
          name: true,
          startDate: true,
          endDate: true,
          eventStatus: true,
          eventLocation: true,
          tourYearId: true,
          tourYear: {
            id: true,
            tourId: true,
            tour: {
              id: true,
              name: true,
              gender: true,
            },
          },
        },
        relations: {
          tourYear: {
            tour: true,
          },
        },
      });
      if (!event) return [];

      const eventParticipants = await this.eventParticipantsRepository.find({
        where: {
          eventId,
          seedNo: MoreThan(0),
        },
        select: {
          id: true,
          athleteId: true,
          eventId: true,
          isActive: true,
          isArchived: false,
          athlete: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        relations: {
          athlete: true,
        },
      });

      const fixtureId: string = event.providerOpenbetFixtureId
        ? event.providerOpenbetFixtureId
        : event.id;

      const fixturePayload: Fixture = {
        sport: {
          id: ProviderIdentifiers.SURFING.sportId,
          name: ProviderIdentifiers.SURFING.sportname,
        },
        competition: {
          id: ProviderIdentifiers.SURFING.competitionId,
          name: ProviderIdentifiers.SURFING.competitionname,
          tags: {
            COUNTRY: "WORLD",
          },
        },
        participants: eventParticipants.map((participant) => ({
          id: participant.athlete.id,
          name: `${participant.athlete.firstName} ${participant.athlete.lastName}`,
          side: ParticipantsSide.NONE,
          type: ParticipantsType.INDIVIDUAL,
        })),
        type: FixtureType.RACE,
        id: fixtureId,
        name: `${event.name} - ${event.tourYear.tour.gender.toUpperCase()}`,
        startTime: new Date(event.startDate).toISOString(),
        matchState: MatchState.PRE_MATCH,
        offeredInRunning: false,
        status: FixtureStatus[event.eventStatus],
        venue: event.eventLocation,
      };

      const syncixturePayload: IFixtureBodyPayload = {
        header: {
          timestamp: new Date().toISOString(),
          trackingId: fixtureId,
        },
        fixtureId,
        fixture: fixturePayload,
        markets: [],
      };

      await this.openbetService.createFixture(syncixturePayload);
      // await this.openbetService.updateFixture(syncixturePayload);

      if (!event.providerOpenbetFixtureId)
        await this.eventsRepository.update(
          {
            id: event.id,
          },
          {
            providerOpenbetFixtureId: fixtureId,
          },
        );

      // TODO: need to sync results too
    });

    await Promise.all(promises);

    return true;
  }
}

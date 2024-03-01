import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  Repository,
  EntityManager,
  FindOptionsWhere,
  In,
  Not,
  IsNull,
  LessThanOrEqual,
} from "typeorm";
import { v4 } from "uuid";
import {
  differenceInDays,
  addDays,
  differenceInHours,
  parseISO,
  subMonths,
  isAfter,
} from "date-fns";
import { zonedTimeToUtc } from "date-fns-tz";
import isAssetEqual from "lodash.isequal";

import LeagueYears from "../../../../entities/sls/leagueYears.entity";
import Leagues from "../../../../entities/sls/leagues.entity";
import Events from "../../../../entities/sls/events.entity";
import Rounds from "../../../../entities/sls/rounds.entity";
import EventRounds from "../../../../entities/sls/eventRounds.entity";
import RoundHeats from "../../../../entities/sls/roundHeats.entity";
import Athletes from "../../../../entities/sls/athletes.entity";
import EventParticipants from "../../../../entities/sls/eventParticipants.entity";
import Scores from "../../../../entities/sls/scores.entity";

import SLSService from "../../../../services/sls.service";

import IEvents from "../../../../interfaces/sls/api/event";
import IParsedEventContests, { Participant } from "../../../../interfaces/sls/api/parsedContest";

import { Gender, RoundStatus, EventStatus, AthleteStatus } from "../../../../constants/system";

type EventAthleteParticipant = {
  athlete: Athletes;
  participant: EventParticipants;
};

@Injectable()
export default class SyncSLSService {
  constructor(
    @InjectRepository(Athletes) private readonly athleteRepository: Repository<Athletes>,
    @InjectRepository(Events) private readonly eventsRepository: Repository<Events>,
    @InjectRepository(Rounds) private readonly roundsRepository: Repository<Rounds>,
    @InjectRepository(EventRounds) private readonly eventRoundsRepository: Repository<EventRounds>,
    @InjectRepository(RoundHeats) private readonly heatsRepository: Repository<RoundHeats>,
    @InjectRepository(EventParticipants)
    private readonly eventParticipantsRepository: Repository<EventParticipants>,
    @InjectRepository(Scores) private readonly scoresRepository: Repository<Scores>,
    private readonly slsService: SLSService,
  ) {}

  private async updateEventSeeds(
    transactionalEntityManager: EntityManager,
    dbEvent: Events,
    participants: Participant[],
  ): Promise<EventAthleteParticipant[]> {
    try {
      const now: Date = new Date();

      const difference = differenceInDays(dbEvent.startDate, now);
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
            status: true,
            athlete: {
              id: true,
              providerId: true,
            },
          },
        },
      );

      if (dbEvent.eventStatus === EventStatus.LIVE) {
        // if the event is live then validate that all participants exists
        // and no replacement or wildcards have happened
        const dbAthleteProviderIds = existingEventParticipants
          .map((eventParticipant) => +eventParticipant?.athlete?.providerId)
          .sort((a, b) => a - b);
        const apiAthleteProviderIds = participants.map((row) => +row.id).sort((a, b) => a - b);
        const hasParticipantsChanged: boolean = !isAssetEqual(
          dbAthleteProviderIds,
          apiAthleteProviderIds,
        );
        // no change, no need to do anything
        if (!hasParticipantsChanged)
          return existingEventParticipants.map((row) => ({
            athlete: row.athlete,
            participant: row,
          }));
      }

      // loop throug the athlete and insert them if they do not exist
      const dbEventAthletes: {
        athlete: Athletes;
        seedNo: number;
      }[] = await Promise.all(
        participants.map(async (row) => {
          const nameWhere: FindOptionsWhere<Athletes> = {
            firstName: row.firstName,
            lastName: row.lastName,
            isActive: true,
            isArchived: false,
          };

          const athleteRows: Athletes[] = await transactionalEntityManager.find(Athletes, {
            where: [
              // {
              //   providerId: row.id,
              //   // isActive: true,
              //   // isArchived: false,
              // },
              nameWhere,
            ],
            select: {
              id: true,
              providerId: true,
              firstName: true,
              lastName: true,
            },
          });
          let athleteRow: Athletes;
          if (athleteRows.length) {
            athleteRows.forEach((athleteItemRow) => {
              // pick the one that has provider id, if not then pick the first that matches
              if (athleteItemRow.providerId) athleteRow = athleteItemRow;
            });
            if (!athleteRow) athleteRow = athleteRows?.[0];
          }

          const athleteItem = this.athleteRepository.create({
            id: athleteRow?.id || v4(),
            firstName: row.firstName,
            lastName: row.lastName,
            dob: row.doB,
            gender: row.gender,
            nationality: row.nationality,
            stance: row.stance,
            hometown: row.homeTown,
            providerId: row.id,
            isActive: true,
            isArchived: false,
          });

          if (!athleteRow || !athleteRow.providerId)
            await transactionalEntityManager.save(athleteItem);

          return {
            athlete: athleteItem,
            seedNo: row.seedNo,
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

      const responseRows: EventAthleteParticipant[] = [];
      const eventParticipantRows: EventParticipants[] = [];
      const sortedAthletes = dbEventAthletes.sort((a, b) => a.seedNo - b.seedNo);

      for await (const { athlete: eventAthlete, seedNo } of sortedAthletes) {
        const eventParticipant = existingEventParticipants.find(
          (row) => row.athleteId === eventAthlete.id,
        );

        // TODO: projection calculations

        const participant = this.eventParticipantsRepository.create({
          id: eventParticipant?.id || v4(),
          eventId: dbEvent.id,
          athleteId: eventAthlete.id,
          seedNo,
          isActive: true,
          isArchived: false,
          status:
            eventParticipant && ![AthleteStatus.INACTIVE].includes(eventParticipant.status)
              ? eventParticipant.status
              : AthleteStatus.ACTIVE,
        });
        eventParticipantRows.push(participant);

        responseRows.push({
          athlete: eventAthlete,
          participant,
        });
      }
      if (eventParticipantRows.length) await transactionalEntityManager.save(eventParticipantRows);

      return responseRows;
    } catch (error) {
      throw error;
    }
  }

  async syncLiveUpcomingEvents(): Promise<boolean> {
    try {
      const now: Date = new Date();

      const endDate: Date = addDays(now, 8);

      const dbEvents = await this.eventsRepository.find({
        where: {
          eventStatus: In([EventStatus.LIVE, EventStatus.UPCOMING, EventStatus.NEXT]),
          isActive: true,
          isArchived: false,
          providerId: Not(IsNull()),
          // only fetch nearby events that are live, next or upcoming, no need to update
          // event 2 months down the line
          startDate: LessThanOrEqual(endDate),
        },
        select: {
          id: true,
          eventStatus: true,
          providerId: true,
          providerContestId: true,
          startDate: true,
          endDate: true,
          winnerAthleteId: true,
          eventLocationGroup: true,
          isEventWinnerMarketOpen: true,
          updatedAt: true,
        },
        order: {
          startDate: "ASC",
        },
      });

      const validEvents = dbEvents.filter((event) => {
        // if the event is live then it should update quickly
        if (event.eventStatus === EventStatus.LIVE) return true;

        // if the event is not live then update every hour instead of eery 5 minutes
        const difference = differenceInHours(now, event.updatedAt);
        return difference > 1;
      });

      await this.eventsRepository.manager.transaction(
        async (transactionalEntityManager: EntityManager) => {
          // find all the rounds in the current database and maintain a list
          const dbRounds: Rounds[] = await transactionalEntityManager.find(Rounds, {
            select: {
              id: true,
              name: true,
              roundNo: true,
            },
          });
          const localDbRounds: Rounds[] = dbRounds.map((row) => row);

          for await (const dbEvent of validEvents) {
            try {
              const contest: IParsedEventContests = await this.slsService.fetchEventContest(
                dbEvent.providerId,
                dbEvent.providerContestId,
              );

              const eventParticipants: EventAthleteParticipant[] = await this.updateEventSeeds(
                transactionalEntityManager,
                dbEvent,
                contest.participants,
              );

              if (dbEvent.eventStatus !== contest.eventStatus) {
                await transactionalEntityManager.update(
                  Events,
                  {
                    id: dbEvent.id,
                  },
                  {
                    eventStatus: contest.eventStatus,
                    startDate: contest.startDate,
                    endDate: contest.endDate,
                    isEventWinnerMarketOpen: contest.eventStatus !== EventStatus.COMPLETED,
                  },
                );
              }

              if (contest.eventStatus === EventStatus.NEXT) {
                // check to see if the api has heats and the db does not
                // this happens when the sync events has not run but the new data event has shown up
                const dbHeatsCount = await transactionalEntityManager.count(RoundHeats, {
                  where: { eventId: dbEvent.id },
                  select: {
                    id: true,
                  },
                });

                const heatsCount = contest.rounds
                  .map((itemRound) => itemRound.heats.length)
                  .reduce((total, count) => total + count, 0);
                if (dbHeatsCount !== heatsCount) {
                  // run a manual sync to fetch the data for the event and sync it
                  await this.syncScheduledEvents(transactionalEntityManager);
                  return true;
                }
              }
              if (contest.eventStatus !== EventStatus.LIVE) return true;

              const dbEventRounds = await transactionalEntityManager.find(EventRounds, {
                where: {
                  eventId: dbEvent.id,
                  roundStatus: In([RoundStatus.NEXT, RoundStatus.LIVE, RoundStatus.UPCOMING]),
                  isActive: true,
                  isArchived: false,
                  providerId: Not(IsNull()),
                },
                relations: ["round"],
                select: {
                  id: true,
                  roundStatus: true,
                  providerId: true,
                  roundId: true,
                  round: {
                    id: true,
                    name: true,
                    roundNo: true,
                  },
                },
              });

              // loop through the api rounds and update the rounds which don't match
              const roundPromises = contest.rounds.map(async (roundRow) => {
                // this can happen when the live sync runs before the scheduled sync
                // or when the round was created manually
                const dbRoundRow = dbEventRounds.find(
                  (row) => row.providerId === roundRow.id || row.round.name === roundRow.name,
                );
                if (!dbRoundRow) {
                  // create one on the fly
                  const savedDbEventRound = await transactionalEntityManager.save(
                    this.eventRoundsRepository.create({
                      eventId: dbEvent.id,
                      roundId: localDbRounds.find(
                        (localRoundRow) =>
                          localRoundRow.name === roundRow.name &&
                          localRoundRow.roundNo === roundRow.roundNo,
                      ).id,
                      startDate: roundRow.startDate,
                      endDate: roundRow.endDate,
                      roundStatus: roundRow.roundStatus,
                      providerId: roundRow.id,
                      providerLastUpdatedDate: roundRow.lastUpdated,
                    }),
                  );
                  // push the newly created event round to the local array
                  dbEventRounds.push(savedDbEventRound);
                }

                if (dbRoundRow.roundStatus !== roundRow.roundStatus) {
                  await transactionalEntityManager.update(
                    EventRounds,
                    {
                      id: dbRoundRow.id,
                    },
                    {
                      startDate: roundRow.startDate,
                      endDate: roundRow.endDate,
                      roundStatus: roundRow.roundStatus,
                    },
                  );
                }

                return null;
              });
              await Promise.all(roundPromises);

              // update the heats data, fetch all heats from the db that are upcoming or live
              // match against the api and update status
              const dbHeats = await transactionalEntityManager.find(RoundHeats, {
                where: {
                  eventId: dbEvent.id,
                  isActive: true,
                  isArchived: false,
                },
                select: {
                  id: true,
                  heatName: true,
                  roundId: true,
                  heatNo: true,
                  heatStatus: true,
                  winnerAthleteId: true,
                },
              });

              const scores: Scores[] = [];
              for await (const apiEventRound of contest.rounds) {
                const dbEventRound: EventRounds = dbEventRounds.find(
                  (dbRoundRow) => dbRoundRow.providerId === apiEventRound.id,
                );

                const heatPromises = apiEventRound.heats.map(async (heatRow) => {
                  let dbRoundHeat: RoundHeats = dbHeats.find(
                    (dbHeatsRow) =>
                      dbHeatsRow.heatName === heatRow.name &&
                      dbHeatsRow.heatNo === heatRow.heatNo &&
                      dbEventRound.roundId === dbHeatsRow.roundId,
                  );

                  if (!dbRoundHeat) {
                    this.heatsRepository.create({
                      id: !dbRoundHeat ? v4() : dbRoundHeat.id,
                      eventId: dbEvent.id,
                      roundId: dbEventRound.roundId,
                      heatNo: heatRow.heatNo,
                      startDate: dbRoundHeat?.startDate ? dbRoundHeat.startDate : heatRow.startDate,
                      endDate: dbRoundHeat?.endDate ? dbRoundHeat.endDate : heatRow.endDate,
                      heatStatus: dbRoundHeat?.heatStatus
                        ? dbRoundHeat.heatStatus
                        : heatRow.heatStatus,

                      heatName: heatRow.name,
                      isHeatWinnerMarketOpen: dbRoundHeat
                        ? dbRoundHeat.isHeatWinnerMarketOpen || true
                        : true,
                      isHeatWinnerMarketVoided: dbRoundHeat
                        ? dbRoundHeat.isHeatWinnerMarketVoided || false
                        : false,
                    });
                    dbRoundHeat = await transactionalEntityManager.save(dbRoundHeat);
                  }

                  // TODO: cannot set the winner here either as the status is unknown

                  scores.push(
                    ...heatRow.scores.map((heatScoreRow) => {
                      const evRow = eventParticipants.find(
                        (eventParticipantRow) =>
                          eventParticipantRow.athlete.providerId === heatScoreRow.athleteId,
                      );

                      return this.scoresRepository.create({
                        eventId: dbEvent.id,
                        roundHeatId: dbRoundHeat.id,
                        athleteId: evRow.participant.athleteId,
                        roundSeed: evRow.participant.seedNo,
                        lineScore1: heatScoreRow.lineScore1,
                        lineScore2: heatScoreRow.lineScore2,
                        trick1Score: heatScoreRow.trickScore1,
                        trick2Score: heatScoreRow.trickScore2,
                        trick3Score: heatScoreRow.trickScore3,
                        trick4Score: heatScoreRow.trickScore4,
                        trick5Score: heatScoreRow.trickScore5,
                        trick6Score: heatScoreRow.trickScore5,
                        roundScore: heatScoreRow.roundScore,
                        heatPosition: heatScoreRow.position,
                      });
                    }),
                  );

                  return null;
                });
                await Promise.all(heatPromises);
              }

              if (scores.length)
                await transactionalEntityManager.upsert(Scores, scores, {
                  conflictPaths: ["eventId", "roundHeatId", "athleteId"],
                });
            } catch (error) {
              throw error;
            }
          }
        },
      );

      return true;
    } catch (error) {
      throw error;
    }
  }

  async syncEvents(): Promise<boolean> {
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

  private async syncScheduledEvents(transactionalEntityManager: EntityManager): Promise<boolean> {
    try {
      const now = new Date();
      const currentYear: number = now.getFullYear();
      const fetchRangeStartDate: Date = subMonths(now, 1);

      const tours = [Gender.MALE, Gender.FEMALE].map((row) => ({
        gender: row,
        year: currentYear,
      }));

      // maintain a list of tours locally in order to indentify and query faster
      const localTours: {
        dbTourId: string;
        dbTourYearId: string;
        gender: Gender;
        year: number;
      }[] = [];

      // insert leagues and league years
      const leaguePromises = tours.map(async (tour) => {
        let tourId: string;
        const dbTour = await transactionalEntityManager.findOne(Leagues, {
          where: {
            gender: tour.gender,
          },
          select: {
            id: true,
          },
        });
        tourId = dbTour?.id;

        if (!dbTour) {
          tourId = v4();
          await transactionalEntityManager.insert(Leagues, {
            id: tourId,
            name:
              tour.gender === Gender.MALE ? "Men's Championship Tour" : "Women's Championship Tour",
            gender: tour.gender,
          });
        }

        let dbTourYearId: string;
        const tourYear = await transactionalEntityManager.findOne(LeagueYears, {
          where: {
            leagueId: tourId,
            year: currentYear,
          },
          select: {
            id: true,
          },
        });
        dbTourYearId = tourYear?.id;

        if (!tourYear) {
          dbTourYearId = v4();
          await transactionalEntityManager.insert(LeagueYears, {
            id: dbTourYearId,
            leagueId: tourId,
            year: currentYear,
          });
        }

        localTours.push({
          dbTourId: tourId,
          dbTourYearId,
          year: currentYear,
          gender: tour.gender,
        });
      });
      await Promise.all(leaguePromises);

      const skateboardingKey: string = "Skateboard";
      let eventNumber: number = 1;
      const maxEventRow = await transactionalEntityManager.findOne(Events, {
        where: {},
        order: {
          startDate: "DESC",
        },
      });
      // this is used because the API does not return an event number
      if (maxEventRow) eventNumber = maxEventRow.eventNumber + 1;

      // query api to get all events for the current year
      const eventsListing: IEvents[] = await this.slsService.fetchEventsByYear(currentYear);

      const filteredEvents: IEvents[] = eventsListing
        .filter((row) => row.sports.length === 1 && row.sports.includes(skateboardingKey))
        .filter((row) => {
          const parseableStartDate = row?.date?.start;
          const startDate: Date = parseableStartDate
            ? zonedTimeToUtc(parseISO(parseableStartDate), row.timezoneUtc)
            : null;

          return startDate ? isAfter(startDate, fetchRangeStartDate) : false;
        });

      // find all the rounds in the current database and maintain a list
      const dbRounds: Rounds[] = await transactionalEntityManager.find(Rounds, {
        select: {
          id: true,
          name: true,
          roundNo: true,
        },
      });
      const localDbRounds: Rounds[] = dbRounds.map((row) => row);

      // in SLS the event list above does not return the male and female events
      // insetead it returns an overview and contests are the actual events
      for await (const apiEvent of filteredEvents) {
        const contests: IParsedEventContests[] = await this.slsService.fetchEventContests(
          apiEvent.id,
        );

        for await (const contest of contests) {
          const dbEvent: Events = await transactionalEntityManager.findOne(Events, {
            where: {
              providerId: apiEvent.id,
              providerContestId: contest.contestId,
              isActive: true,
              isArchived: false,
            },
            select: {
              id: true,
              leagueYearId: true,
              eventNumber: true,
              eventStatus: true,
              isEventWinnerMarketOpen: true,
            },
          });

          const eventName = apiEvent?.location?.city?.split(",")?.[0];

          const dbEventRow: Events = this.eventsRepository.create({
            id: !dbEvent ? v4() : dbEvent.id,
            leagueYearId:
              dbEvent?.leagueYearId ||
              localTours.find(
                (tourRow) => tourRow.year === contest.year && tourRow.gender === contest.gender,
              ).dbTourYearId,
            name: eventName || apiEvent.name,
            startDate: contest.startDate,
            endDate: contest.endDate,
            eventNumber: dbEvent?.eventNumber || eventNumber++,
            eventStatus: contest.eventStatus,
            eventLocation: apiEvent.location.country,
            eventLocationGroup: apiEvent.location.country,
            providerId: apiEvent.id,
            providerContestId: contest.contestId,
            isEventWinnerMarketOpen: dbEvent ? dbEvent.isEventWinnerMarketOpen || false : false,
          });
          await transactionalEntityManager.save(dbEventRow);

          const dbEventRounds: EventRounds[] = await transactionalEntityManager.find(EventRounds, {
            where: {
              eventId: dbEventRow.id,
            },
            select: {
              id: true,
              eventId: true,
              roundId: true,
              providerId: true,
              providerLastUpdatedDate: true,
            },
          });

          const { rounds = [], participants = [] } = contest;

          // create any missing rounds
          for await (const round of rounds) {
            const hasDbRound = localDbRounds.some(
              (item) => item.name === round.name && item.roundNo === round.roundNo,
            );

            if (!hasDbRound) {
              const dbRound: Rounds = this.roundsRepository.create({
                id: v4(),
                name: round.name,
                roundNo: round.roundNo,
              });
              await transactionalEntityManager.save(dbRound);

              localDbRounds.push(dbRound);
            }
          }

          // create the event rounds
          const eventRounds: EventRounds[] = rounds.map((row) => {
            const dbEventRound: EventRounds = dbEventRounds.find(
              (dbEventRoundRow) => dbEventRoundRow.providerId === row.id,
            );

            return this.eventRoundsRepository.create({
              id: !dbEventRound ? v4() : dbEventRound.id,
              eventId: dbEventRow.id,
              roundId: localDbRounds.find(
                (roundRow) => roundRow.name === row.name && roundRow.roundNo === row.roundNo,
              ).id,
              startDate: dbEventRound?.startDate ? dbEventRound.startDate : row.startDate,
              endDate: dbEventRound?.endDate ? dbEventRound.endDate : row.endDate,
              roundStatus: dbEventRound?.roundStatus ? dbEventRound.roundStatus : row.roundStatus,

              providerId: row.id,
              providerLastUpdatedDate: row.lastUpdated,
            });
          });
          if (eventRounds.length) await transactionalEntityManager.save(eventRounds);

          const dbHeats: RoundHeats[] = await transactionalEntityManager.find(RoundHeats, {
            where: {
              eventId: dbEventRow.id,
            },
            select: {
              id: true,
              heatName: true,
              heatNo: true,
              heatStatus: true,
              eventId: true,
              roundId: true,
              providerLastUpdatedDate: true,
              isHeatWinnerMarketOpen: true,
              isHeatWinnerMarketVoided: true,
            },
          });

          let shouldInsertScores: boolean = false;
          const participantsCheck = await transactionalEntityManager.findOne(EventParticipants, {
            where: {
              eventId: dbEventRow.id,
              isActive: true,
              isArchived: false,
            },
          });
          let eventParticipants: EventAthleteParticipant[] = [];
          if (!participantsCheck) {
            shouldInsertScores = true;
            // participants do not exist for this event and likely athletes do no either so add those
            // and the assumption is that this might likely be an older event so add the scores too
            eventParticipants = await this.updateEventSeeds(
              transactionalEntityManager,
              dbEventRow,
              participants,
            );
          }

          const scores: Scores[] = [];
          // update the heats
          const dbRoundHeats: RoundHeats[] = rounds
            .map((round) => {
              const dbRound: Rounds = localDbRounds.find(
                (roundRow) => roundRow.name === round.name && roundRow.roundNo === round.roundNo,
              );

              const dbHeatRows: RoundHeats[] = round.heats.map((heatRow) => {
                const dbRoundHeat: RoundHeats = dbHeats.find(
                  (dbHeatsRow) =>
                    dbHeatsRow.heatName === heatRow.name &&
                    dbHeatsRow.heatNo === heatRow.heatNo &&
                    dbRound.id === dbHeatsRow.roundId,
                );

                const roundHeat: RoundHeats = this.heatsRepository.create({
                  id: !dbRoundHeat ? v4() : dbRoundHeat.id,
                  eventId: dbEventRow.id,
                  roundId: dbRound.id,
                  heatNo: heatRow.heatNo,
                  startDate: dbRoundHeat?.startDate ? dbRoundHeat.startDate : heatRow.startDate,
                  endDate: dbRoundHeat?.endDate ? dbRoundHeat.endDate : heatRow.endDate,
                  heatStatus: dbRoundHeat?.heatStatus ? dbRoundHeat.heatStatus : heatRow.heatStatus,

                  heatName: heatRow.name,
                  isHeatWinnerMarketOpen: dbRoundHeat ? dbRoundHeat.isHeatWinnerMarketOpen : true,
                  isHeatWinnerMarketVoided: dbRoundHeat
                    ? dbRoundHeat.isHeatWinnerMarketVoided
                    : false,
                });

                if (shouldInsertScores) {
                  scores.push(
                    ...heatRow.scores.map((heatScoreRow) => {
                      const evRow = eventParticipants.find(
                        (eventParticipantRow) =>
                          eventParticipantRow.athlete.providerId === heatScoreRow.athleteId,
                      );

                      return this.scoresRepository.create({
                        eventId: dbEventRow.id,
                        roundHeatId: roundHeat.id,
                        athleteId: evRow.participant.athleteId,
                        roundSeed: evRow.participant.seedNo,
                        lineScore1: heatScoreRow.lineScore1,
                        lineScore2: heatScoreRow.lineScore2,
                        trick1Score: heatScoreRow.trickScore1,
                        trick2Score: heatScoreRow.trickScore2,
                        trick3Score: heatScoreRow.trickScore3,
                        trick4Score: heatScoreRow.trickScore4,
                        trick5Score: heatScoreRow.trickScore5,
                        trick6Score: heatScoreRow.trickScore5,
                        roundScore: heatScoreRow.roundScore,
                        heatPosition: heatScoreRow.position,
                      });
                    }),
                  );
                }

                return roundHeat;
              });

              return dbHeatRows;
            })
            .flat();
          if (dbRoundHeats.length) await transactionalEntityManager.save(RoundHeats, dbRoundHeats);
          if (scores.length) await transactionalEntityManager.save(Scores, scores);
        }
      }

      return true;
    } catch (error) {
      throw error;
    }
  }
}

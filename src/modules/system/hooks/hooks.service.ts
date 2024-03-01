import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, EntityManager, In, IsNull, Not, FindOptionsWhere, DeepPartial } from "typeorm";
import groupBy from "lodash.groupby";
import orderBy from "lodash.orderby";
import capitalize from "lodash.capitalize";
import { v4 } from "uuid";

import Athlete from "../../../entities/nrx/athletes.entity";
import Events from "../../../entities/nrx/events.entity";
import EventRounds from "../../../entities/nrx/eventRounds.entity";
import RoundHeats from "../../../entities/nrx/roundHeats.entity";
import Scores from "../../../entities/nrx/scores.entity";
import Rounds from "../../../entities/nrx/rounds.entity";
import ProjectionEventHeatOutcome from "../../../entities/nrx/projectionEventHeatOutcome.entity";
import ProjectionEventOutcome from "../../../entities/nrx/projectionEventOutcome.entity";
import ProjectionEventPodiums from "../../../entities/nrx/projectionEventPodiums.entity";
import ProjectionEventShows from "../../../entities/nrx/projectionEventShows.entity";
import ClientProjectionEventHeatOutcome from "../../../entities/nrx/clientProjectionEventHeatOutcome.entity";
import ClientProjectionEventOutcome from "../../../entities/nrx/clientProjectionEventOutcome.entity";
import ClientProjectionEventPodiums from "../../../entities/nrx/clientProjectionEventPodiums.entity";
import ClientProjectionEventShows from "../../../entities/nrx/clientProjectionEventShows.entity";
import EventParticipants from "../../../entities/nrx/eventParticipants.entity";
import TourYears from "../../../entities/nrx/tourYears.entity";
import Tours from "../../../entities/nrx/tours.entity";

import NRXTraderService from "../../nrx/admin/traders/traders.service";
import QueueService from "../../system/queue/queue.service";
import EventDto from "./dto/events.dto";
import RoundScoreDto from "./dto/roundScore.dto";
import BracketRoundScoreDto from "./dto/bracketRoundScore.dto";
import EventParticipantsDto from "./dto/eventParticipants.dto";

import {
  EventStatus,
  NRXEventCategoryType,
  NRXEventStatus,
  thrillOneRoundMap,
  nrxRoundConfig,
  RoundStatus,
  HeatStatus,
  AthleteStatus,
  NRXRounds,
  NRXLapMetadata,
  SportsTypes,
} from "../../../constants/system";
import { formatMMSSToSeconds } from "../../../helpers/time.helper";

@Injectable()
export default class EventService {
  constructor(
    @InjectRepository(TourYears) private readonly tourYearRepository: Repository<TourYears>,
    @InjectRepository(Events) private readonly eventRepository: Repository<Events>,
    @InjectRepository(Scores) private readonly scoresRepository: Repository<Scores>,
    @InjectRepository(Athlete) private readonly athleteRepository: Repository<Athlete>,
    @InjectRepository(Rounds) private readonly roundsRepository: Repository<Rounds>,
    @InjectRepository(EventRounds) private readonly eventRoundsRepository: Repository<EventRounds>,
    @InjectRepository(RoundHeats) private readonly roundHeatsRepository: Repository<RoundHeats>,
    @InjectRepository(EventParticipants)
    private readonly eventParticipantsRepository: Repository<EventParticipants>,
    private readonly nrxTraderService: NRXTraderService,
    private queueService: QueueService,
  ) {}

  async setupEvent(body: EventDto[]) {
    try {
      // separate based on the category
      const eventCategory: {
        [category: string]: EventDto[];
      } = groupBy(body, "categoryName");

      // const currentYear = new Date().getFullYear();
      const result = await this.eventRepository.manager.transaction(
        async (transactionalEntityManager: EntityManager) => {
          // const promises = Object.keys(eventCategory)
          // .map(async (key: NRXEventCategoryType) => {

          const fakeEventId: string = await this.createLiveEvent(
            "Event",
            new Date().toISOString(),
            true,
            transactionalEntityManager,
          );

          const eventIds: string[] = [];

          for await (const itemKey of Object.keys(eventCategory)) {
            try {
              const key: NRXEventCategoryType = itemKey as NRXEventCategoryType;

              const rounds = eventCategory[key];

              // find the first event but very hacky
              const event = await transactionalEntityManager.findOne(Events, {
                where: {
                  categoryName: key,
                  // tourYear: {
                  //   year: currentYear,
                  // },
                  isActive: true,
                  isArchived: false,
                  eventStatus: In([EventStatus.LIVE]),
                },
                select: {
                  id: true,
                  eventStatus: true,
                  startDate: true,
                },
                order: {
                  startDate: "ASC",
                },
              });

              if (!event) continue;
              // check if all are scheduled in which case this is a new event and all rounds and heats should be deleted

              const isExistingEvent = rounds.some((row) => row.status === NRXEventStatus.FINISHED);

              /* if (!isExistingEvent) {
                // thrill one could send the participant list before the schedule
                // in that case this could delete the existing participants so prevent
                // that from happening if there are participants
                const existingEventParticipantsCount = await this.eventParticipantsRepository.count(
                  {
                    where: {
                      eventId: event.id,
                      isActive: true,
                      isArchived: false,
                    },
                    select: {
                      isActive: true,
                    },
                  },
                );

                if (!existingEventParticipantsCount) {
                  await Promise.all([
                    transactionalEntityManager.delete(ProjectionEventPodiums, {
                      eventId: event.id,
                    }),
                    transactionalEntityManager.delete(ProjectionEventShows, {
                      eventId: event.id,
                    }),
                    transactionalEntityManager.delete(ProjectionEventHeatOutcome, {
                      eventId: event.id,
                    }),
                    transactionalEntityManager.delete(ProjectionEventOutcome, {
                      eventId: event.id,
                    }),
                    transactionalEntityManager.delete(ClientPropBets, {
                      eventId: event.id,
                    }),
                    transactionalEntityManager.delete(ClientPlayerHeadToHeads, {
                      eventId: event.id,
                    }),
                    transactionalEntityManager.delete(ClientProjectionEventPodiums, {
                      eventId: event.id,
                    }),
                    transactionalEntityManager.delete(ClientProjectionEventShows, {
                      eventId: event.id,
                    }),
                    transactionalEntityManager.delete(ClientProjectionEventHeatOutcome, {
                      eventId: event.id,
                    }),
                    transactionalEntityManager.delete(ClientProjectionEventOutcome, {
                      eventId: event.id,
                    }),
                    transactionalEntityManager.delete(Scores, {
                      eventId: event.id,
                    }),
                    transactionalEntityManager.delete(RoundHeats, {
                      eventId: event.id,
                    }),
                    transactionalEntityManager.delete(EventRounds, {
                      eventId: event.id,
                    }),
                  ]);
                }
              }   */

              if (isExistingEvent && event.eventStatus !== EventStatus.LIVE) {
                await transactionalEntityManager.update(
                  Events,
                  {
                    id: event.id,
                  },
                  {
                    eventStatus: EventStatus.LIVE,
                  },
                );
              }

              // clear all data and insert
              const sortedRounds = rounds.sort(
                (roundA, roundB) =>
                  new Date(roundA?.scheduled).getTime() - new Date(roundB?.scheduled).getTime(),
              );

              // thrill one returns the heats superimposed on rounds so loop through the heats
              // loop through to find the heat that matches, then create the round, event round and heat
              for await (const item of sortedRounds) {
                // find the thrill one object that matches
                const roundItem = Object.values(thrillOneRoundMap(key, true)).find((row) =>
                  row.heats.some((rowItem) => rowItem.name === item.displayName),
                );
                if (!roundItem) continue;

                const status = item.status;

                const { heats, round } = roundItem;

                const nrxRound = nrxRoundConfig[round];

                // setup round
                let existingRound = await transactionalEntityManager.findOne(Rounds, {
                  where: {
                    isActive: true,
                    isArchived: false,
                    name: nrxRound.name,
                    roundNo: round,
                  },
                });
                if (!existingRound) {
                  existingRound = await transactionalEntityManager.save(
                    this.roundsRepository.create({
                      name: nrxRound.name,
                      roundNo: round,
                    }),
                  );
                } else {
                  await transactionalEntityManager.update(
                    Rounds,
                    {
                      id: existingRound.id,
                    },
                    {
                      name: nrxRound.name,
                      roundNo: round,
                    },
                  );
                }

                const now = new Date().toISOString();
                // setup event round
                let eventRound = await transactionalEntityManager.findOne(EventRounds, {
                  where: {
                    isActive: true,
                    isArchived: false,
                    eventId: event.id,
                    roundId: existingRound.id,
                  },
                });

                let roundStatus: RoundStatus = eventRound?.roundStatus;

                if (status === NRXEventStatus.IN_PROGRESS) roundStatus = RoundStatus.LIVE;
                if (status === NRXEventStatus.FINISHED) roundStatus = RoundStatus.COMPLETED;
                if (
                  status === NRXEventStatus.SCHEDULED &&
                  eventRound?.roundStatus !== RoundStatus.LIVE
                )
                  roundStatus = RoundStatus.UPCOMING;

                if (!eventRound) {
                  eventRound = await transactionalEntityManager.save(
                    this.eventRoundsRepository.create({
                      eventId: event.id,
                      roundId: existingRound.id,
                      startDate: item.scheduled || null,
                      endDate: status === NRXEventStatus.SCHEDULED ? null : now,
                      roundStatus:
                        status === NRXEventStatus.SCHEDULED
                          ? RoundStatus.UPCOMING
                          : RoundStatus.COMPLETED,
                    }),
                  );
                } else {
                  const where: FindOptionsWhere<EventRounds> = {
                    id: eventRound.id,
                  };

                  const updateObj: DeepPartial<EventRounds> = {
                    startDate:
                      status === NRXEventStatus.SCHEDULED ? item.scheduled : eventRound.startDate,
                    // endDate:
                    //   status === NRXEventStatus.FINISHED &&
                    //   eventRound.roundStatus !== RoundStatus.COMPLETED
                    //     ? now
                    //     : eventRound.endDate,
                    // roundStatus,
                  };

                  if (![NRXEventStatus.FINISHED].includes(item.status))
                    updateObj.roundStatus = roundStatus;

                  // update existing data
                  await transactionalEntityManager.update(EventRounds, where, updateObj);
                }

                // heats
                const heat = heats.find((heatRow) => heatRow.name === item.displayName);

                let existingRoundHeat = await transactionalEntityManager.findOne(RoundHeats, {
                  where: {
                    eventId: event.id,
                    roundId: existingRound.id,
                    heatNo: heat.heatNo,
                    isActive: true,
                    isArchived: false,
                  },
                  select: {
                    id: true,
                  },
                });

                let heatStatus: HeatStatus =
                  status === NRXEventStatus.SCHEDULED ? HeatStatus.UPCOMING : HeatStatus.COMPLETED;
                if (status === NRXEventStatus.IN_PROGRESS) heatStatus = HeatStatus.LIVE;

                if (!existingRoundHeat) {
                  existingRoundHeat = await transactionalEntityManager.save(
                    this.roundHeatsRepository.create({
                      eventId: event.id,
                      roundId: existingRound.id,
                      providerRunId: `${item.runId}`,
                      heatName: "Heat",
                      heatNo: heat.heatNo,
                      startDate: item.scheduled || null,
                      endDate: status === NRXEventStatus.SCHEDULED ? null : now,
                      heatStatus,
                    }),
                  );
                } else {
                  // update existing data

                  await transactionalEntityManager.update(
                    RoundHeats,
                    {
                      id: existingRoundHeat.id,
                      // only updating where round status is not completed because thrill one
                      // sends upcoming even when complete
                      // heatStatus: Not(HeatStatus.COMPLETED),
                    },
                    {
                      providerRunId: `${item.runId}`,
                      startDate:
                        status === NRXEventStatus.SCHEDULED ? item.scheduled : eventRound.startDate,
                      endDate:
                        status === NRXEventStatus.FINISHED &&
                        eventRound.roundStatus !== RoundStatus.COMPLETED
                          ? now
                          : eventRound.endDate,
                      heatStatus,
                    },
                  );
                }
              }
              const eventRounds = await transactionalEntityManager.find(EventRounds, {
                where: {
                  isActive: true,
                  isArchived: false,
                  eventId: event.id,
                  round: {
                    heats: {
                      eventId: event.id,
                    },
                  },
                },
                relations: ["round.heats"],
                select: {
                  id: true,
                  roundId: true,
                  roundStatus: true,
                  round: {
                    id: true,
                    roundNo: true,
                    heats: {
                      roundId: true,
                      eventId: true,
                      heatStatus: true,
                    },
                  },
                },
                order: {
                  round: {
                    roundNo: "ASC",
                  },
                },
              });

              // for all rounds that are not completed, check if all heats are completed and then mark the round as completed
              const eventRoundPromises = eventRounds
                .filter((eventRound) => ![RoundStatus.COMPLETED].includes(eventRound.roundStatus))
                .map(async (eventRound) => {
                  const hasInProgressHeat = eventRound.round.heats.some(
                    (heat) => heat.heatStatus !== HeatStatus.COMPLETED,
                  );

                  if (!hasInProgressHeat) {
                    // no in progress heat but round is complete so mark the round as completed
                    await transactionalEntityManager.update(
                      EventRounds,
                      {
                        id: eventRound.id,
                      },
                      {
                        endDate: new Date().toISOString(),
                        roundStatus: RoundStatus.COMPLETED,
                      },
                    );
                  }

                  return true;
                });
              await Promise.all(eventRoundPromises);

              // update the heat so that the market is opened for the next round
              // find the first round that is live or upcoming that has 1 upcoming heat
              const applicableRound = eventRounds.find(
                (eventRound) =>
                  eventRound.round.heats.some((heat) =>
                    [HeatStatus.UPCOMING, HeatStatus.LIVE].includes(heat.heatStatus),
                  ) &&
                  [
                    RoundStatus.LIVE,
                    RoundStatus.IN_WINDOW,
                    RoundStatus.NEXT,
                    RoundStatus.UPCOMING,
                  ].includes(eventRound.roundStatus),
              );
              if (applicableRound) {
                // for the upcoming heat, mark the market as open
                const applicableHeat = applicableRound.round.heats.find(
                  (heat) => heat.heatStatus === HeatStatus.UPCOMING,
                );
                if (applicableHeat)
                  await transactionalEntityManager.update(
                    RoundHeats,
                    {
                      id: applicableHeat.id,
                    },
                    {
                      isHeatWinnerMarketOpen: true,
                    },
                  );
              } else {
                // likely that the event itself is over and should be marked as completed
                await transactionalEntityManager.update(
                  Events,
                  {
                    id: event.id,
                  },
                  {
                    eventStatus: EventStatus.COMPLETED,
                    isEventWinnerMarketOpen: false,
                    endDate: new Date().toISOString(),
                  },
                );
              }

              if (!isExistingEvent) {
                // create any missing rounds or heats for continuity
                await this.nrxTraderService.eventSetupEventRounds(
                  event.id,
                  true,
                  transactionalEntityManager,
                );

                // FIXME: disable if sim is giving a problem
                // at the same time, also create the first set of scores so the sim can run
                // but only if participants exist
                // const eventParticipants = await transactionalEntityManager.find(
                //   EventParticipants,
                //   {
                //     where: {
                //       eventId: event.id,
                //       isActive: true,
                //       isArchived: false,
                //     },
                //   },
                // );
                // if (eventParticipants.length) {
                //   await this.initEventScores(
                //     event.id,
                //     eventParticipants,
                //     transactionalEntityManager,
                //   );
                // }
              }

              // return event.id;
              eventIds.push(event.id);
            } catch (transactionError) {
              throw transactionError;
            }
          }
          // });

          // const payload = await Promise.all(promises);

          // it is only expected to be 1 event
          if (fakeEventId && eventIds.length)
            await Promise.all(
              eventIds.map(async (eventId) => {
                await this.restoreUpcomingEventOdds(
                  transactionalEntityManager,
                  eventId,
                  fakeEventId,
                );
              }),
            );

          // filter our any nulls
          // return payload.map((row) => row);
          return eventIds;
        },
      );

      if (result.length)
        result.map((eventId) =>
          this.queueService.notifyEventUpdate({
            eventId,
            delaySeconds: 10,
            sportType: SportsTypes.RALLYCROSS,
          }),
        );

      return result;
    } catch (error) {
      throw error;
    }
  }

  /* async activeEventSessionUpdate(payload: ActiveEventSession) {
    try {
      const result = await this.eventRepository.manager.transaction(
        async (transactionalEntityManager: EntityManager) => {
          await this.createLiveEvent(payload.name, payload.startDate, transactionalEntityManager);
        },
      );

      return result;
    } catch (error) {
      throw error;
    }
  } */

  async logAthleteLapTime(
    body: RoundScoreDto[],
    categoryName: NRXEventCategoryType,
    rounds: number[],
    totalLaps: number,
  ) {
    try {
      let affectedRoundHeatIds: string[] = [];

      const eventId = await this.eventRepository.manager.transaction(
        async (transactionalEntityManager: EntityManager) => {
          // const currentYear = new Date().getFullYear();

          const event = await transactionalEntityManager.findOne(Events, {
            where: {
              categoryName,
              // tourYear: {
              //   year: currentYear,
              // },
              isActive: true,
              isArchived: false,
              eventStatus: In([EventStatus.LIVE]),
            },
            order: {
              startDate: "ASC",
            },
          });
          if (!event) return false;

          let eventRounds = await transactionalEntityManager.find(EventRounds, {
            where: {
              eventId: event.id,
              isActive: true,
              isArchived: false,
              round: {
                roundNo: In(rounds),
                isActive: true,
                isArchived: false,
                heats: {
                  eventId: event.id,
                  isActive: true,
                  isArchived: false,
                },
              },
            },
            select: {
              eventId: true,
              roundId: true,
              roundStatus: true,
              round: {
                id: true,
                roundNo: true,
                heats: {
                  id: true,
                  heatNo: true,
                  eventId: true,
                  roundId: true,
                  providerRunId: true,
                  heatStatus: true,
                  scores: {
                    id: true,
                    roundHeatId: true,
                    athleteId: true,
                    lapNumber: true,
                    athlete: {
                      id: true,
                      providerEntryId: true,
                    },
                  },
                },
              },
            },
            relations: ["round.heats.scores.athlete"],
            order: {
              round: {
                roundNo: "ASC",
                heats: {
                  heatNo: "ASC",
                },
              },
            },
          });

          // To account for the first timed lap round where in the system adds scores
          // to the scores table when a seed list is uploaded so the sim can run because otherwise there are no participants
          // and then when thrill one sends the data, we re-use those empty rows
          // const bodyItem = body[0];
          // const resultNameSplit: string[] = bodyItem.resultName.split("_");
          // const roundName = resultNameSplit[1];
          if (rounds.length === 1 && rounds[0] === NRXRounds.TP) {
            // TP round, check if the round is not completed
            const isEditable = [
              RoundStatus.UPCOMING,
              RoundStatus.NEXT,
              RoundStatus.IN_WINDOW,
              RoundStatus.LIVE,
            ].includes(eventRounds[0]?.roundStatus);

            if (isEditable) {
              const roundHeat = eventRounds[0]?.round.heats?.[0];
              await transactionalEntityManager.delete(Scores, {
                roundHeatId: roundHeat.id,
                eventId: event.id,
              });
            }
          }

          const driverEntryIds: string[] = body.map((row) => `${row.entryId}`);

          const athletes = await transactionalEntityManager.find(Athlete, {
            where: {
              providerEntryId: In(driverEntryIds),
              isActive: true,
              isArchived: false,
            },
            select: {
              id: true,
              providerEntryId: true,
            },
          });

          let roundSeed = 1;
          let applicableHeatId: string = null;
          let heatWinnerId: string = null;
          let isFinalRound: boolean = false;
          for await (const item of body) {
            try {
              // loop through the event rounds and then the heats
              // find the first heat that matches the athlete and the run id
              // if none match then match the athlete id only and save the run id in the heat
              // along with the athlete data for the heat that matches
              let score: Scores = null;
              let round: Rounds = null;
              let heat: RoundHeats = null;

              const athlete: Athlete = athletes.find(
                (row) => row.providerEntryId === `${item.entryId}`,
              );
              eventRounds
                // bracket round will no longer come though here so skipping this
                // only filter if it is the bracket round in order to limit to the bracket rounds only
                // .filter((roundItem) =>
                //   item.resultName.includes("bracket")
                //     ? [NRXRounds.BR1, NRXRounds.BR2, NRXRounds.BR3, NRXRounds.BR4].includes(
                //         roundItem.round.roundNo,
                //       )
                //     : roundItem,
                // )
                .forEach((eventRound) => {
                  eventRound.round.heats
                    // excluding this because thrill one does not send all the data
                    // but our system fills in the missing heat data so there is a situation wherein when finding heats
                    // it finds the heats which are essentially byes so when it is bye look in all
                    // but when not bye then look in not completed ones as our system marks the missing ones as completed
                    // in addition, to accomodate for nulls, if the battle position is null then look in all heats
                    .filter((heatItem) => {
                      return item.battlePosition
                        ? item.battlePosition !== NRXLapMetadata.BYE
                          ? ![HeatStatus.COMPLETED].includes(heatItem.heatStatus)
                          : heatItem
                        : heatItem;
                    })
                    .forEach((heatItem) => {
                      if (heatItem.providerRunId === `${item.runId}`) {
                        heat = heatItem;
                        round = eventRound.round;
                        // ignoring else because there will not be a situation where the entry id for the athlete exists
                        // and the run id does not exist
                        // the run can exist without the athlete because it could be that the first athlete created the run
                        // but this is the second athlete in the same run
                        score = heatItem.scores.find(
                          (scoreItem) => scoreItem.athlete.providerEntryId === `${item.entryId}`,
                        );
                      }
                    });
                });

              let heatId: string = heat?.id;
              if (!heatId) {
                // get the first heat where run id is not set and update that

                eventRounds
                  // bracket round will no longer come though here so skipping this
                  // only filter if it is the bracket round in order to limit to the bracket rounds only
                  // .filter((roundItem) =>
                  //   // return item.roundName
                  //   item.resultName.includes("bracket")
                  //     ? [NRXRounds.BR1, NRXRounds.BR2, NRXRounds.BR3, NRXRounds.BR4].includes(
                  //         roundItem.round.roundNo,
                  //       )
                  //     : roundItem,
                  // )
                  .find((eventRound) => {
                    const updateHeat = eventRound.round.heats.find(
                      (heatItem) => !heatItem.providerRunId,
                    );

                    if (updateHeat) {
                      heatId = updateHeat.id;
                      round = eventRound.round;

                      return updateHeat;
                    }
                  });

                // eventRounds.forEach((eventRound) => {
                //   const updateHeat = eventRound.round.heats.find(
                //     (heatItem) => !heatItem.providerRunId,
                //   );
                //   if (updateHeat) heatId = updateHeat.id;
                // });

                if (heatId) {
                  await transactionalEntityManager.update(
                    RoundHeats,
                    {
                      id: heatId,
                    },
                    {
                      providerRunId: `${item.runId}`,
                    },
                  );
                }
              }

              affectedRoundHeatIds.push(heatId);

              applicableHeatId = heatId;
              if (item.position === 1) heatWinnerId = athlete.id;
              if (round.roundNo === NRXRounds.FINALS) isFinalRound = true;

              //// Intentionally commented out so the trader can handle it on the FE
              //// else the alternative it to also handle closing rounds
              // For bracket rounds and potentially any other round, when the battle position is winner,
              // it implies that that particular heat is over and can be marked as completed.
              // if (
              //   item.battlePosition === NRXLapMetadata.WINNER
              //   // heat.heatStatus === HeatStatus.LIVE
              // )
              //   await transactionalEntityManager.update(
              //     RoundHeats,
              //     {
              //       id: heat.id,
              //     },
              //     {
              //       heatStatus: HeatStatus.COMPLETED,
              //     },
              //   );

              // plus 1 here is so that it starts from 0 and also includes the last lap number
              // os if there are 4 laps then total loops should be 5 which is 0, 1, 2, 3, 4, 5
              const scoresPayload: Scores[] = Array((totalLaps || 0) + 1)
                .fill(1)
                .map((_, lapNumber) => {
                  let lapNo = lapNumber;
                  // eslint-disable-next-line @typescript-eslint/dot-notation
                  if (!item["lap0"]) {
                    lapNo += 1;
                  }

                  const lapKey: string = `lap${lapNo}`;
                  const lapTime = item[lapKey] ? item[lapKey] : null;

                  // if (!lapTime && lapNumber === 0) return null;

                  return this.scoresRepository.create({
                    eventId: event.id,
                    roundHeatId: heatId,
                    athleteId: athlete.id,
                    roundSeed,
                    heatPosition: item.position || null,
                    lapTime: lapTime ? formatMMSSToSeconds(lapTime) : null,
                    totalLapTime: item.totalLapTime ? formatMMSSToSeconds(item.totalLapTime) : null,
                    lapNumber: lapNo,
                    // isJoker: item.jokerInLapNr ? item.jokerInLapNr === lapNo : false,
                    isBye: item.battlePosition === NRXLapMetadata.BYE,
                    status: item.status || item.battlePosition || null,
                  });
                })
                .filter((row) => row);

              // likely new athlete, use the above heat and insert athlete
              if (!score) {
                let insertedScores = await transactionalEntityManager.save(scoresPayload);
                // associate the athlete as well since the original query has the join
                insertedScores = insertedScores.map((scoreItem) => ({
                  ...scoreItem,
                  athlete,
                }));
                // update the local application version of this
                eventRounds = eventRounds.map((eventRoundItem) => {
                  if (eventRoundItem.round.id === round.id) {
                    const heats = eventRoundItem.round.heats.map((heatItem) => {
                      return heatItem.id === heatId
                        ? {
                            ...heatItem,
                            providerRunId: `${item.runId}`,
                            scores: [...heatItem.scores, ...insertedScores],
                          }
                        : heatItem;
                    });

                    return {
                      ...eventRoundItem,
                      round: {
                        ...eventRoundItem.round,
                        heats,
                      },
                    };
                  } else return eventRoundItem;
                });
              } else {
                // running an update because based on the dataset
                // the same score is sent more than once with different dataset

                const athleteScores = await transactionalEntityManager.find(Scores, {
                  where: {
                    eventId: event.id,
                    roundHeatId: heatId,
                    athleteId: athlete.id,
                  },
                  select: {
                    id: true,
                    lapNumber: true,
                  },
                });

                await Promise.all(
                  scoresPayload.map((scoreItem) => {
                    const scoreRow = athleteScores.find(
                      (row) => row.lapNumber === scoreItem.lapNumber,
                    );

                    return scoreRow?.id
                      ? transactionalEntityManager.update(
                          Scores,
                          {
                            id: scoreRow.id,
                          },
                          {
                            heatPosition: scoreItem.heatPosition || scoreRow.heatPosition,
                            lapTime: scoreItem.lapTime || scoreRow.lapTime,
                            totalLapTime: scoreItem.totalLapTime || scoreRow.totalLapTime,
                            lapNumber: scoreItem.lapNumber || scoreRow.lapNumber,
                            isJoker: scoreItem.isJoker,
                            isBye: scoreItem.isBye,
                            status: scoreItem.status || scoreRow.status,
                          },
                        )
                      : // likely a new value
                        transactionalEntityManager.save(scoreItem);
                  }),
                );
              }

              roundSeed++;
            } catch (error) {
              throw error;
            }
          }

          if (applicableHeatId && heatWinnerId) {
            // just a single one because for non bracket rounds, thrill one only sends
            // single runs
            await transactionalEntityManager.update(
              RoundHeats,
              {
                id: applicableHeatId,
              },
              {
                winnerAthleteId: heatWinnerId,
              },
            );

            if (isFinalRound)
              await transactionalEntityManager.update(
                Events,
                {
                  id: event.id,
                },
                {
                  winnerAthleteId: heatWinnerId,
                },
              );
          }

          affectedRoundHeatIds = [...new Set(affectedRoundHeatIds)];

          if (affectedRoundHeatIds.length)
            await this.updateHeatScorePositions(affectedRoundHeatIds, transactionalEntityManager);

          return event.id;
        },
      );

      if (eventId)
        await this.queueService.notifyEventUpdate({
          eventId,
          delaySeconds: 10,
          sportType: SportsTypes.RALLYCROSS,
        });

      return eventId;
    } catch (error) {
      throw error;
    }
  }

  async logAthleteBracketTime(
    body: BracketRoundScoreDto[],
    categoryName: NRXEventCategoryType,
    rounds: number[],
    totalLaps: number,
  ) {
    try {
      let affectedRoundHeatIds: string[] = [];

      const eventId = await this.eventRepository.manager.transaction(
        async (transactionalEntityManager: EntityManager) => {
          try {
            // const currentYear = new Date().getFullYear();

            const event = await transactionalEntityManager.findOne(Events, {
              where: {
                categoryName,
                // tourYear: {
                //   year: currentYear,
                // },
                isActive: true,
                isArchived: false,
                eventStatus: In([EventStatus.LIVE]),
              },
              order: {
                startDate: "ASC",
              },
            });
            if (!event) return false;

            let eventRounds = await transactionalEntityManager.find(EventRounds, {
              where: {
                eventId: event.id,
                isActive: true,
                isArchived: false,
                round: {
                  roundNo: In(rounds),
                  isActive: true,
                  isArchived: false,
                  heats: {
                    eventId: event.id,
                    isActive: true,
                    isArchived: false,
                  },
                },
              },
              select: {
                eventId: true,
                roundId: true,
                roundStatus: true,
                round: {
                  id: true,
                  roundNo: true,
                  heats: {
                    id: true,
                    heatNo: true,
                    eventId: true,
                    roundId: true,
                    providerRunId: true,
                    heatStatus: true,
                    scores: {
                      id: true,
                      roundHeatId: true,
                      athleteId: true,
                      lapNumber: true,
                      athlete: {
                        id: true,
                        providerEntryId: true,
                      },
                    },
                  },
                },
              },
              relations: ["round.heats.scores.athlete"],
              order: {
                round: {
                  roundNo: "ASC",
                  heats: {
                    heatNo: "ASC",
                  },
                },
              },
            });

            const driverEntryIds: string[] = body.map((row) => `${row.entryId}`);

            const athletes = driverEntryIds.length
              ? await transactionalEntityManager.find(Athlete, {
                  where: {
                    providerEntryId: In(driverEntryIds),
                    isActive: true,
                    isArchived: false,
                  },
                  select: {
                    id: true,
                    providerEntryId: true,
                  },
                })
              : [];

            // group based on rounds and then order by round order
            // this is on order to normalise the rounds because thrill one sends the order
            // as continuous range instead of per round
            const bracketRounds: {
              [category: string]: BracketRoundScoreDto[];
            } = groupBy(body, "roundName");

            Object.keys(bracketRounds).map((key) => {
              const orderedRows = orderBy(bracketRounds[key], ["roundOrder"], "asc");

              let position = 1;
              let roundOrder = orderedRows[0].roundOrder;

              bracketRounds[key] = orderedRows.map((row, rowPosition) => {
                if (row.roundOrder !== roundOrder && rowPosition !== 0) {
                  roundOrder = row.roundOrder;
                  position++;
                }

                return {
                  ...row,
                  roundOrder: position,
                };
              });
            });

            for await (const key of Object.keys(bracketRounds)) {
              const thrillOneRound = Object.values(thrillOneRoundMap(categoryName, false)).find(
                (row) => row.roundResultNames.includes(key),
              );

              const validEventRound = eventRounds.find(
                (eventRound) => eventRound.round.roundNo === thrillOneRound.round,
              );

              let roundSeed = 1;
              for await (const item of bracketRounds[key]) {
                // get the heat and check if runId for the heat is updated
                const heat = validEventRound.round.heats.find(
                  (heatRow) => heatRow.heatNo === item.roundOrder,
                );
                if (!heat) continue;

                // update provider id for the heat
                if (`${heat.providerRunId}` !== `${item.runId}`) {
                  await transactionalEntityManager.update(
                    RoundHeats,
                    {
                      id: heat.id,
                    },
                    {
                      providerRunId: `${item.runId}`,
                    },
                  );
                }

                //// Intentionally commented out so the trader can handle it on the FE
                //// else the alternative it to also handle closing rounds
                // For bracket rounds and potentially any other round, when the battle position is winner,
                // it implies that that particular heat is over and can be marked as completed.
                // else if (
                //   item.battlePosition === NRXLapMetadata.WINNER
                //   // heat.heatStatus === HeatStatus.LIVE
                // )
                //   await transactionalEntityManager.update(
                //     RoundHeats,
                //     {
                //       id: heat.id,
                //     },
                //     {
                //       heatStatus: HeatStatus.COMPLETED,
                //     },
                //   );

                const athlete: Athlete = athletes.find(
                  (row) => row.providerEntryId === `${item.entryId}`,
                );

                if (!athlete) continue;

                if (item.battlePosition === NRXLapMetadata.WINNER) {
                  // this heat has ended and winner declared
                  await transactionalEntityManager.update(
                    RoundHeats,
                    {
                      id: heat.id,
                    },
                    {
                      winnerAthleteId: athlete.id,
                    },
                  );
                }

                const hasScoresCreated = heat.scores.some(
                  (scoreRow) => scoreRow.athlete.providerEntryId === `${item.entryId}`,
                );

                let scores: Scores[] = heat.scores.filter(
                  (scoreRow) => scoreRow.athlete.providerEntryId === `${item.entryId}`,
                );

                const scoresPayload: Scores[] = Array(totalLaps + 1)
                  .fill(1)
                  .map((_, lapNumber) => {
                    const lapKey: string = `lap${lapNumber}`;
                    const lapTime = item[lapKey] ? item[lapKey] : null;

                    if (!lapTime && lapNumber === 0) return null;

                    return this.scoresRepository.create({
                      eventId: event.id,
                      roundHeatId: heat.id,
                      athleteId: athlete.id,
                      roundSeed,
                      lapTime: lapTime ? formatMMSSToSeconds(lapTime) : null,
                      lapNumber,
                      // isJoker: item.jokerInLapNr ? item.jokerInLapNr === lapNumber : false,
                      isBye: item.battlePosition === NRXLapMetadata.BYE,
                      status: item.status || item.battlePosition || null,
                    });
                  })
                  .filter((row) => row);

                affectedRoundHeatIds.push(heat.id);

                if (hasScoresCreated) {
                  // update
                  await Promise.all(
                    scoresPayload.map((scoreItem) => {
                      const scoreRow = scores.find((row) => {
                        return row.lapNumber === scoreItem.lapNumber;
                      });

                      return scoreRow
                        ? transactionalEntityManager.update(
                            Scores,
                            {
                              id: scoreRow.id,
                            },
                            {
                              lapTime: scoreItem.lapTime || scoreRow.lapTime,
                              lapNumber: scoreItem.lapNumber || scoreRow.lapNumber,
                              isJoker: scoreItem.isJoker,
                              isBye: scoreItem.isBye,
                              status: scoreItem.status || scoreRow.status,
                              roundSeed: scoreRow.roundSeed || scoreItem.roundSeed,
                            },
                          )
                        : transactionalEntityManager.save(scoreItem);
                    }),
                  );
                } else {
                  // insert
                  scores = await transactionalEntityManager.save(scoresPayload);
                  // associate the athlete as well since the original query has the join
                  scores = scores.map((scoreItem) => ({
                    ...scoreItem,
                    athlete,
                  }));
                }

                // update the local application version of this
                eventRounds = eventRounds.map((eventRoundItem) => {
                  if (eventRoundItem.id === validEventRound.id) {
                    const heats = eventRoundItem.round.heats.map((heatItem) => {
                      return heatItem.id === heat.id
                        ? {
                            ...heatItem,
                            providerRunId: `${item.runId}`,
                            scores,
                          }
                        : heatItem;
                    });

                    return {
                      ...eventRoundItem,
                      round: {
                        ...eventRoundItem.round,
                        heats,
                      },
                    };
                  } else return eventRoundItem;
                });

                roundSeed++;
              }
            }

            affectedRoundHeatIds = [...new Set(affectedRoundHeatIds)];

            if (affectedRoundHeatIds.length)
              await this.updateHeatScorePositions(affectedRoundHeatIds, transactionalEntityManager);

            return event.id;
          } catch (transactionError) {
            throw transactionError;
          }
        },
      );

      if (eventId)
        await this.queueService.notifyEventUpdate({
          eventId,
          delaySeconds: 10,
          sportType: SportsTypes.RALLYCROSS,
        });

      return eventId;
    } catch (error) {
      throw error;
    }
  }

  async setupEventParticipants(body: EventParticipantsDto[]) {
    try {
      const result = await this.athleteRepository.manager.transaction(
        async (transactionalEntityManager: EntityManager) => {
          const athletePayload = [];

          await this.createLiveEvent(
            "Event",
            new Date().toISOString(),
            false,
            transactionalEntityManager,
          );

          const row = body[0];
          // FIXME: this is a hack because chronomoto does not pass the season so we assume current year
          // const currentYear = new Date().getFullYear() - 1;
          const currentYear = new Date().getFullYear();

          const event = await transactionalEntityManager.findOne(Events, {
            where: {
              categoryName: row.categoryName,
              tourYear: {
                year: currentYear,
              },
              isActive: true,
              isArchived: false,
              eventStatus: In([
                EventStatus.UPCOMING,
                EventStatus.NEXT,
                EventStatus.IN_WINDOW,
                EventStatus.LIVE,
              ]),
            },
            order: {
              startDate: "ASC",
            },
            select: {
              id: true,
              eventStatus: true,
              startDate: true,
            },
          });
          if (!event) return false;

          // let eventParticipants: EventParticipants[] = [];

          let count = 1;
          for await (const item of body) {
            try {
              const nameSplit = item.entrantName.trim().split(" ");
              const athleteFirstName = capitalize(nameSplit?.[0]?.trim());
              const athleteMiddleName = capitalize(nameSplit.slice(1, -1).join(" "));
              const athleteLastName = capitalize(
                nameSplit.length > 1 ? nameSplit?.[nameSplit.length - 1].trim() : "",
              );

              const athleteQuery = transactionalEntityManager
                .createQueryBuilder(Athlete, "athletes")
                .select(["athletes.id as id"])
                .where("LOWER(athletes.firstName) = LOWER(:firstName)", {
                  firstName: athleteFirstName,
                });
              if (athleteLastName)
                athleteQuery.andWhere("LOWER(athletes.lastName) = LOWER(:lastName)", {
                  lastName: athleteLastName,
                });
              let athlete = await athleteQuery
                .orWhere({ providerEntryId: `${item.entryId}` })
                .andWhere({
                  isActive: true,
                  isArchived: false,
                })
                .getRawOne();

              // let athlete = await transactionalEntityManager.findOne(Athlete, {
              //   where: [
              //     { providerEntryId: `${item.entryId}` },
              //     { firstName: athleteFirstName, lastName: athleteLastName },
              //   ],
              //   select: {
              //     id: true,
              //   },
              // });

              if (!athlete) {
                athlete = await transactionalEntityManager.save(
                  this.athleteRepository.create({
                    providerEntryId: `${item.entryId}`,
                    startNumber: item.startNumber,
                    firstName: athleteFirstName,
                    middleName: athleteMiddleName,
                    lastName: athleteLastName,
                    nationality: item.nationality,
                    playerStatus: AthleteStatus.ACTIVE,
                  }),
                );
              } else {
                // update the data
                await transactionalEntityManager.update(
                  Athlete,
                  {
                    id: athlete.id,
                  },
                  {
                    firstName: athleteFirstName,
                    middleName: athleteMiddleName,
                    lastName: athleteLastName,
                    nationality: item.nationality,
                    startNumber: item.startNumber,
                    providerEntryId: `${item.entryId}`,
                  },
                );
              }

              const existingEventParticipant = await transactionalEntityManager.findOne(
                EventParticipants,
                {
                  where: {
                    eventId: event.id,
                    athleteId: athlete.id,
                    isActive: true,
                    isArchived: false,
                  },
                  select: {
                    id: true,
                  },
                },
              );

              if (!existingEventParticipant) {
                const eventParticipant = this.eventParticipantsRepository.create({
                  eventId: event.id,
                  athleteId: athlete.id,
                  seedNo: count,
                  status: AthleteStatus.ACTIVE,
                });

                athletePayload.push(eventParticipant);
              }

              count++;
            } catch (error) {
              throw error;
            }
          }

          if (athletePayload.length) await transactionalEntityManager.save(athletePayload);

          // FIXME: disable if sim is giving a problem
          // check to see if there are scores, if not then this is the first time
          // and if the rounds exist then the placeholder scores should be created
          // const eventScores = await transactionalEntityManager.count(Scores, {
          //   where: {
          //     eventId: event.id,
          //   },
          //   select: {
          //     isActive: true,
          //   },
          // });
          // if (!eventScores)
          //   await this.initEventScores(event.id, eventParticipants, transactionalEntityManager);

          return true;
        },
      );

      return result;
    } catch (error) {
      throw error;
    }
  }

  async updateHeatScorePositions(
    heatIds: string[] = [],
    transactionalEntityManager: EntityManager,
  ) {
    for await (const heatId of heatIds) {
      const scores = await transactionalEntityManager.find(Scores, {
        where: {
          heatPosition: IsNull(),
          lapTime: Not(IsNull()),
          roundHeatId: heatId,
        },
        select: {
          id: true,
          athleteId: true,
          lapTime: true,
          lapNumber: true,
        },
      });
      if (!scores.length) continue;

      const scoresWithAthleteGroup = groupBy(scores, "athleteId");

      let result: { athleteId: string; totalLapTime: number; heatPosition?: number }[] = [];

      Object.keys(scoresWithAthleteGroup).forEach((athleteId) => {
        let totalLapTime = 0;
        scoresWithAthleteGroup[athleteId].forEach((score) => {
          totalLapTime = totalLapTime + Number(score.lapTime);
        });

        result.push({ athleteId, totalLapTime });
      });

      result = orderBy(result, ["totalLapTime"], "asc");

      let count = 1;
      result.forEach((score) => {
        score.heatPosition = count;
        count++;
      });

      await Promise.all(
        result.map((row) =>
          transactionalEntityManager.update(
            Scores,
            {
              athleteId: row.athleteId,
              roundHeatId: heatId,
            },
            {
              heatPosition: row.heatPosition,
            },
          ),
        ),
      );
    }

    return heatIds;
  }

  async restoreUpcomingEventOdds(
    transactionalEntityManager: EntityManager,
    upcomingEventId: string,
    newEventId: string,
  ) {
    // get opening round heat 1 of the upcoming event so it can be set against the fake event
    const roundHeat = await transactionalEntityManager.findOne(RoundHeats, {
      select: {
        id: true,
      },
      where: {
        eventId: upcomingEventId,
        heatNo: 1,
      },
      relations: ["round"],
      order: {
        round: {
          roundNo: "ASC",
        },
      },
    });

    await Promise.all([
      transactionalEntityManager.update(
        ProjectionEventHeatOutcome,
        {
          eventId: newEventId,
        },
        {
          eventId: upcomingEventId,
          roundHeatId: roundHeat.id,
        },
      ),

      transactionalEntityManager.update(
        ClientProjectionEventHeatOutcome,
        {
          eventId: newEventId,
        },
        {
          eventId: upcomingEventId,
          roundHeatId: roundHeat.id,
        },
      ),

      transactionalEntityManager.update(
        ProjectionEventOutcome,
        {
          eventId: newEventId,
        },
        {
          eventId: upcomingEventId,
        },
      ),

      transactionalEntityManager.update(
        ClientProjectionEventOutcome,
        {
          eventId: newEventId,
        },
        {
          eventId: upcomingEventId,
        },
      ),

      transactionalEntityManager.update(
        ClientProjectionEventShows,
        {
          eventId: newEventId,
        },
        {
          eventId: upcomingEventId,
        },
      ),

      transactionalEntityManager.update(
        ClientProjectionEventPodiums,
        {
          eventId: newEventId,
        },
        {
          eventId: upcomingEventId,
        },
      ),

      transactionalEntityManager.update(
        ProjectionEventShows,
        {
          eventId: newEventId,
        },
        {
          eventId: upcomingEventId,
        },
      ),

      transactionalEntityManager.update(
        ProjectionEventPodiums,
        {
          eventId: newEventId,
        },
        {
          eventId: upcomingEventId,
        },
      ),
    ]);

    // delete the fake event round and heat and then event
    await Promise.all([
      transactionalEntityManager.delete(RoundHeats, {
        eventId: newEventId,
      }),
      transactionalEntityManager.delete(EventRounds, {
        eventId: newEventId,
      }),
    ]);

    return transactionalEntityManager.delete(Events, {
      id: newEventId,
    });
  }

  async storeUpcomingEventOdds(
    transactionalEntityManager: EntityManager,
    upcomingEvent: Events,
  ): Promise<string> {
    const newEventId = v4();
    const heatId = v4();
    await transactionalEntityManager.insert(Events, {
      id: newEventId,
      name: "name_" + newEventId,
      tourYearId: upcomingEvent.tourYearId,
      eventStatus: EventStatus.CANCELLED,
    });

    const roundDb = await transactionalEntityManager.findOne(Rounds, {
      where: {
        roundNo: 1,
        isActive: true,
        isArchived: false,
      },
    });

    await Promise.all([
      transactionalEntityManager.insert(RoundHeats, {
        id: heatId,
        eventId: newEventId,
        roundId: roundDb.id,
        heatNo: 1,
        heatName: "Heat",
        heatStatus: HeatStatus.CANCELLED,
        isActive: true,
        isArchived: false,
      }),

      transactionalEntityManager.insert(EventRounds, {
        eventId: newEventId,
        roundId: roundDb.id,
        roundStatus: RoundStatus.CANCELLED,
        isActive: true,
        isArchived: false,
      }),
    ]);

    await Promise.all([
      transactionalEntityManager.update(
        ProjectionEventHeatOutcome,
        {
          eventId: upcomingEvent.id,
        },
        {
          eventId: newEventId,
          roundHeatId: heatId,
        },
      ),

      transactionalEntityManager.update(
        ClientProjectionEventHeatOutcome,
        {
          eventId: upcomingEvent.id,
        },
        {
          eventId: newEventId,
          roundHeatId: heatId,
        },
      ),

      transactionalEntityManager.update(
        ProjectionEventOutcome,
        {
          eventId: upcomingEvent.id,
        },
        {
          eventId: newEventId,
        },
      ),

      transactionalEntityManager.update(
        ClientProjectionEventOutcome,
        {
          eventId: upcomingEvent.id,
        },
        {
          eventId: newEventId,
        },
      ),

      transactionalEntityManager.update(
        ProjectionEventPodiums,
        {
          eventId: upcomingEvent.id,
        },
        {
          eventId: newEventId,
        },
      ),

      transactionalEntityManager.update(
        ClientProjectionEventPodiums,
        {
          eventId: upcomingEvent.id,
        },
        {
          eventId: newEventId,
        },
      ),

      transactionalEntityManager.update(
        ProjectionEventShows,
        {
          eventId: upcomingEvent.id,
        },
        {
          eventId: newEventId,
        },
      ),

      transactionalEntityManager.update(
        ClientProjectionEventShows,
        {
          eventId: upcomingEvent.id,
        },
        {
          eventId: newEventId,
        },
      ),
    ]);

    return newEventId;
  }

  async createLiveEvent(
    eventName: string,
    startDate: string,
    shouldPreserveData: boolean = true,
    transactionalEntityManager: EntityManager,
  ) {
    try {
      // FIXME: this is a hack because chronomoto does not pass the season so we assume current year
      // const currentYear = new Date().getFullYear() - 1;
      const currentYear = new Date().getFullYear();

      let tempEventId = null;
      const promises = [NRXEventCategoryType.GROUP_E].map(async (categoryName) => {
        try {
          const liveEvent = await transactionalEntityManager.findOne(Events, {
            where: {
              eventStatus: In([EventStatus.LIVE]),
              categoryName: NRXEventCategoryType.GROUP_E,
              isActive: true,
              isArchived: false,
            },
            select: {
              id: true,
            },
            order: {
              startDate: "ASC",
            },
          });
          if (liveEvent) {
            // event is already live so ignore
            return false;
          }

          // find the first event that is upcoming and use that
          const upcomingEvent = await transactionalEntityManager.findOne(Events, {
            where: {
              eventStatus: In([EventStatus.UPCOMING, EventStatus.NEXT, EventStatus.IN_WINDOW]),
              categoryName: NRXEventCategoryType.GROUP_E,
              isActive: true,
              isArchived: false,
            },
            select: {
              id: true,
              tourYearId: true,
            },
            order: {
              startDate: "ASC",
            },
          });

          if (upcomingEvent) {
            // clear all existing data because trader might have uploaded it
            // and that does not work with thrill one

            if (shouldPreserveData)
              tempEventId = await this.storeUpcomingEventOdds(
                transactionalEntityManager,
                upcomingEvent,
              );

            await Promise.all([
              // not clearing prop bets and heat to head because the participants are not being cleared
              // and they are associated wth these guys
              // transactionalEntityManager.delete(PropBets, {
              //   eventId: upcomingEvent.id,
              // }),
              // transactionalEntityManager.delete(PlayerHeadToHeads, {
              //   eventId: upcomingEvent.id,
              // }),
              transactionalEntityManager.delete(ProjectionEventPodiums, {
                eventId: upcomingEvent.id,
              }),
              transactionalEntityManager.delete(ProjectionEventShows, {
                eventId: upcomingEvent.id,
              }),
              transactionalEntityManager.delete(ProjectionEventHeatOutcome, {
                eventId: upcomingEvent.id,
              }),
              transactionalEntityManager.delete(ProjectionEventOutcome, {
                eventId: upcomingEvent.id,
              }),
              transactionalEntityManager.delete(ClientProjectionEventPodiums, {
                eventId: upcomingEvent.id,
              }),
              transactionalEntityManager.delete(ClientProjectionEventShows, {
                eventId: upcomingEvent.id,
              }),
              transactionalEntityManager.delete(ClientProjectionEventHeatOutcome, {
                eventId: upcomingEvent.id,
              }),
              transactionalEntityManager.delete(ClientProjectionEventOutcome, {
                eventId: upcomingEvent.id,
              }),
              transactionalEntityManager.delete(Scores, {
                eventId: upcomingEvent.id,
              }),
              transactionalEntityManager.delete(RoundHeats, {
                eventId: upcomingEvent.id,
              }),
              transactionalEntityManager.delete(EventRounds, {
                eventId: upcomingEvent.id,
              }),
              // transactionalEntityManager.delete(EventParticipants, {
              //   eventId: upcomingEvent.id,
              // }),
            ]);
          }

          const event = upcomingEvent
            ? await transactionalEntityManager.update(
                Events,
                {
                  // name: payload.name,
                  // categoryName,
                  id: upcomingEvent.id,
                  isActive: true,
                  isArchived: false,
                },
                {
                  eventStatus: EventStatus.LIVE,
                  // providerRunId: payload.providerRunId,
                },
              )
            : null;

          // get the current tour year id, ignoring the tour itself
          let tourYear = await transactionalEntityManager.findOne(TourYears, {
            where: {
              year: currentYear,
              isActive: true,
              isArchived: false,
            },
          });
          if (!tourYear) {
            const tour = await transactionalEntityManager.findOne(Tours, {
              where: {
                isActive: true,
                isArchived: false,
              },
            });
            tourYear = await transactionalEntityManager.save(
              this.tourYearRepository.create({
                tourId: tour.id,
                year: currentYear,
              }),
            );
          }

          if (!event || !event?.affected) {
            // event does not exist, create one
            await transactionalEntityManager.save(
              this.eventRepository.create({
                tourYearId: tourYear.id,
                name: eventName,
                categoryName,
                startDate,
                eventStatus: EventStatus.LIVE,
                // providerRunId: payload.providerRunId,
                isEventWinnerMarketOpen: true,
              }),
            );
          }

          return true;
        } catch (transactionError) {
          throw transactionError;
        }
      });

      await Promise.all(promises);

      return tempEventId;
    } catch (error) {
      throw error;
    }
  }
}

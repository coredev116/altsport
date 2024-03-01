import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository, In, Not } from "typeorm";
// import groupBy from "lodash.groupby";
// import orderBy from "lodash.orderby";

import Events from "../../../../entities/nrx/events.entity";
import Tours from "../../../../entities/nrx/tours.entity";
import RoundHeats from "../../../../entities/nrx/roundHeats.entity";
import Athletes from "../../../../entities/nrx/athletes.entity";
import Scores from "../../../../entities/nrx/scores.entity";
import EventParticipants from "../../../../entities/nrx/eventParticipants.entity";
import EventRounds from "../../../../entities/nrx/eventRounds.entity";
import Rounds from "../../../../entities/nrx/rounds.entity";
import ProjectionEventHeatOutcome from "../../../../entities/nrx/projectionEventHeatOutcome.entity";
import ProjectionEventOutcome from "../../../../entities/nrx/projectionEventOutcome.entity";
import PropBets from "../../../../entities/nrx/propBets.entity";
import PlayerHeadToHeads from "../../../../entities/nrx/playerHeadToHeads.entity";
import ProjectionEventPodiums from "../../../../entities/nrx/projectionEventPodiums.entity";
import ProjectionEventShows from "../../../../entities/nrx/projectionEventShows.entity";

import ClientProjectionEventOutcome from "../../../../entities/nrx/clientProjectionEventOutcome.entity";
import ClientProjectionEventHeatOutcome from "../../../../entities/nrx/clientProjectionEventHeatOutcome.entity";
import ClientPropBets from "../../../../entities/nrx/clientPropBets.entity";
import ClientPlayerHeadToHeads from "../../../../entities/nrx/clientPlayerHeadToHeads.entity";
import ClientProjectionEventPodiums from "../../../../entities/nrx/clientProjectionEventPodiums.entity";
import ClientProjectionEventShows from "../../../../entities/nrx/clientProjectionEventShows.entity";

import TraderScores from "./dto/traderScores.dto";
import TraderLiveScoresDto from "./dto/traderLiveScores.dto";
import EventSeedDto from "./dto/eventSeed.dto";

import * as eventExceptions from "../../../../exceptions/events";
import * as eventRoundExceptions from "../../../../exceptions/eventRound";

import { IParticipantReplacement } from "../../../../interfaces/participants";
import {
  // IAthleteLapHolder,
  // IAthleteLap,
  // IHeatScoreHolder,
  // IQualifyingParticipants,
  // IRoundResult,
  INRXConfigItem,
} from "../../../../interfaces/nrx";
import { IRoundStateMap } from "../../../../interfaces/simulation";
import {
  AthleteStatus,
  RoundStatus,
  EventStatus,
  HeatStatus,
  SportsTypes,
  NRXRounds,
  nrxRoundConfig,
  NRXLapStatus,
  OddMarkets,
  SportsDbSchema,
} from "../../../../constants/system";

import QueueService from "../../../system/queue/queue.service";

@Injectable()
export default class TradersService {
  constructor(
    @InjectRepository(Tours) private readonly toursRepository: Repository<Tours>,
    @InjectRepository(Events) private readonly eventsRepository: Repository<Events>,
    @InjectRepository(RoundHeats) private readonly heatsRepository: Repository<RoundHeats>,
    @InjectRepository(Athletes) private readonly athletesRepository: Repository<Athletes>,
    @InjectRepository(Scores) private readonly scoresRepository: Repository<Scores>,
    @InjectRepository(EventRounds) private readonly eventRoundRepository: Repository<EventRounds>,
    @InjectRepository(EventParticipants)
    private readonly eventParticipantsRepository: Repository<EventParticipants>,
    @InjectRepository(Rounds)
    private readonly roundsRepository: Repository<Rounds>,
    @InjectRepository(ProjectionEventOutcome)
    private readonly projectionEventOutcomeRepository: Repository<ProjectionEventOutcome>,

    private queueService: QueueService,
  ) {}

  async oddsGoLive(
    eventId: string,
    projectionType: OddMarkets,
    roundHeatId: string,
    roundId: string,
  ): Promise<boolean> {
    await this.projectionEventOutcomeRepository.manager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        switch (projectionType) {
          case OddMarkets.EVENT_WINNER_PROJECTIONS:
            const projectionEventOutcomeData = await transactionalEntityManager.findOne(
              ProjectionEventOutcome,
              {
                where: {
                  eventId,
                  position: 1,
                  isActive: true,
                },
                select: {
                  isActive: true,
                },
              },
            );
            if (!projectionEventOutcomeData) return;

            await transactionalEntityManager.update(
              ClientProjectionEventOutcome,
              {
                eventId,
                position: 1,
              },
              {
                isActive: false,
                isArchived: true,
              },
            );

            await transactionalEntityManager.query(`
              INSERT INTO ${SportsDbSchema.NRX}."clientProjectionEventOutcome"("eventId", "eventParticipantId", "position", "odds", "probability", "trueProbability", "hasModifiedProbability")
              SELECT "eventId", "eventParticipantId", "position", "odds", "probability", "trueProbability", "hasModifiedProbability" FROM ${SportsDbSchema.NRX}."projectionEventOutcome"
              WHERE ${SportsDbSchema.NRX}."projectionEventOutcome"."eventId" = '${eventId}' AND ${SportsDbSchema.NRX}."projectionEventOutcome"."position" = 1;
            `);
            break;

          case OddMarkets.EVENT_SECOND_PLACE_PROJECTIONS:
            const projectionEventSecondPlaceOutcomeData = await transactionalEntityManager.findOne(
              ProjectionEventOutcome,
              {
                where: {
                  eventId,
                  position: 2,
                  isActive: true,
                },
                select: {
                  isActive: true,
                },
              },
            );
            if (!projectionEventSecondPlaceOutcomeData) return;

            await transactionalEntityManager.update(
              ClientProjectionEventOutcome,
              {
                eventId,
                position: 2,
              },
              {
                isActive: false,
                isArchived: true,
              },
            );

            await transactionalEntityManager.query(`
              INSERT INTO ${SportsDbSchema.NRX}."clientProjectionEventOutcome"("eventId", "eventParticipantId", "position", "odds", "probability", "trueProbability", "hasModifiedProbability")
              SELECT "eventId", "eventParticipantId", "position", "odds", "probability", "trueProbability", "hasModifiedProbability" FROM ${SportsDbSchema.NRX}."projectionEventOutcome"
              WHERE ${SportsDbSchema.NRX}."projectionEventOutcome"."eventId" = '${eventId}' AND ${SportsDbSchema.NRX}."projectionEventOutcome"."position" = 2;
            `);
            break;

          case OddMarkets.HEAT_PROJECTIONS:
            if (roundId) {
              // assumption here is that the heats have been published
              // client is trying to notify the client

              await this.queueService.notifyMarketPublishNotification({
                eventId,
                sportType: SportsTypes.RALLYCROSS,
                market: projectionType,
              });
            } else {
              const projectionEventHeatOutcomeData = await transactionalEntityManager.findOne(
                ProjectionEventHeatOutcome,
                {
                  where: {
                    eventId,
                    roundHeatId,
                    isActive: true,
                  },
                  select: {
                    isActive: true,
                  },
                },
              );
              if (!projectionEventHeatOutcomeData) return;

              await transactionalEntityManager.update(
                ClientProjectionEventHeatOutcome,
                {
                  eventId,
                  roundHeatId,
                },
                {
                  isActive: false,
                  isArchived: true,
                },
              );

              await transactionalEntityManager.query(`
              INSERT INTO ${SportsDbSchema.NRX}."clientProjectionEventHeatOutcome"("eventId", "eventParticipantId", "roundHeatId", "position", "odds", "probability", "trueProbability", "hasModifiedProbability")
              SELECT "eventId", "eventParticipantId", "roundHeatId", "position", "odds", "probability", "trueProbability", "hasModifiedProbability" FROM ${SportsDbSchema.NRX}."projectionEventHeatOutcome"
              WHERE ${SportsDbSchema.NRX}."projectionEventHeatOutcome"."eventId" = '${eventId}' AND ${SportsDbSchema.NRX}."projectionEventHeatOutcome"."roundHeatId" = '${roundHeatId}';
            `);
            }
            break;

          case OddMarkets.PROP_BET_PROJECTIONS:
            const propBetsData = await transactionalEntityManager.findOne(PropBets, {
              where: {
                eventId,
                isActive: true,
              },
              select: {
                isActive: true,
              },
            });

            if (!propBetsData) return;

            await transactionalEntityManager.update(
              ClientPropBets,
              {
                eventId,
              },
              {
                isActive: false,
                isArchived: true,
              },
            );

            await transactionalEntityManager.query(`
              INSERT INTO ${SportsDbSchema.NRX}."clientPropBets"("eventId", "betId", "eventParticipantId", "proposition", "odds", "payout", "voided")
              SELECT "eventId", "betId", "eventParticipantId", "proposition", "odds", "payout", "voided" FROM ${SportsDbSchema.NRX}."propBets"
              WHERE ${SportsDbSchema.NRX}."propBets"."eventId" = '${eventId}';
            `);
            break;

          case OddMarkets.HEAD_TO_HEAD_PROJECTIONS:
            const playerHeadToHeadsData = await transactionalEntityManager.findOne(
              PlayerHeadToHeads,
              {
                where: {
                  eventId,
                  visible: true,
                  isActive: true,
                },
                select: {
                  isActive: true,
                },
              },
            );

            if (!playerHeadToHeadsData) return;

            await transactionalEntityManager.update(
              ClientPlayerHeadToHeads,
              {
                eventId,
              },
              {
                isActive: false,
                isArchived: true,
              },
            );

            await transactionalEntityManager.query(`
              INSERT INTO ${SportsDbSchema.NRX}."clientPlayerHeadToHeads"("eventId", "eventParticipant1Id", "eventParticipant2Id", "eventParticipantWinnerId", "player1Position", "player2Position", "player1Odds", "player2Odds", "player1Probability", "player2Probability", "player1TrueProbability", "player2TrueProbability", "player1HasModifiedProbability", "player2HasModifiedProbability", "voided", "draw", "holdingPercentage")
              SELECT "eventId", "eventParticipant1Id", "eventParticipant2Id", "eventParticipantWinnerId", "player1Position", "player2Position", "player1Odds", "player2Odds", "player1Probability", "player2Probability", "player1TrueProbability", "player2TrueProbability", "player1HasModifiedProbability", "player2HasModifiedProbability", "voided", "draw", "holdingPercentage" FROM ${SportsDbSchema.NRX}."playerHeadToHeads"
              WHERE ${SportsDbSchema.NRX}."playerHeadToHeads"."eventId" = '${eventId}' AND ${SportsDbSchema.NRX}."playerHeadToHeads"."visible" = true;
            `);
            break;

          case OddMarkets.PODIUM_PROJECTIONS:
            const projectionEventPodiumData = await transactionalEntityManager.findOne(
              ProjectionEventPodiums,
              {
                where: {
                  eventId,
                  isActive: true,
                },
                select: {
                  isActive: true,
                },
              },
            );
            if (!projectionEventPodiumData) return;

            await transactionalEntityManager.update(
              ClientProjectionEventPodiums,
              {
                eventId,
              },
              {
                isActive: false,
                isArchived: true,
              },
            );

            await transactionalEntityManager.query(`
              INSERT INTO ${SportsDbSchema.NRX}."clientProjectionEventPodiums"("eventId", "eventParticipantId", "odds", "probability", "trueProbability", "hasModifiedProbability")
              SELECT "eventId", "eventParticipantId", "odds", "probability", "trueProbability", "hasModifiedProbability" FROM ${SportsDbSchema.NRX}."projectionEventPodiums"
              WHERE ${SportsDbSchema.NRX}."projectionEventPodiums"."eventId" = '${eventId}';
            `);
            break;

          case OddMarkets.SHOWS_PROJECTIONS:
            const projectionEventShowsData = await transactionalEntityManager.findOne(
              ProjectionEventShows,
              {
                where: {
                  eventId,
                  isActive: true,
                },
                select: {
                  isActive: true,
                },
              },
            );
            if (!projectionEventShowsData) return;

            await transactionalEntityManager.update(
              ClientProjectionEventShows,
              {
                eventId,
              },
              {
                isActive: false,
                isArchived: true,
              },
            );

            await transactionalEntityManager.query(`
              INSERT INTO ${SportsDbSchema.NRX}."clientProjectionEventShows"("eventId", "eventParticipantId", "odds", "probability", "trueProbability", "hasModifiedProbability")
              SELECT "eventId", "eventParticipantId", "odds", "probability", "trueProbability", "hasModifiedProbability" FROM ${SportsDbSchema.NRX}."projectionEventShows"
              WHERE ${SportsDbSchema.NRX}."projectionEventShows"."eventId" = '${eventId}';
            `);
            break;

          default:
            break;
        }

        if (projectionType !== OddMarkets.HEAT_PROJECTIONS)
          await this.queueService.notifyMarketPublishNotification({
            eventId,
            sportType: SportsTypes.RALLYCROSS,
            market: projectionType,
          });
      },
    );

    return true;
  }

  async saveScores(scoresPayload: TraderScores): Promise<boolean> {
    await this.scoresRepository.manager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        let participantSeedCount = 1;

        for await (const score of scoresPayload.items) {
          try {
            const tour = await this.toursRepository.findOne({
              where: {
                name: score.tourName,
                gender: score.gender,
              },
              select: ["id", "gender"],
              relations: ["years"],
            });
            if (!tour) continue;

            const year = tour.years.find((tourYear) => tourYear.year === score.year);
            const event = await this.eventsRepository.findOne({
              where: {
                name: score.eventName,
                tourYearId: year.id,
              },
              select: ["id"],
            });
            if (!event) continue;

            const eventRound = await this.eventRoundRepository.findOne({
              where: {
                eventId: event.id,
                round: {
                  name: score.roundName,
                },
              },
              select: {
                id: true,
                eventId: true,
                roundId: true,
                round: {
                  id: true,
                  roundNo: true,
                  name: true,
                },
              },
              relations: ["round"],
            });
            if (!eventRound) continue;
            const { round } = eventRound;

            if (!round) continue;

            const roundHeat = await this.heatsRepository.findOne({
              where: {
                eventId: event.id,
                roundId: round.id,
                heatNo: score.heatNumber,
              },
              select: {
                id: true,
                heatName: true,
              },
            });
            if (!roundHeat) continue;

            const nameSplit = score.athlete.trim().split(" ");
            const athleteFirstName = nameSplit?.[0]?.trim();
            const athleteMiddleName = nameSplit.slice(1, -1).join(" ");
            // to avoid having the firt name also as the last name
            const athleteLastName =
              nameSplit.length > 1 ? nameSplit?.[nameSplit.length - 1].trim() : "";

            // const athleteWhereClause: Partial<Athletes> = {
            //   firstName: athleteFirstName,
            // };
            // if (athleteMiddleName) athleteWhereClause.middleName = athleteMiddleName;
            // if (athleteLastName) athleteWhereClause.lastName = athleteLastName;
            // let athlete = await transactionalEntityManager.findOne(Athletes, {
            //   where: athleteWhereClause,
            //   select: {
            //     id: true,
            //   },
            // });

            const athleteQuery = transactionalEntityManager
              .createQueryBuilder(Athletes, "athletes")
              .select(["athletes.id as id"])
              .where("LOWER(athletes.firstName) = LOWER(:firstName)", {
                firstName: athleteFirstName,
              });
            if (athleteLastName)
              athleteQuery.andWhere("LOWER(athletes.lastName) = LOWER(:lastName)", {
                lastName: athleteLastName,
              });
            let athlete = await athleteQuery
              .andWhere({
                isActive: true,
                isArchived: false,
              })
              .getRawOne();

            if (athlete && score.playerStatus) {
              await transactionalEntityManager.update(
                Athletes,
                {
                  id: athlete.id,
                },
                {
                  playerStatus: score.playerStatus,
                },
              );
            }

            if (!athlete) {
              athlete = await transactionalEntityManager.save(
                this.athletesRepository.create({
                  firstName: athleteFirstName,
                  middleName: athleteMiddleName,
                  lastName: athleteLastName,
                  gender: tour.gender,
                  playerStatus: score.playerStatus ? score.playerStatus : AthleteStatus.ACTIVE,
                }),
              );
            }

            let eventParticipant = await transactionalEntityManager.findOne(EventParticipants, {
              where: {
                eventId: event.id,
                athleteId: athlete.id,
              },
              select: {
                id: true,
                seedNo: true,
                athleteId: true,
              },
            });
            if (eventParticipant && score.playerStatus) {
              await transactionalEntityManager.update(
                EventParticipants,
                {
                  id: eventParticipant.id,
                },
                {
                  status: score.playerStatus,
                },
              );
            }
            if (!eventParticipant) {
              eventParticipant = await transactionalEntityManager.save(
                this.eventParticipantsRepository.create({
                  athleteId: athlete.id,
                  eventId: event.id,
                  seedNo: participantSeedCount++,
                  baseProjection: 0,
                  // baseLapTime: 0,
                  soloCrashRate: 0,
                  baseHeadLapTime: 0,
                  headCrashRate: 0,
                  raceCrashRate: 0,
                  // baseJokerLapTime: 0,
                  baseNonJokerLapTime: 0,
                  status: score.playerStatus,
                }),
              );
            }

            const existingScore = await transactionalEntityManager.findOne(Scores, {
              where: {
                athleteId: athlete.id,
                eventId: event.id,
                roundHeatId: roundHeat.id,
                lapNumber: score.lapNumber,
              },
              select: {
                id: true,
              },
            });
            // eslint-disable-next-line unicorn/prefer-ternary
            if (existingScore) {
              await transactionalEntityManager.update(
                Scores,
                {
                  id: existingScore.id,
                },
                {
                  roundSeed: eventParticipant?.seedNo || 0,
                  lapTime: score.lapTime,
                  jokerLapTime: score.jokerLapTime,
                  lapNumber: score.lapNumber,
                  isJoker: score.isJoker,
                  isBye: score.isBye,
                  notes: score.notes,
                  status: score.status,
                },
              );
            } else {
              await transactionalEntityManager.save(
                this.scoresRepository.create({
                  athleteId: athlete.id,
                  eventId: event.id,
                  roundHeatId: roundHeat.id,
                  lapTime: score.lapTime,
                  jokerLapTime: score.jokerLapTime,
                  lapNumber: score.lapNumber,
                  isJoker: score.isJoker,
                  isBye: score.isBye,
                  roundSeed: eventParticipant?.seedNo || 0,
                  notes: score.notes,
                  status: score.status,
                }),
              );
            }
          } catch (error) {
            throw error;
          }
        }
      },
    );

    return true;
  }

  async saveEventSeed(payload: EventSeedDto) {
    await this.eventParticipantsRepository.manager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        try {
          // const affectedEventIds = [];
          const insertPayload = [];
          const replacementList: IParticipantReplacement[] = [];

          // loop through and find all events that are going to be affected by the seed
          const uniqueEventObj: {
            [key: string]: {
              name: string;
              gender: string;
              year: number;
            };
          } = {};

          // create a unique key for each event using the name, gender and year
          payload.items.forEach((item) => {
            const key = `${item.eventName}_${item.gender}_${item.tourYear}`;
            if (!uniqueEventObj[key])
              uniqueEventObj[key] = {
                name: item.eventName,
                gender: item.gender,
                year: +item.tourYear,
              };
          });

          // loop through and find the unique events
          const events = await Promise.all(
            Object.values(uniqueEventObj).map(async (row) => {
              try {
                const event = await this.eventsRepository.findOne({
                  where: {
                    name: row.name,
                    tourYear: {
                      tour: {
                        gender: row.gender,
                      },
                      year: row.year,
                    },
                    isActive: true,
                    isArchived: false,
                  },
                  relations: ["tourYear.tour"],
                  select: {
                    id: true,
                    name: true,
                    providerRunId: true,
                    tourYear: {
                      tourId: true,
                      year: true,
                      tour: {
                        id: true,
                        gender: true,
                      },
                    },
                  },
                });

                if (!event) {
                  throw eventExceptions.eventNotFound({
                    eventName: row.name,
                  });
                }

                return event;
              } catch (eventError) {
                throw eventError;
              }
            }),
          );

          // mark the participants of these events as inactive so that later on, these can be marked as active
          // that ways any that are not in use will automatically be in active
          await transactionalEntityManager.update(
            EventParticipants,
            {
              eventId: In(events.map((event) => event.id)),
            },
            {
              isActive: false,
              isArchived: true,
            },
          );

          for await (const item of payload.items) {
            try {
              // let athlete = await transactionalEntityManager.findOne(Athletes, {
              //   where: {
              //     firstName: Raw((alias) => `LOWER(${alias}) = '${item.firstName.toLowerCase()}'`),
              //     middleName: Raw(
              //       (alias) => `LOWER(${alias}) = '${item.middleName.toLowerCase()}'`,
              //     ),
              //     lastName: Raw((alias) => `LOWER(${alias}) = '${item.lastName.toLowerCase()}'`),
              //     isActive: true,
              //     isArchived: false,
              //   },
              //   select: {
              //     id: true,
              //   },
              // });
              const athleteQuery = transactionalEntityManager
                .createQueryBuilder(Athletes, "Athletes")
                .select(["id"])
                .where(`LOWER("firstName") = LOWER(:firstName)`, {
                  firstName: item.firstName,
                });
              if (item.middleName)
                athleteQuery.andWhere(`LOWER("middleName") = LOWER(:middleName)`, {
                  middleName: item.middleName,
                });
              if (item.lastName)
                athleteQuery.andWhere(`LOWER("lastName") = LOWER(:lastName)`, {
                  lastName: item.lastName,
                });
              let athlete = await athleteQuery
                .andWhere({
                  isActive: true,
                  isArchived: false,
                })
                .getRawOne();

              const event = events.find((eventRow) => {
                const eventKey = `${eventRow.name}_${eventRow.tourYear.tour.gender}_${eventRow.tourYear.year}`;
                const itemKey = `${item.eventName}_${item.gender}_${item.tourYear}`;

                return eventKey === itemKey;
              });
              if (!event) throw eventExceptions.eventNotFound(item);

              if (!athlete) {
                const insertAthlete = this.athletesRepository.create({
                  firstName: item.firstName,
                  middleName: item.middleName,
                  lastName: item.lastName,
                  gender: item.gender,
                  nationality: item.nationality,
                  playerStatus: item.playerStatus,
                  stance: item.stance,
                });
                athlete = await transactionalEntityManager.save(insertAthlete);
              } else {
                // update the data
                await transactionalEntityManager.update(
                  Athletes,
                  {
                    id: athlete.id,
                  },
                  {
                    firstName: item.firstName,
                    middleName: item.middleName,
                    lastName: item.lastName,
                    gender: item.gender,
                    nationality: item.nationality,
                    playerStatus: item.playerStatus,
                    stance: item.stance,
                    isActive: true,
                    isArchived: false,
                  },
                );
              }

              const existingEventParticipant = await transactionalEntityManager.findOne(
                EventParticipants,
                {
                  where: {
                    eventId: event.id,
                    athleteId: athlete.id,
                  },
                  select: ["id"],
                },
              );

              const isActiveParticipant = [
                AthleteStatus.ACTIVE,
                AthleteStatus.REPLACEMENT,
              ].includes(item.playerStatus);

              if (existingEventParticipant?.id) {
                // update
                await transactionalEntityManager.update(
                  EventParticipants,
                  {
                    id: existingEventParticipant.id,
                  },
                  {
                    seedNo: item.seed,
                    baseProjection: item.baseProjection,
                    // baseLapTime: item.baseLapTime,
                    soloCrashRate: item.soloCrashRate,
                    baseHeadLapTime: item.baseHeadLapTime,
                    headCrashRate: item.headCrashRate,
                    raceCrashRate: item.raceCrashRate,
                    // baseJokerLapTime: item.baseJokerLapTime,
                    baseNonJokerLapTime: item.baseNonJokerLapTime,
                    status: item.playerStatus,
                    isActive: item.seed > 0 && isActiveParticipant,
                    isArchived: item.seed <= 0 || !isActiveParticipant,
                    notes: item.notes,
                  },
                );
              } else {
                // insert
                const eventParticipant = this.eventParticipantsRepository.create({
                  eventId: event.id,
                  athleteId: athlete.id,
                  seedNo: item.seed,
                  baseProjection: item.baseProjection,
                  // baseLapTime: item.baseLapTime,
                  soloCrashRate: item.soloCrashRate,
                  baseHeadLapTime: item.baseHeadLapTime,
                  headCrashRate: item.headCrashRate,
                  raceCrashRate: item.raceCrashRate,
                  // baseJokerLapTime: item.baseJokerLapTime,
                  baseNonJokerLapTime: item.baseNonJokerLapTime,
                  status: item.playerStatus,
                  isActive: item.seed > 0 && isActiveParticipant,
                  isArchived: item.seed <= 0 || !isActiveParticipant,
                  notes: item.notes,
                });

                insertPayload.push(eventParticipant);
              }

              if (item.playerStatus === AthleteStatus.REPLACEMENT) {
                // find the injured athlete whos name is included in the notes for replacement
                const injuredAthleteRow = payload.items
                  .filter((row) => row.playerStatus === AthleteStatus.INJURED)
                  .find((row) =>
                    item.notes.includes(`${row.firstName} ${row.middleName} ${row.lastName}`),
                  );

                if (injuredAthleteRow)
                  replacementList.push({
                    injuredAthleteName: `${injuredAthleteRow.firstName} ${injuredAthleteRow.middleName} ${injuredAthleteRow.lastName}`,
                    replacementAthleteId: athlete.id,
                    eventId: event.id,
                  });
              }
            } catch (error) {
              throw error;
            }
          }

          try {
            if (insertPayload.length) await transactionalEntityManager.save(insertPayload);

            const scoresPayload = [];
            for await (const event of events) {
              try {
                if (event.providerRunId) {
                  // this is a thrill one event, do not prefill scores
                  continue;
                }

                const eventScores = await transactionalEntityManager.count(Scores, {
                  where: {
                    eventId: event.id,
                  },
                  select: {
                    isActive: true,
                  },
                });

                const eventRound = await transactionalEntityManager.findOne(EventRounds, {
                  where: {
                    eventId: event.id,
                    round: {
                      roundNo: 1,
                    },
                  },
                  select: {
                    id: true,
                    roundId: true,
                    roundStatus: true,
                    round: {
                      id: true,
                      roundNo: true,
                    },
                  },
                  relations: ["round"],
                });

                if (!eventRound)
                  throw eventRoundExceptions.eventRoundNotFound({ EventId: event.id });

                // fetch all round heats for the current event for round 1
                const heats = await transactionalEntityManager.find(RoundHeats, {
                  where: {
                    eventId: event.id,
                    roundId: eventRound.round.id,
                  },
                  select: {
                    id: true,
                    heatNo: true,
                  },
                });

                if (heats.length)
                  // open markets for all round 1 heats
                  await transactionalEntityManager.update(
                    RoundHeats,
                    {
                      id: In(heats.map((heat) => heat.id)),
                    },
                    {
                      isHeatWinnerMarketOpen: true,
                    },
                  );
                // open markets for the event as well
                await transactionalEntityManager.update(
                  Events,
                  {
                    id: event.id,
                  },
                  {
                    isEventWinnerMarketOpen: true,
                  },
                );

                // this event already has heats
                if (eventScores > 0) {
                  // instead of not doing anything here, the issue that occurs is the seeds can change
                  // in which case a lot changes so clear the data only if round 1 is not completed
                  if ([RoundStatus.COMPLETED].includes(eventRound.roundStatus)) {
                    // if it is completed that means that the event has already progressed and nothing to do here
                  } else {
                    // clearing all scores for the event so the data can be reinserted
                    await transactionalEntityManager.delete(Scores, {
                      eventId: event.id,
                      roundHeatId: In(heats.map((heat) => heat.id)),
                    });
                  }
                }

                const eventParticipants = await transactionalEntityManager.find(EventParticipants, {
                  where: {
                    eventId: event.id,
                    isActive: true,
                    isArchived: false,
                  },
                  select: {
                    id: true,
                    athleteId: true,
                    seedNo: true,
                  },
                });

                const freePracticeHeat = await transactionalEntityManager.findOne(RoundHeats, {
                  where: {
                    eventId: event.id,
                    roundId: eventRound.round.id,
                    heatNo: 1,
                  },
                  select: {
                    id: true,
                  },
                });

                // free practise is done for 4 laps
                const lapCount: number = 3;

                for (let lap = 1; lap <= lapCount; lap++) {
                  scoresPayload.push(
                    ...eventParticipants.map((eventParticipant) =>
                      this.scoresRepository.create({
                        eventId: event.id,
                        roundHeatId: freePracticeHeat.id,
                        athleteId: eventParticipant.athleteId,
                        roundSeed: eventParticipant.seedNo,
                        lapNumber: lap,
                      }),
                    ),
                  );
                }
              } catch (error) {
                throw error;
              }
            }

            if (scoresPayload.length) await transactionalEntityManager.save(scoresPayload);
          } catch (error) {
            throw error;
          }

          // this is mainly for events that have already been seeded but not started
          // in that case the system should update the athletes in the heats in case there is an injured list
          if (replacementList.length) {
            const promises = replacementList.map(async (item) => {
              try {
                // check to see if event is not live since that is the only case where the automatic update should kick in
                const event = await this.eventsRepository.findOne({
                  where: {
                    id: item.eventId,
                  },
                  select: {
                    id: true,
                    eventStatus: true,
                  },
                });

                if (
                  [EventStatus.LIVE, EventStatus.POSTPONED, EventStatus.COMPLETED].includes(
                    event.eventStatus,
                  )
                )
                  return false;

                const eventRound = await transactionalEntityManager.findOne(EventRounds, {
                  where: {
                    eventId: item.eventId,
                    round: {
                      roundNo: 1,
                    },
                  },
                  select: {
                    id: true,
                    roundId: true,
                    round: {
                      id: true,
                    },
                  },
                  relations: ["round"],
                });

                const heats = await transactionalEntityManager.find(RoundHeats, {
                  where: {
                    eventId: item.eventId,
                    roundId: eventRound.round.id,
                  },
                  select: {
                    id: true,
                  },
                });

                const nameSplit = item.injuredAthleteName.trim().split(" ");
                const athleteFirstName = nameSplit?.[0]?.trim();
                const athleteMiddleName = nameSplit.slice(1, -1).join(" ");
                const athleteLastName =
                  nameSplit.length > 1 ? nameSplit?.[nameSplit.length - 1].trim() : "";

                const injuredAthlete = await transactionalEntityManager.findOne(Athletes, {
                  where: {
                    firstName: athleteFirstName,
                    middleName: athleteMiddleName,
                    lastName: athleteLastName,
                  },
                  select: {
                    id: true,
                  },
                });

                const score = await transactionalEntityManager.findOne(Scores, {
                  where: {
                    eventId: item.eventId,
                    roundHeatId: In(heats.map((heat) => heat.id)),
                    athleteId: injuredAthlete.id,
                  },
                  select: {
                    id: true,
                  },
                });

                // replacement is likely in place and doesn't need to be replaced
                if (!score) return false;

                await transactionalEntityManager.update(
                  Scores,
                  {
                    id: score.id,
                  },
                  {
                    athleteId: item.replacementAthleteId,
                  },
                );

                return true;
              } catch (error) {
                throw error;
              }
            });

            await Promise.all(promises);
          }

          // handled at the time of thrill one
          // for each event create missing round and heats if they do not exist
          /* for await (const event of events) {
            try {
              await this.eventSetupEventRounds(event.id, false, transactionalEntityManager);
            } catch (error) {
              throw error;
            }
          }*/

          if (events.length)
            await Promise.all(
              events.map((event) =>
                this.queueService.notifyEventUpdate({
                  eventId: event.id,
                  delaySeconds: 10,
                  sportType: SportsTypes.RALLYCROSS,
                }),
              ),
            );

          return true;
        } catch (transactionError) {
          throw transactionError;
        }
      },
    );

    return true;
  }

  async fetchEventParticipant(
    eventId: string,
    includeArchived: boolean = false,
  ): Promise<EventParticipants[]> {
    const event = await this.eventsRepository.findOne({
      where: {
        id: eventId,
        isActive: true,
        isArchived: false,
      },
      select: ["id"],
    });

    if (!event) {
      throw eventExceptions.eventNotFound({
        eventId,
      });
    }

    const eventParticipants = await this.eventParticipantsRepository.find({
      where: !includeArchived
        ? {
            eventId,
            isActive: true,
            isArchived: false,
          }
        : [
            {
              eventId,
              isActive: true,
              isArchived: false,
            },
            {
              eventId,
              isActive: false,
              isArchived: true,
            },
          ],
      relations: ["event.tourYear.tour", "athlete"],
      select: {
        id: true,
        seedNo: true,
        baseProjection: true,
        // baseLapTime: true,
        soloCrashRate: true,
        baseHeadLapTime: true,
        headCrashRate: true,
        raceCrashRate: true,
        // baseJokerLapTime: true,
        baseNonJokerLapTime: true,
        status: true,
        notes: true,
        event: {
          id: true,
          name: true,
          eventStatus: true,
          eventLocation: true,
          tourYear: {
            id: true,
            tourId: true,
            year: true,
            tour: {
              name: true,
              gender: true,
            },
          },
        },
        athlete: {
          id: true,
          firstName: true,
          middleName: true,
          lastName: true,
          nationality: true,
          stance: true,
          playerStatus: true,
          yearStatus: true,
          gender: true,
        },
      },
      order: {
        seedNo: "ASC",
      },
    });

    return eventParticipants;
  }

  async fetchHeatScore(heatId: string): Promise<{
    scores: Scores[];
    heat: RoundHeats;
  }> {
    const [scores, heat] = await Promise.all([
      this.scoresRepository.find({
        where: {
          roundHeatId: heatId,
        },
        relations: ["athlete"],
        select: {
          id: true,
          athleteId: true,
          roundSeed: true,
          lapTime: true,
          jokerLapTime: true,
          penaltyTime: true,
          heatPosition: true,
          lapNumber: true,
          isJoker: true,
          isBye: true,
          status: true,
          athlete: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
            nationality: true,
            stance: true,
          },
        },
        order: {
          lapNumber: "ASC",
          roundSeed: "ASC",
          heatPosition: {
            direction: "ASC",
            // nulls: "LAST",
          },
        },
      }),
      this.heatsRepository.findOne({
        where: {
          id: heatId,
        },
        select: {
          id: true,
          startDate: true,
          endDate: true,
          heatNo: true,
          heatName: true,
          heatStatus: true,
          eventId: true,
          roundId: true,
        },
      }),
    ]);

    return { scores, heat };
  }

  async fetchEventHeats(eventId: string, roundId: string): Promise<RoundHeats[]> {
    const heats = await this.heatsRepository.find({
      where: {
        eventId,
        roundId,
      },
      relations: ["scores.athlete"],
      select: {
        id: true,
        startDate: true,
        endDate: true,
        heatNo: true,
        heatName: true,
        heatStatus: true,
        eventId: true,
        roundId: true,
        scores: {
          id: true,
          athleteId: true,
          roundSeed: true,
          lapTime: true,
          jokerLapTime: true,
          penaltyTime: true,
          heatPosition: true,
          lapNumber: true,
          isJoker: true,
          isBye: true,
          status: true,
          athlete: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
            nationality: true,
            stance: true,
          },
        },
      },
    });

    return heats;
  }

  async saveLiveHeatDetails(payload: TraderLiveScoresDto, heatId: string, eventId: string) {
    const result = await this.scoresRepository.manager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        try {
          const heatUpdateObj: Partial<RoundHeats> = {};
          if (payload.startDate) heatUpdateObj.startDate = payload.startDate;
          if (payload.endDate) heatUpdateObj.endDate = payload.endDate;

          if (Object.keys(heatUpdateObj).length > 0)
            await transactionalEntityManager.update(
              RoundHeats,
              {
                id: heatId,
              },
              heatUpdateObj,
            );

          const roundHeat = await this.heatsRepository.findOne({
            where: {
              id: heatId,
              eventId,
            },
            select: {
              id: true,
              roundId: true,
              eventId: true,
              heatNo: true,
              round: {
                id: true,
                roundNo: true,
              },
            },
            relations: ["round"],
          });

          // const roundHeats = await this.heatsRepository.find({
          //   where: {
          //     roundId: roundHeat.roundId,
          //     eventId,
          //   },
          //   select: {
          //     id: true,
          //     roundId: true,
          //   },
          // });

          const scoresToArchive = [];
          const scoresSavePayload = payload.athletes
            .map((item) => {
              if (item?.athleteId) {
                return {
                  id: item.id || undefined,
                  eventId,
                  athleteId: item.athleteId,
                  roundHeatId: heatId,
                  roundSeed: item.seed,
                  lapTime: item.lapTime,
                  penaltyTime: item.penaltyTime,
                  lapNumber: item.lapNumber,
                  heatPosition:
                    item.status === NRXLapStatus.BYE && !item.heatPosition ? 1 : item.heatPosition,
                  isJoker: item.isJoker,
                  status: item.status,
                };
              } else {
                const validKeys = Object.values(item).filter((itemRow) => !!itemRow);
                if (item?.id && validKeys.length === 1) scoresToArchive.push(item.id);
                return null;
              }
            })
            .filter((item) => item !== null);

          if (scoresToArchive.length) {
            await transactionalEntityManager.delete(Scores, {
              id: In(scoresToArchive),
            });
          }

          if (payload.startDate && payload.heatStatus === HeatStatus.LIVE) {
            // mark current event, round and heat as live
            await Promise.all([
              transactionalEntityManager.update(
                Events,
                {
                  id: eventId,
                  eventStatus: Not(In([EventStatus.COMPLETED])),
                },
                {
                  eventStatus: EventStatus.LIVE,
                },
              ),
              transactionalEntityManager.update(
                EventRounds,
                {
                  eventId,
                  roundId: roundHeat.round.id,
                  roundStatus: Not(In([RoundStatus.COMPLETED])),
                },
                {
                  roundStatus: RoundStatus.LIVE,
                  startDate: new Date().toISOString(),
                },
              ),
              transactionalEntityManager.update(
                RoundHeats,
                {
                  // only current heat should be live
                  id: heatId,
                  // id: In(roundHeats.map((item) => item.id)),
                  heatStatus: Not(In([HeatStatus.COMPLETED])),
                },
                {
                  heatStatus: HeatStatus.LIVE,
                  // market closes when the heat is live
                  isHeatWinnerMarketOpen: false,
                },
              ),
            ]);
          }

          if (scoresSavePayload.length)
            await transactionalEntityManager.save(Scores, scoresSavePayload);

          if (payload.athletes?.length > 0 && payload.heatStatus === HeatStatus.LIVE) {
            await Promise.all([
              transactionalEntityManager.update(
                Events,
                {
                  id: eventId,
                  eventStatus: Not(In([EventStatus.COMPLETED])),
                },
                {
                  eventStatus: EventStatus.LIVE,
                },
              ),
              transactionalEntityManager.update(
                EventRounds,
                {
                  eventId,
                  roundId: roundHeat.round.id,
                  roundStatus: Not(In([RoundStatus.COMPLETED])),
                },
                {
                  roundStatus: RoundStatus.LIVE,
                  startDate: new Date().toISOString(),
                },
              ),
              transactionalEntityManager.update(
                RoundHeats,
                {
                  // only current heat should be live
                  id: heatId,
                  // id: In(roundHeats.map((item) => item.id)),
                  heatStatus: Not(In([HeatStatus.COMPLETED])),
                },
                {
                  heatStatus: RoundStatus.LIVE,
                  // market closes when the heat is live
                  isHeatWinnerMarketOpen: false,
                },
              ),
            ]);
          }

          const heatWinner = payload.athletes.find((item) => item.heatPosition === 1);

          if (payload.hasHeatEnded) {
            await Promise.all([
              // close market for the current heat
              transactionalEntityManager.update(
                RoundHeats,
                { id: heatId },
                {
                  winnerAthleteId: heatWinner?.athleteId,
                  isHeatWinnerMarketOpen: false,
                  heatStatus: HeatStatus.COMPLETED,
                  endDate: payload.endDate || new Date().toISOString(),
                },
              ),
            ]);

            try {
              await this.handleSaveMensLiveScore(
                roundHeat,
                roundHeat.eventId,
                transactionalEntityManager,
              );
            } catch (roundLogicError) {
              // FIXME: intentionally ignoring error here to prevent transaction failing
            }
            await this.queueService.notifyEventUpdate({
              eventId: roundHeat.eventId,
              delaySeconds: 10,
              sportType: SportsTypes.RALLYCROSS,
            });
          }

          return true;
        } catch (error) {
          throw error;
        }
      },
    );

    return result;
  }

  async eventSetupEventRounds(
    eventId: string,
    markMissingEntitiesAsCompleted: boolean = false,
    transactionalEntityManager: EntityManager,
  ) {
    try {
      // find all the event rounds for the event
      // loop through and find the first event round that does not exist
      // create the round and the heats

      const eventRounds = await transactionalEntityManager.find(EventRounds, {
        where: {
          eventId,
          isActive: true,
          isArchived: false,
          round: {
            isActive: true,
            isArchived: false,
            heats: {
              eventId,
              isActive: true,
              isArchived: false,
            },
          },
        },
        relations: ["round.heats"],
        order: {
          round: {
            roundNo: "ASC",
          },
        },
        select: {
          id: true,
          eventId: true,
          round: {
            id: true,
            name: true,
            roundNo: true,
            heats: {
              id: true,
              eventId: true,
              heatNo: true,
            },
          },
        },
      });

      const promises = Object.keys(nrxRoundConfig).map(async (key) => {
        const expectedRoundNo: NRXRounds = +key;
        const roundDetails: INRXConfigItem = nrxRoundConfig[key];
        const eventRound = eventRounds.find(
          (eventRoundItem) => eventRoundItem.round.roundNo === expectedRoundNo,
        );
        if (!eventRound) {
          // create round and heats
          let existingRound = await transactionalEntityManager.findOne(Rounds, {
            where: {
              roundNo: expectedRoundNo,
              name: roundDetails.name,
            },
          });
          if (!existingRound) {
            existingRound = await transactionalEntityManager.save(
              this.roundsRepository.create({
                name: roundDetails.name,
                roundNo: expectedRoundNo,
              }),
            );
          }

          await Promise.all([
            transactionalEntityManager.save(
              this.eventRoundRepository.create({
                eventId,
                roundId: existingRound.id,
                roundStatus: !markMissingEntitiesAsCompleted
                  ? RoundStatus.UPCOMING
                  : RoundStatus.COMPLETED,
              }),
            ),
            transactionalEntityManager.save(
              Array(roundDetails.heats)
                .fill(1)
                .map((_, index) =>
                  this.heatsRepository.create({
                    eventId,
                    roundId: existingRound.id,
                    heatNo: index + 1,
                    heatStatus: !markMissingEntitiesAsCompleted
                      ? HeatStatus.UPCOMING
                      : HeatStatus.COMPLETED,
                    heatName: "Heat",
                    isHeatWinnerMarketOpen: false,
                    isHeatWinnerMarketVoided: false,
                  }),
                ),
            ),
          ]);
        } else {
          // round exists but check if all heats exist
          const heatCount = eventRound.round.heats.length;
          if (roundDetails.heats !== heatCount) {
            // add missing heats
            // const missingHeats = roundDetails.heats - heatCount;

            const heatsPayload: RoundHeats[] = [];

            for (let heat = 1; heat <= roundDetails.heats; heat++) {
              // this is to handle the case that there might be heats missing in the middle
              const isHeatExists = eventRound.round.heats.some(
                (eventHeat) => eventHeat.heatNo === heat,
              );
              if (!isHeatExists)
                heatsPayload.push(
                  this.heatsRepository.create({
                    eventId,
                    roundId: eventRound.round.id,
                    heatNo: heat,
                    heatStatus: !markMissingEntitiesAsCompleted
                      ? HeatStatus.UPCOMING
                      : HeatStatus.COMPLETED,
                    heatName: "Heat",
                    isHeatWinnerMarketOpen: false,
                    isHeatWinnerMarketVoided: false,
                  }),
                );
            }

            if (heatsPayload.length) await transactionalEntityManager.save(heatsPayload);
          }
        }

        return true;
      });

      await Promise.all(promises);

      return true;
    } catch (error) {
      throw error;
    }
  }

  private async handleSaveMensLiveScore(
    currentRoundHeat: RoundHeats,
    eventId: string,
    transactionalEntityManager: EntityManager,
    // this is used for situation where an entire round is skipped
    // because there aren't enough athletes and none of the heats are completed
    // so this helps bypass that check
    // isSkippingRound: boolean = false,
  ): Promise<boolean> {
    try {
      const roundsMap: IRoundStateMap[] = await this.generateRoundMap(
        eventId,
        transactionalEntityManager,
      );

      // get the current round
      const currentRoundItem = roundsMap.find((item) => item.status === RoundStatus.LIVE);

      // get the next round, this will be the first round that is upcoming or next
      const nextRoundItem = roundsMap.find(
        (item) =>
          [RoundStatus.UPCOMING, RoundStatus.NEXT].includes(item.status) &&
          item.eventRoundNo > currentRoundItem.eventRoundNo &&
          item.roundNo > currentRoundItem.roundNo,
      );

      // optional because nextRoundItem will be null when he current round is final
      const nextRound = nextRoundItem
        ? await transactionalEntityManager.findOne(EventRounds, {
            where: {
              eventId,
              id: nextRoundItem.eventRoundId,
              round: {
                heats: {
                  eventId,
                },
              },
            },
            relations: ["round.heats"],
            select: {
              id: true,
              roundId: true,
              eventId: true,
              round: {
                id: true,
                roundNo: true,
                heats: {
                  id: true,
                  roundId: true,
                  heatNo: true,
                  eventId: true,
                },
              },
            },
            order: {
              round: {
                roundNo: "ASC",
              },
            },
          })
        : null;

      const currentRoundHeats = await transactionalEntityManager.find(RoundHeats, {
        where: {
          roundId: currentRoundHeat.roundId,
          eventId,
          scores: {
            eventId,
            athlete: {
              participant: {
                eventId,
              },
            },
          },
        },
        select: {
          id: true,
          heatNo: true,
          heatStatus: true,
          scores: {
            roundHeatId: true,
            roundSeed: true,
            lapTime: true,
            heatPosition: true,
            athleteId: true,
            athlete: {
              id: true,
              participant: {
                id: true,
                athleteId: true,
                seedNo: true,
              },
            },
          },
        },
        relations: ["scores.athlete.participant"],
      });

      // check to see if all the heats other than the current heat is marked as completed
      // this occurrs specially in nrx because it can be a sitaution where the last heat
      // is already completed because there is no competition
      // so any heat can be closed which might close the entire round
      const hasInProgressHeat = currentRoundHeats.some(
        (heat) => heat.id !== currentRoundHeat.id && heat.heatStatus !== HeatStatus.COMPLETED,
      );

      // if (!hasInProgressHeat || isSkippingRound) {
      if (!hasInProgressHeat) {
        const promises = [];

        promises.push(
          // close the round as well
          transactionalEntityManager.update(
            EventRounds,
            {
              id: currentRoundItem.eventRoundId,
              eventId,
            },
            {
              roundStatus: RoundStatus.COMPLETED,
              endDate: new Date().toISOString(),
            },
          ),
          // close market for the current heat
          // transactionalEntityManager.update(
          //   RoundHeats,
          //   { id: currentRoundHeat.id, eventId },
          //   {
          //     isHeatWinnerMarketOpen: false,
          //     heatStatus: HeatStatus.COMPLETED,
          //     endDate: new Date().toISOString(),
          //   },
          // ),
        );

        if (![NRXRounds.FINALS].includes(currentRoundItem.eventRoundNo)) {
          promises.push(
            // transactionalEntityManager.update(
            //   EventRounds,
            //   {
            //     id: nextRoundItem.eventRoundId,
            //     eventId,
            //   },
            //   {
            //     roundStatus: RoundStatus.LIVE,
            //   },
            // ),
            // when the next round opens then all markets open for all heats of that round
            transactionalEntityManager.update(
              RoundHeats,
              { id: In(nextRound.round.heats.map((heatItem) => heatItem.id)), eventId },
              {
                isHeatWinnerMarketOpen: true,
                // heatStatus: HeatStatus.LIVE,
              },
            ),
          );
        }

        await Promise.all(promises);
      } else {
        // no round advancement is required
        return false;
      }

      //     if ([NRXRounds.FINALS].includes(currentRoundItem.eventRoundNo)) {
      //       // nothing further to do

      //       await transactionalEntityManager.update(
      //         Events,
      //         {
      //           id: eventId,
      //         },
      //         {
      //           eventStatus: EventStatus.COMPLETED,
      //           endDate: new Date().toISOString(),
      //           isEventWinnerMarketOpen: false,
      //         },
      //       );

      //       return true;
      //     }

      //     const scoresPayload: Scores[] = [];
      //     // logic for round advancement

      //     const BQ = {
      //       1: [1, 3, 5, 7, 9, 11, 13, 15],
      //       2: [2, 4, 6, 8, 10, 12, 14, 16],
      //     };

      //     const BR1 = {
      //       1: [1, 16],
      //       2: [8, 9],
      //       3: [4, 13],
      //       4: [5, 12],
      //       5: [2, 15],
      //       6: [7, 10],
      //       7: [3, 14],
      //       8: [6, 11],
      //     };

      //     const ROUND1 = {
      //       1: [1, 6, 7, 10, 13, 16],
      //       2: [2, 5, 9, 12, 15, 18],
      //       3: [3, 4, 8, 11, 14, 17],
      //     };

      //     const semiFinalRound = {
      //       1: ["1_2", "3_2", "2_3", "1_4", "3_4", "2_5", "1_6"],
      //       2: ["2_2", "1_3", "3_3", "2_4", "1_5", "3_5"],
      //     };

      //     /* if (
      //         [NRXRounds.FP1, NRXRounds.FP2].includes(currentRoundItem.eventRoundNo) &&
      //         [NRXEventCategoryType.SUPERCAR].includes(event.categoryName)
      //       ) {
      //         // for each heat, get the scores
      //         currentRoundHeats.forEach((roundHeat) => {
      //           // FP2 only has a single heat
      //           const heatResult: IAthleteLap[] = orderBy(
      //             this.processGridResult(roundHeat, true),
      //             ["lapTime"],
      //             "asc",
      //           );

      //           Object.keys(BR1).forEach((key: string) => {
      //             const heatNo: number = +key;
      //             const positions: number[] = BR1[heatNo];

      //             const nextRoundHeat = nextRound.round.heats.find(
      //               (heatItem) => heatItem.heatNo === heatNo,
      //             );

      //             positions.forEach((position) => {
      //               if (!heatResult[position - 1]) {
      //                 // this can happen when there are not enough athlete participating
      //                 return false;
      //               }

      //               // for BR1, each athlete must do 4
      //               Array(4)
      //                 .fill(1)
      //                 .forEach((_, index) => {
      //                   scoresPayload.push(
      //                     this.scoresRepository.create({
      //                       eventId,
      //                       roundHeatId: nextRoundHeat.id,
      //                       athleteId: heatResult[position - 1].athleteId,
      //                       roundSeed: position,
      //                       lapNumber: index + 1,
      //                     }),
      //                   );
      //                 });
      //             });
      //           });
      //         });
      //       }  */
      //     if (currentRoundItem.status !== RoundStatus.COMPLETED)
      //       if (NRXRounds.TP === currentRoundItem.eventRoundNo) {
      //         // for each heat, get the scores
      //         currentRoundHeats.forEach((roundHeat) => {
      //           const heatResult: IAthleteLap[] = orderBy(
      //             this.processGridResult(roundHeat, true),
      //             ["lapTime"],
      //             "asc",
      //           );

      //           Object.keys(BQ).forEach((key: string) => {
      //             const heatNo: number = +key;
      //             const positions: number[] = BQ[heatNo];

      //             const nextRoundHeat = nextRound.round.heats.find(
      //               (heatItem) => heatItem.heatNo === heatNo,
      //             );

      //             positions.forEach((position) => {
      //               if (!heatResult[position - 1]) {
      //                 // this can happen when there are not enough athlete participating
      //                 return false;
      //               }

      //               Array(4)
      //                 .fill(1)
      //                 .forEach((_, index) => {
      //                   scoresPayload.push(
      //                     this.scoresRepository.create({
      //                       eventId,
      //                       roundHeatId: nextRoundHeat.id,
      //                       athleteId: heatResult[position - 1].athleteId,
      //                       roundSeed: position,
      //                       lapNumber: index + 1,
      //                     }),
      //                   );
      //                 });
      //             });
      //           });
      //         });
      //       } else if (NRXRounds.BQ === currentRoundItem.eventRoundNo) {
      //         const roundResult: IRoundResult = await this.fetchRoundResult(
      //           eventId,
      //           roundsMap.find((row) => NRXRounds.BQ === row.eventRoundNo).roundId,
      //           transactionalEntityManager,
      //         );

      //         let bracketRoundtarticipants: IAthleteLap[] = [];
      //         Object.values(roundResult).forEach((participants: IAthleteLap[]) => {
      //           bracketRoundtarticipants.push(...participants);
      //         });
      //         bracketRoundtarticipants = orderBy(bracketRoundtarticipants, ["lapTime"], "asc");

      //         Object.keys(BR1).forEach((key: string) => {
      //           const heatNo: number = +key;
      //           const positions: number[] = BR1[heatNo];

      //           const nextRoundHeat = nextRound.round.heats.find(
      //             (heatItem) => heatItem.heatNo === heatNo,
      //           );

      //           positions.forEach((position) => {
      //             if (!bracketRoundtarticipants[position - 1]) {
      //               // this can happen when there are not enough athlete participating
      //               return false;
      //             }

      //             Array(4)
      //               .fill(1)
      //               .forEach((_, index) => {
      //                 scoresPayload.push(
      //                   this.scoresRepository.create({
      //                     eventId,
      //                     roundHeatId: nextRoundHeat.id,
      //                     athleteId: bracketRoundtarticipants[position - 1].athleteId,
      //                     roundSeed: position,
      //                     lapNumber: index + 1,
      //                   }),
      //                 );
      //               });
      //           });
      //         });
      //       } else if (
      //         [NRXRounds.BR1, NRXRounds.BR2, NRXRounds.BR3].includes(currentRoundItem.eventRoundNo)
      //       ) {
      //         currentRoundHeats.map((roundHeatItem, roundPosition) => {
      //           const heatNo: number = roundHeatItem.heatNo;

      //           const heatResult: IAthleteLap[] = orderBy(
      //             this.processGridResult(roundHeatItem),
      //             ["lapTime"],
      //             "asc",
      //           );

      //           const nextRoundHeat = nextRound.round.heats.find((heat) => {
      //             switch (heatNo) {
      //               case 1:
      //               case 2:
      //                 return heat.heatNo === 1;

      //               case 3:
      //               case 4:
      //                 return heat.heatNo === 2;

      //               case 5:
      //               case 6:
      //                 return heat.heatNo === 3;

      //               case 7:
      //               case 8:
      //                 return heat.heatNo === 4;

      //               default:
      //                 break;
      //             }

      //             return heat.heatNo === heatNo;
      //           });

      //           // for all BRs, each athlete must do 4
      //           Array(4)
      //             .fill(1)
      //             .forEach((_, index) => {
      //               scoresPayload.push(
      //                 this.scoresRepository.create({
      //                   eventId,
      //                   roundHeatId: nextRoundHeat.id,
      //                   athleteId: heatResult[0].athleteId,
      //                   roundSeed: roundPosition + 1,
      //                   lapNumber: index + 1,
      //                 }),
      //               );
      //             });
      //         });
      //       } else if (NRXRounds.BR4 === currentRoundItem.eventRoundNo) {
      //         // fetch all the bracket round results
      //         const bracketRoundIds = roundsMap
      //           .filter((row) =>
      //             [NRXRounds.BR1, NRXRounds.BR2, NRXRounds.BR3, NRXRounds.BR4].includes(
      //               row.eventRoundNo,
      //             ),
      //           )
      //           // order by br4 to br1
      //           .sort((rowA, rowB) => rowB.eventRoundNo - rowA.eventRoundNo)
      //           .map((row) => row.roundId);

      //         // for each round, fetch the heats and generate results
      //         const roundResults: IRoundResult[] = await Promise.all(
      //           bracketRoundIds.map((bracketRoundId) =>
      //             this.fetchRoundResult(eventId, bracketRoundId, transactionalEntityManager),
      //           ),
      //         );

      //         const qualifyingParticipants: IQualifyingParticipants[] = [];

      //         let qualifyingPosition: number = 1;
      //         const qualifyingSeen = new Set();
      //         roundResults.forEach((roundResult) => {
      //           // for each round, loop through the heat
      //           Object.values(roundResult).forEach((participants: IAthleteLap[]) => {
      //             participants.forEach((participant: IAthleteLap) => {
      //               if (!qualifyingSeen.has(participant.athleteId)) {
      //                 qualifyingSeen.add(participant.athleteId);
      //                 qualifyingParticipants.push({
      //                   ...participant,
      //                   seedNo: qualifyingPosition++,
      //                 });
      //               }
      //             });
      //           });
      //         });

      //         Object.keys(ROUND1).forEach((key: string) => {
      //           const heatNo: number = +key;
      //           const positions: number[] = ROUND1[heatNo];

      //           const nextRoundHeat = nextRound.round.heats.find(
      //             (heatItem) => heatItem.heatNo === heatNo,
      //           );

      //           positions.forEach((position) => {
      //             if (!qualifyingParticipants[position - 1]) {
      //               // this can happen when there are not enough athlete participating
      //               return false;
      //             }

      //             // for ROUND1, each athlete must do 4
      //             Array(4)
      //               .fill(1)
      //               .forEach((_, index) => {
      //                 scoresPayload.push(
      //                   this.scoresRepository.create({
      //                     eventId,
      //                     roundHeatId: nextRoundHeat.id,
      //                     athleteId: qualifyingParticipants[position - 1].athleteId,
      //                     roundSeed: position,
      //                     lapNumber: index + 1,
      //                   }),
      //                 );
      //               });
      //           });
      //         });
      //       } else if (NRXRounds.HEAT_ROUND_1 === currentRoundItem.eventRoundNo) {
      //         const round1Results: IRoundResult = {
      //           1: [],
      //           2: [],
      //           3: [],
      //         };

      //         currentRoundHeats.forEach((roundHeat) => {
      //           const heatResult: IAthleteLap[] = orderBy(
      //             this.processGridResult(roundHeat, false),
      //             ["lapTime"],
      //             "asc",
      //           );

      //           round1Results[roundHeat.heatNo] = heatResult;
      //         });

      //         let roundSeed: number = 1;
      //         Object.keys(semiFinalRound).map((key) => {
      //           const heatNo: number = +key;
      //           const values: string[] = semiFinalRound[heatNo];

      //           values.forEach((value) => {
      //             const splitValue = value.split("_");
      //             const roundHeatNo = +splitValue[0];
      //             const position = +splitValue[1];

      //             if (round1Results[roundHeatNo][position - 1]) {
      //               const nextRoundHeat = nextRound.round.heats.find(
      //                 (heatItem) => heatItem.heatNo === heatNo,
      //               );

      //               Array(4)
      //                 .fill(1)
      //                 .forEach((_, index) => {
      //                   scoresPayload.push(
      //                     this.scoresRepository.create({
      //                       eventId,
      //                       roundHeatId: nextRoundHeat.id,
      //                       athleteId: round1Results[roundHeatNo][position - 1].athleteId,
      //                       roundSeed,
      //                       lapNumber: index + 1,
      //                     }),
      //                   );
      //                 });

      //               roundSeed++;
      //             }
      //           });
      //         });
      //       } else if (NRXRounds.SEMIFINALS === currentRoundItem.eventRoundNo) {
      //         // taking the top 2 from each heat and the remaining  goto LCQ

      //         let roundSeed: number = 1;

      //         currentRoundHeats.forEach((roundHeatItem) => {
      //           const heatResult: IAthleteLap[] = orderBy(
      //             this.processGridResult(roundHeatItem),
      //             ["lapTime"],
      //             "asc",
      //           );

      //           const nextRoundHeat = nextRound.round.heats.find(
      //             // (heatItem) => heatItem.heatNo === heatNo,
      //             // LCQ only has a single heat
      //             (heatItem) => heatItem.heatNo === 1,
      //           );

      //           // TODO: incorporate the participant length rule from the sim
      //           heatResult.slice(2, heatResult.length).forEach((row) => {
      //             Array(4)
      //               .fill(1)
      //               .forEach((_, index) => {
      //                 scoresPayload.push(
      //                   this.scoresRepository.create({
      //                     eventId,
      //                     roundHeatId: nextRoundHeat.id,
      //                     athleteId: row.athleteId,
      //                     roundSeed,
      //                     lapNumber: index + 1,
      //                   }),
      //                 );
      //               });

      //             roundSeed++;
      //           });
      //         });
      //       } else if (NRXRounds.LCQ === currentRoundItem.eventRoundNo) {
      //         const nextRoundHeat = nextRound.round.heats.find((heatItem) => heatItem.heatNo === 1);

      //         const round1Result: IRoundResult = await this.fetchRoundResult(
      //           eventId,
      //           roundsMap.find((round) => [NRXRounds.HEAT_ROUND_1].includes(round.eventRoundNo))
      //             .roundId,
      //           transactionalEntityManager,
      //         );
      //         const semifinalResult: IRoundResult = await this.fetchRoundResult(
      //           eventId,
      //           roundsMap.find((round) => [NRXRounds.SEMIFINALS].includes(round.eventRoundNo)).roundId,
      //           transactionalEntityManager,
      //         );
      //         const lcqResult: IRoundResult = await this.fetchRoundResult(
      //           eventId,
      //           roundsMap.find((round) => [NRXRounds.LCQ].includes(round.eventRoundNo)).roundId,
      //           transactionalEntityManager,
      //         );

      //         let position = 1;

      //         Object.values(round1Result).forEach((rows: IAthleteLap[]) => {
      //           const winner = orderBy(rows, ["lapTime"], "asc")?.[0];
      //           if (winner)
      //             Array(6)
      //               .fill(1)
      //               .forEach((_, index) => {
      //                 scoresPayload.push(
      //                   this.scoresRepository.create({
      //                     eventId,
      //                     roundHeatId: nextRoundHeat.id,
      //                     athleteId: winner.athleteId,
      //                     roundSeed: position,
      //                     lapNumber: index + 1,
      //                   }),
      //                 );
      //               });

      //           position++;
      //         });

      //         Object.values(semifinalResult).forEach((rows: IAthleteLap[]) => {
      //           const winner = orderBy(rows, ["lapTime"], "asc")?.[0];
      //           const second = orderBy(rows, ["lapTime"], "asc")?.[1];
      //           if (winner)
      //             Array(6)
      //               .fill(1)
      //               .forEach((_, index) => {
      //                 scoresPayload.push(
      //                   this.scoresRepository.create({
      //                     eventId,
      //                     roundHeatId: nextRoundHeat.id,
      //                     athleteId: winner.athleteId,
      //                     roundSeed: position,
      //                     lapNumber: index + 1,
      //                   }),
      //                 );
      //               });
      //           position++;
      //           if (second)
      //             Array(6)
      //               .fill(1)
      //               .forEach((_, index) => {
      //                 scoresPayload.push(
      //                   this.scoresRepository.create({
      //                     eventId,
      //                     roundHeatId: nextRoundHeat.id,
      //                     athleteId: second.athleteId,
      //                     roundSeed: position,
      //                     lapNumber: index + 1,
      //                   }),
      //                 );
      //               });
      //           position++;
      //         });

      //         Object.values(lcqResult).forEach((rows: IAthleteLap[]) => {
      //           const winner = orderBy(rows, ["lapTime"], "asc")?.[0];
      //           if (winner)
      //             Array(6)
      //               .fill(1)
      //               .forEach((_, index) => {
      //                 scoresPayload.push(
      //                   this.scoresRepository.create({
      //                     eventId,
      //                     roundHeatId: nextRoundHeat.id,
      //                     athleteId: winner.athleteId,
      //                     roundSeed: position,
      //                     lapNumber: index + 1,
      //                   }),
      //                 );
      //               });
      //           position++;
      //         });
      //       }

      //     if (scoresPayload.length) await transactionalEntityManager.save(scoresPayload);

      //     // loop through the scores payload to check the heats and see if there are athletes
      //     // in the same heat since that would imply competition, every other heat should be marked as completed
      //     // also it could be that all heats are marked as completed in which case the athletes
      //     // need to go to the next heat
      //     // this is also specific to certain rounds since some rounds are not battle based

      //     // due to the nature of nrx, there is more than one row for an athlete
      //     // but to check if there is a battle this causes an issue so loop through and remove duplicates
      //     // duplicates here are row with the same athlete and same round but different laps
      //     const scoredCleanedPayload: Scores[] = [];
      //     const seenScoresAthletes = new Set();
      //     scoresPayload.forEach((score) => {
      //       if (!seenScoresAthletes.has(score.athleteId)) {
      //         scoredCleanedPayload.push(score);
      //         seenScoresAthletes.add(score.athleteId);
      //       }
      //     });
      //     const heatGroups: IHeatScoreHolder = groupBy(scoredCleanedPayload, "roundHeatId");

      //     // TODO: for heats and rounds that are not applicable at all add a flag so the FE can disable it
      //     const liveHeats: string[] = [];
      //     let hasBattle: boolean = false;
      //     Object.keys(heatGroups).map((heatId) => {
      //       const values = heatGroups[heatId];
      //       if (values.length > 1) {
      //         liveHeats.push(heatId);
      //         hasBattle = true;
      //       }
      //     });

      //     if (liveHeats.length) {
      //       // mark heats with battles as live
      //       await Promise.all([
      //         // transactionalEntityManager.update(
      //         //   RoundHeats,
      //         //   {
      //         //     id: In(liveHeats),
      //         //     eventId,
      //         //   },
      //         //   {
      //         //     heatStatus: HeatStatus.LIVE,
      //         //   },
      //         // ),
      //         // mark non combatant heats as completed
      //         transactionalEntityManager.update(
      //           RoundHeats,
      //           {
      //             id: Not(In(liveHeats)),
      //             roundId: nextRound.roundId,
      //             eventId,
      //           },
      //           {
      //             heatStatus: HeatStatus.COMPLETED,
      //             endDate: new Date().toISOString(),
      //             isHeatWinnerMarketOpen: false,
      //           },
      //         ),
      //       ]);
      //     }

      //     // mark all the heats of the current round as complete
      //     await transactionalEntityManager.update(
      //       RoundHeats,
      //       {
      //         // id: In(currentRoundHeats.map((item) => item.id)),
      //         roundId: currentRoundHeat.roundId,
      //         eventId,
      //       },
      //       {
      //         isHeatWinnerMarketOpen: false,
      //         heatStatus: HeatStatus.COMPLETED,
      //         endDate: new Date().toISOString(),
      //       },
      //     );

      //     if (!hasBattle && nextRound) {
      //       // recursive call to now auto advance the round

      //       // find the max heat of the next round so the recursive call can be triggered
      //       // this way it would simulate a trader calling the api on the last heat of the next round

      //       // get the first live heat of the next round rather than just the first heat of the next ronud
      //       // const nextRoundHeat = nextRound.round.heats.sort(
      //       //   (heat1, heat2) => heat2.heatNo - heat1.heatNo,
      //       // )[0];
      //       const nextRoundHeat = await transactionalEntityManager.findOne(RoundHeats, {
      //         where: {
      //           eventId,
      //           roundId: nextRound.roundId,
      //           // heatStatus: HeatStatus.LIVE,
      //         },
      //         order: {
      //           heatNo: "ASC",
      //         },
      //         select: {
      //           id: true,
      //           roundId: true,
      //           heatNo: true,
      //           eventId: true,
      //         },
      //       });

      //       await this.handleSaveMensLiveScore(
      //         nextRoundHeat,
      //         eventId,
      //         transactionalEntityManager,
      //         true,
      //       );
      //     }

      // return !hasInProgressHeat;
      return true;
    } catch (error) {
      throw error;
    }
  }

  // for dev only
  async resetEvent(eventId: string) {
    // fetch the event, the rounds and the heats

    const result = await this.eventsRepository.manager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        const event = await transactionalEntityManager.findOne(Events, {
          where: {
            id: eventId,
          },
          select: {
            id: true,
          },
        });
        if (!event) throw eventExceptions.eventNotFound();

        await Promise.all([
          transactionalEntityManager.update(
            RoundHeats,
            {
              eventId,
            },
            {
              heatStatus: HeatStatus.UPCOMING,
              isHeatWinnerMarketOpen: true,
              isHeatWinnerMarketVoided: false,
              winnerAthleteId: null,
              startDate: null,
              endDate: null,
            },
          ),
          // mark all other round heats as upcoming
          transactionalEntityManager.update(
            EventRounds,
            {
              eventId,
            },
            {
              roundStatus: RoundStatus.UPCOMING,
              startDate: null,
              endDate: null,
            },
          ),
          transactionalEntityManager.update(
            Events,
            {
              id: eventId,
            },
            {
              eventStatus: EventStatus.UPCOMING,
              isEventWinnerMarketOpen: true,
              winnerAthleteId: null,
            },
          ),
          transactionalEntityManager.delete(Scores, {
            eventId,
          }),
          transactionalEntityManager.delete(ProjectionEventHeatOutcome, {
            eventId,
          }),
          transactionalEntityManager.delete(ProjectionEventOutcome, {
            eventId,
          }),
          transactionalEntityManager.delete(PropBets, {
            eventId,
          }),
          transactionalEntityManager.delete(PlayerHeadToHeads, {
            eventId,
          }),
          transactionalEntityManager.delete(ProjectionEventPodiums, {
            eventId,
          }),
          transactionalEntityManager.delete(ProjectionEventShows, {
            eventId,
          }),

          transactionalEntityManager.delete(ClientProjectionEventHeatOutcome, {
            eventId,
          }),
          transactionalEntityManager.delete(ClientProjectionEventOutcome, {
            eventId,
          }),
          transactionalEntityManager.delete(ClientPropBets, {
            eventId,
          }),
          transactionalEntityManager.delete(ClientPlayerHeadToHeads, {
            eventId,
          }),
          transactionalEntityManager.delete(ClientProjectionEventPodiums, {
            eventId,
          }),
          transactionalEntityManager.delete(ClientProjectionEventShows, {
            eventId,
          }),
        ]);

        await transactionalEntityManager.delete(EventParticipants, {
          eventId,
        });

        return true;
      },
    );

    return result;
  }

  // private async fetchRoundResult(
  //   eventId: string,
  //   roundId: string,
  //   transactionalEntityManager: EntityManager,
  // ): Promise<IRoundResult> {
  //   try {
  //     const heats = await transactionalEntityManager.find(RoundHeats, {
  //       where: {
  //         eventId,
  //         roundId,
  //         scores: {
  //           eventId,
  //         },
  //       },
  //       select: {
  //         id: true,
  //         heatNo: true,
  //         scores: {
  //           lapTime: true,
  //           athleteId: true,
  //           eventId: true,
  //         },
  //       },
  //       relations: ["scores"],
  //     });

  //     const bracketRoundResult: IRoundResult = {};

  //     heats.forEach((heat) => {
  //       bracketRoundResult[heat.heatNo] = this.processGridResult(heat);
  //     });

  //     return bracketRoundResult;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  private async generateRoundMap(
    eventId: string,
    transactionalEntityManager: EntityManager,
  ): Promise<IRoundStateMap[]> {
    try {
      const eventRounds = await transactionalEntityManager.find(EventRounds, {
        where: {
          eventId,
          round: {
            // intentionally skipping this one out
            name: Not(In(["Free Practice 1", "Free Practice 2"])),
          },
        },
        relations: ["round"],
        order: {
          round: {
            roundNo: "ASC",
          },
        },
        select: {
          id: true,
          eventId: true,
          roundStatus: true,
          round: {
            id: true,
            name: true,
            roundNo: true,
          },
        },
      });

      // ignore the actual round number and consider the custom index as source of truth
      // using existing data initialize the object with the status

      const roundConfig: {
        [key: number]: IRoundStateMap;
      } = {
        [NRXRounds.TP]: null,
        [NRXRounds.QA]: null,
        [NRXRounds.BR]: null,
        // [NRXRounds.BF]: null,
        // [NRXRounds.PR]: null,
        [NRXRounds.HEAT_ROUND]: null,
        [NRXRounds.LCQ]: null,
        [NRXRounds.FINALS]: null,
      };

      eventRounds.forEach((eventRound, index) => {
        roundConfig[index + 1] = {
          eventRoundId: eventRound.id,
          roundId: eventRound.round.id,
          name: eventRound.round.name,
          roundNo: +eventRound.round.roundNo,
          status: +eventRound.roundStatus,
          eventRoundNo: index + 1,
        };
      });

      const roundsMap: IRoundStateMap[] = Object.keys(roundConfig).map(
        (key): IRoundStateMap => roundConfig[+key],
      );

      return roundsMap;
    } catch (error) {
      throw error;
    }
  }

  // private processGridResult(heat: RoundHeats, isPractice: boolean = false): IAthleteLap[] {
  //   const athleteData: IAthleteLapHolder = groupBy(heat.scores, "athleteId");

  //   let athleteLaps: IAthleteLap[] = [];
  //   // eslint-disable-next-line unicorn/prefer-ternary
  //   if (isPractice) {
  //     // in this case, for each driver, the best lap is taken as opposed to the total time
  //     // so get the best lap for each driver and return that

  //     athleteLaps = Object.keys(athleteData).map((athleteId) => {
  //       const lapData: Scores[] = athleteData[athleteId];

  //       const orderedLapTimes = orderBy(
  //         lapData
  //           .filter((row) => !row.isBye && row.lapTime > 0)
  //           .map((row) => ({
  //             ...row,
  //             lapTime: +row.lapTime,
  //           })),
  //         ["lapTime"],
  //         "asc",
  //       );

  //       const fastestLap: Scores = orderedLapTimes[0];

  //       const lap: IAthleteLap = {
  //         athleteId,
  //         lapTime: +fastestLap.lapTime,
  //       };

  //       return lap;
  //     });
  //   } else {
  //     athleteLaps = Object.keys(athleteData).map((athleteId) => {
  //       const lapData: Scores[] = athleteData[athleteId];

  //       const totalLapTime: number = lapData
  //         .filter((lapItem) => lapItem.lapTime > 0 && !lapItem.isBye)
  //         .reduce((total, lapItem) => total + +lapItem.lapTime, 0);

  //       const lap: IAthleteLap = {
  //         athleteId,
  //         lapTime: totalLapTime,
  //       };

  //       return lap;
  //     });
  //   }

  //   return athleteLaps;
  // }
}

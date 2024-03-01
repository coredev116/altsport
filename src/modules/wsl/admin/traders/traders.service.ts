import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository, In, Not } from "typeorm";
import orderBy from "lodash.orderby";
import groupBy from "lodash.groupby";
import { getYear, isAfter } from "date-fns";

import Events from "../../../../entities/wsl/events.entity";
import Tours from "../../../../entities/wsl/tours.entity";
// import Rounds from "../../../../entities/wsl/rounds.entity";
import RoundHeats from "../../../../entities/wsl/roundHeats.entity";
import Athletes from "../../../../entities/wsl/athletes.entity";
import Scores from "../../../../entities/wsl/scores.entity";
import EventParticipants from "../../../../entities/wsl/eventParticipants.entity";
import EventRounds from "../../../../entities/wsl/eventRounds.entity";
import ProjectionEventHeatOutcome from "../../../../entities/wsl/projectionEventHeatOutcome.entity";
import ProjectionEventOutcome from "../../../../entities/wsl/projectionEventOutcome.entity";
import PropBets from "../../../../entities/wsl/propBets.entity";
import PlayerHeadToHeads from "../../../../entities/wsl/playerHeadToHeads.entity";
import ProjectionEventPodiums from "../../../../entities/wsl/projectionEventPodiums.entity";
import ProjectionEventShows from "../../../../entities/wsl/projectionEventShows.entity";

import ClientProjectionEventOutcome from "../../../../entities/wsl/clientProjectionEventOutcome.entity";
import ClientProjectionEventHeatOutcome from "../../../../entities/wsl/clientProjectionEventHeatOutcome.entity";
import ClientPropBets from "../../../../entities/wsl/clientPropBets.entity";
import ClientPlayerHeadToHeads from "../../../../entities/wsl/clientPlayerHeadToHeads.entity";
import ClientProjectionEventPodiums from "../../../../entities/wsl/clientProjectionEventPodiums.entity";
import ClientProjectionEventShows from "../../../../entities/wsl/clientProjectionEventShows.entity";

import TraderScores from "./dto/traderScores.dto";
import TraderLiveScoresDto from "./dto/traderLiveScores.dto";
import EventSeedDto from "./dto/eventSeed.dto";
import EventSeedPreviewDto from "./dto/eventSeedPreview.dto";

import SeedResponse from "./schemas/responses/seed.response";
import EventParticipantResponse from "./schemas/responses/eventParticipant.response";

import * as eventExceptions from "../../../../exceptions/events";
import * as heatExceptions from "../../../../exceptions/heats";
import * as eventRoundExceptions from "../../../../exceptions/eventRound";

import { IParticipantReplacement } from "../../../../interfaces/participants";
import { IAthlete, IRoundKey, RoundState } from "../../../../interfaces/wsl";

import {
  RoundsMen,
  RoundsWomen,
  postCutDate,
  fetchOpeningRoundSeedPlacements,
} from "../../../../constants/wsl";

import QueueService from "../../../system/queue/queue.service";
import WslService from "../../../../services/wsl.service";
import WslSyncHelperService from "../../../system/sync/wsl/sync.wsl.helpers.service";

import {
  AthleteStatus,
  SportsTypes,
  HeatStatus,
  RoundStatus,
  EventStatus,
  Gender,
  OddMarkets,
  SportsDbSchema,
} from "../../../../constants/system";

@Injectable()
export default class TradersService {
  constructor(
    @InjectRepository(Tours) private readonly toursRepository: Repository<Tours>,
    @InjectRepository(Events) private readonly eventsRepository: Repository<Events>,
    // @InjectRepository(Rounds) private readonly roundsRepository: Repository<Rounds>,
    @InjectRepository(RoundHeats) private readonly heatsRepository: Repository<RoundHeats>,
    @InjectRepository(Athletes) private readonly athletesRepository: Repository<Athletes>,
    @InjectRepository(Scores) private readonly scoresRepository: Repository<Scores>,
    @InjectRepository(EventRounds) private readonly eventRoundRepository: Repository<EventRounds>,
    @InjectRepository(EventParticipants)
    private readonly eventParticipantsRepository: Repository<EventParticipants>,
    @InjectRepository(ProjectionEventOutcome)
    private readonly projectionEventOutcomeRepository: Repository<ProjectionEventOutcome>,
    private queueService: QueueService,
    private readonly wslService: WslService,
    private readonly wslSyncHelperService: WslSyncHelperService,
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
              INSERT INTO ${SportsDbSchema.WSL}."clientProjectionEventOutcome"("eventId", "eventParticipantId", "position", "odds", "probability", "trueProbability", "hasModifiedProbability")
              SELECT "eventId", "eventParticipantId", "position", "odds", "probability", "trueProbability", "hasModifiedProbability" FROM ${SportsDbSchema.WSL}."projectionEventOutcome"
              WHERE ${SportsDbSchema.WSL}."projectionEventOutcome"."eventId" = '${eventId}' AND ${SportsDbSchema.WSL}."projectionEventOutcome"."position" = 1;
            `);

            break;

          case OddMarkets.EVENT_SECOND_PLACE_PROJECTIONS:
            const projectionEventSecondOutcomeData = await transactionalEntityManager.findOne(
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
            if (!projectionEventSecondOutcomeData) return;

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
              INSERT INTO ${SportsDbSchema.WSL}."clientProjectionEventOutcome"("eventId", "eventParticipantId", "position", "odds", "probability", "trueProbability", "hasModifiedProbability")
              SELECT "eventId", "eventParticipantId", "position", "odds", "probability", "trueProbability", "hasModifiedProbability" FROM ${SportsDbSchema.WSL}."projectionEventOutcome"
              WHERE ${SportsDbSchema.WSL}."projectionEventOutcome"."eventId" = '${eventId}' AND ${SportsDbSchema.WSL}."projectionEventOutcome"."position" = 2;
            `);
            break;

          case OddMarkets.HEAT_PROJECTIONS:
            if (roundId) {
              // assumption here is that the heats have been published
              // admin is trying to notify the client
              // await this.queueService.notifyMarketPublishNotification({
              //   eventId,
              //   sportType: SportsTypes.SURFING,
              //   market: projectionType,
              // });
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
              INSERT INTO ${SportsDbSchema.WSL}."clientProjectionEventHeatOutcome"("eventId", "eventParticipantId", "roundHeatId", "position", "odds", "probability", "trueProbability", "hasModifiedProbability")
              SELECT "eventId", "eventParticipantId", "roundHeatId", "position", "odds", "probability", "trueProbability", "hasModifiedProbability" FROM ${SportsDbSchema.WSL}."projectionEventHeatOutcome"
              WHERE ${SportsDbSchema.WSL}."projectionEventHeatOutcome"."eventId" = '${eventId}' AND ${SportsDbSchema.WSL}."projectionEventHeatOutcome"."roundHeatId" = '${roundHeatId}';
            `);
            }

            await this.queueService.notifyMarketPublishNotification({
              eventId,
              roundHeatId,
              sportType: SportsTypes.SURFING,
              market: projectionType,
            });

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
              INSERT INTO ${SportsDbSchema.WSL}."clientPropBets"("eventId", "betId", "eventParticipantId", "proposition", "odds", "payout", "voided")
              SELECT "eventId", "betId", "eventParticipantId", "proposition", "odds", "payout", "voided" FROM ${SportsDbSchema.WSL}."propBets"
              WHERE ${SportsDbSchema.WSL}."propBets"."eventId" = '${eventId}';
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
              INSERT INTO ${SportsDbSchema.WSL}."clientPlayerHeadToHeads"("eventId", "eventParticipant1Id", "eventParticipant2Id", "eventParticipantWinnerId", "player1Position", "player2Position", "player1Odds", "player2Odds", "player1Probability", "player2Probability", "player1TrueProbability", "player2TrueProbability", "player1HasModifiedProbability", "player2HasModifiedProbability", "voided", "draw", "holdingPercentage")
              SELECT "eventId", "eventParticipant1Id", "eventParticipant2Id", "eventParticipantWinnerId", "player1Position", "player2Position", "player1Odds", "player2Odds", "player1Probability", "player2Probability", "player1TrueProbability", "player2TrueProbability", "player1HasModifiedProbability", "player2HasModifiedProbability", "voided", "draw", "holdingPercentage" FROM ${SportsDbSchema.WSL}."playerHeadToHeads"
              WHERE ${SportsDbSchema.WSL}."playerHeadToHeads"."eventId" = '${eventId}' AND ${SportsDbSchema.WSL}."playerHeadToHeads"."eventId" = '${eventId}';
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
                INSERT INTO ${SportsDbSchema.WSL}."clientProjectionEventPodiums"("eventId", "eventParticipantId", "odds", "probability", "trueProbability", "hasModifiedProbability")
                SELECT "eventId", "eventParticipantId", "odds", "probability", "trueProbability", "hasModifiedProbability" FROM ${SportsDbSchema.WSL}."projectionEventPodiums"
                WHERE ${SportsDbSchema.WSL}."projectionEventPodiums"."eventId" = '${eventId}';
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
                INSERT INTO ${SportsDbSchema.WSL}."clientProjectionEventShows"("eventId", "eventParticipantId", "odds", "probability", "trueProbability", "hasModifiedProbability")
                SELECT "eventId", "eventParticipantId", "odds", "probability", "trueProbability", "hasModifiedProbability" FROM ${SportsDbSchema.WSL}."projectionEventShows"
                WHERE ${SportsDbSchema.WSL}."projectionEventShows"."eventId" = '${eventId}';
              `);
            break;

          default:
            break;
        }

        if (projectionType !== OddMarkets.HEAT_PROJECTIONS)
          await this.queueService.notifyMarketPublishNotification({
            eventId,
            sportType: SportsTypes.SURFING,
            market: projectionType,
          });
      },
    );

    return true;
  }

  async saveScores(scoresPayload: TraderScores): Promise<boolean> {
    // const CAHCE_TIME = 5_000;
    // const limit = pLimit(20);

    // const eventParticipantsObj: {
    //   [athleteId: string]: EventParticipants;
    // } = {};

    // const promises = scoresPayload.items.map((score) =>
    //   limit(async () => {

    await this.scoresRepository.manager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        for await (const score of scoresPayload.items) {
          try {
            const tour = await this.toursRepository.findOne({
              where: {
                name: score.tourName,
                gender: score.gender,
              },
              select: ["id", "gender"],
              relations: ["years"],
              // cache: {
              //   id: `${score.tourName}_${score.gender}`,
              //   milliseconds: CAHCE_TIME,
              // },
            });
            if (!tour) continue;
            // throw tourExceptions.tourNotFound({
            //   name: score.tourName,
            //   score,
            // });

            const year = tour.years.find((tourYear) => tourYear.year === score.year);
            const event = await this.eventsRepository.findOne({
              where: {
                name: score.eventName,
                tourYearId: year.id,
              },
              select: ["id"],
              // cache: {
              //   id: `${score.eventName}_${year.id}`,
              //   milliseconds: CAHCE_TIME,
              // },
            });
            if (!event) continue;
            // throw eventExceptions.eventNotFound({
            //   eventName: score.eventName,
            //   score,
            // });

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

            // const round = await this.roundsRepository.findOne({
            //   where: {
            //     name: score.roundName,
            //   },
            //   select: ["id"],
            // });
            if (!round) continue;
            // throw roundExceptions.roundNotFound({
            //   roundName: score.roundName,
            //   score,
            // });

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
              // cache: {
              //   id: `${event.id}_${round.id}`,
              //   milliseconds: CAHCE_TIME,
              // },
            });
            if (!roundHeat) continue;
            // throw heatExceptions.heatNotFound({
            //   event: event.name,
            //   round: round.name,
            //   score,
            // });

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
              // eventParticipantsObj[athlete.id] = this.eventParticipantsRepository.create({
              //   athleteId: athlete.id,
              //   eventId: event.id,
              //   seedNo: 0,
              //   baseProjection: 0,
              // });
              eventParticipant = await transactionalEntityManager.save(
                this.eventParticipantsRepository.create({
                  athleteId: athlete.id,
                  eventId: event.id,
                  seedNo: 0,
                  baseProjection: 0,
                  status: score.playerStatus,
                }),
              );
            }

            const existingScore = await transactionalEntityManager.findOne(Scores, {
              where: {
                athleteId: athlete.id,
                eventId: event.id,
                roundHeatId: roundHeat.id,
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
                  heatScore: score.heatScore,
                  notes: score.notes,
                  // FIXME: need to figure out how to handle heat position here
                },
              );
            } else {
              await transactionalEntityManager.save(
                this.scoresRepository.create({
                  athleteId: athlete.id,
                  eventId: event.id,
                  roundHeatId: roundHeat.id,
                  heatScore: score.heatScore,
                  roundSeed: eventParticipant?.seedNo || 0,
                  notes: score.notes,
                }),
              );
            }
          } catch (error) {
            throw error;
          }
        }
      },
    );
    //   }),
    // );

    // await Promise.all(promises);

    // if (Object.keys(eventParticipantsObj).length)
    //   await this.eventParticipantsRepository.save(Object.values(eventParticipantsObj));

    return true;
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
          roundSeed: true,
          heatScore: true,
          heatPosition: true,
          athlete: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
            nationality: true,
            stance: true,
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

  async seed(externalEventId: number): Promise<SeedResponse[]> {
    const { events, athletes } = await this.wslService.fetchEventDetails(`${externalEventId}`);

    //FIXME: deprecate
    const tierArr = [];
    const data = events[externalEventId].athleteIds.map((athleteId) => {
      const athlete = athletes[athleteId];
      let count = 1;
      const tierIndex = tierArr.findIndex(
        (t) => t.name === athlete.eventStats[externalEventId].tier,
      );
      if (tierIndex === -1) {
        tierArr.push({ name: athlete.eventStats[externalEventId].tier, count: 1 });
      } else {
        count = tierArr[tierIndex].count + 1;
        tierArr[tierIndex].count = count;
      }

      return {
        athlete: `${athlete.firstName} ${athlete.lastName}`,
        stance: athlete.stance,
        nationality: athlete.nationAbbr,
        gender: athlete.gender === "M" ? "men" : "women",
        seed_number: athlete.eventStats[externalEventId].seed,
        base_projection: "",
        base_run_score: "",
        base_trick_score: "",
        trick_completion: "",
        event: events[externalEventId].name,
        tour_year: events[externalEventId].year,
        status: athlete.eventStats[externalEventId].status || "Active",
        tier: athlete.eventStats[externalEventId].tier,
        tier_seed: count,
        notes: "",
      };
    });

    return data;
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
          roundSeed: true,
          heatScore: true,
          heatPosition: true,
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

  async fetchEventParticipant(
    eventId: string,
    includeArchived = false,
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
        tier: true,
        tierSeed: true,
        baseProjection: true,
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
              heatStatus: true,
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

          // const currentRoundNo = roundHeat.round.roundNo;

          if (roundHeat.heatStatus === HeatStatus.UPCOMING && payload.hasHeatEnded)
            throw heatExceptions.markHeatLiveBeforeEndingError;

          if (roundHeat.heatStatus === HeatStatus.COMPLETED && payload.hasHeatEnded)
            throw heatExceptions.heatAlreadyEnded;

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
                  heatScore: item.heatScore,
                  heatPosition: item.heatPosition,
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
            await transactionalEntityManager.upsert(Scores, scoresSavePayload, {
              conflictPaths: ["eventId", "roundHeatId", "athleteId"],
            });

          if (payload.athletes?.length > 0 && payload.heatStatus === HeatStatus.LIVE) {
            // at the same time, mark the current event as live and the current heat and round as live
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
            // close market for the current heat
            await transactionalEntityManager.update(
              RoundHeats,
              { id: heatId },
              {
                winnerAthleteId: heatWinner?.athleteId,
                isHeatWinnerMarketOpen: false,
                heatStatus: HeatStatus.COMPLETED,
                endDate: payload.endDate || new Date().toISOString(),
              },
            );

            // check to see if this is a womans event, if so then call the helper
            const event = await this.eventsRepository.findOne({
              where: {
                id: eventId,
              },
              relations: ["tourYear.tour"],
              select: {
                id: true,
                startDate: true,
                tourYear: {
                  tourId: true,
                  tour: {
                    gender: true,
                  },
                },
              },
            });

            const isPostCut: boolean = isAfter(
              event.startDate,
              postCutDate(getYear(event.startDate)),
            );

            let shouldRunSim: boolean = false;

            // eslint-disable-next-line unicorn/prefer-ternary
            if (event.tourYear.tour.gender === Gender.FEMALE) {
              shouldRunSim = await this.handleSaveWomensLiveScore(
                isPostCut,
                heatWinner?.athleteId,
                roundHeat,
                eventId,
                transactionalEntityManager,
              );
            } else {
              // mens
              shouldRunSim = await this.handleSaveMensLiveScore(
                isPostCut,
                heatWinner?.athleteId,
                roundHeat,
                eventId,
                transactionalEntityManager,
              );
            }
            // eslint-disable-next-line no-console
            console.log("🚀 ~ file: traders.service.ts:880 ~ shouldRunSim", shouldRunSim);

            // if (payload.hasHeatEnded && shouldRunSim)
            //   await this.queueService.notifyEventUpdate({
            //     eventId,
            //     delaySeconds: 10,
            //     sportType: SportsTypes.SURFING,
            //   });
          }

          return true;
        } catch (error) {
          throw error;
        }
      },
    );

    return result;
  }

  async saveEventSeed(payload: EventSeedDto) {
    await this.eventParticipantsRepository.manager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        try {
          // enable when finals
          const IS_FINALS: boolean = true;
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
                    startDate: true,
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
              status: AthleteStatus.INACTIVE,
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

              // const event = events.find((eventItem) => eventItem.tourYear.year === item.tourYear);
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
              // affectedEventIds.push(event.id);

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
                    tier: item.tier,
                    tierSeed: item.tierSeed,
                    baseProjection: item.baseProjection,
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
                  tier: item.tier,
                  tierSeed: item.tierSeed,
                  baseProjection: item.baseProjection,
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

          // const affectedEvents = [...new Set(affectedEventIds)];

          if (!IS_FINALS) {
            try {
              // delete existing seeds for the event and replace with the new ones
              // also delete the odds
              // if (eventParticipantsDeleteIds.length)
              //   await transactionalEntityManager.update(
              //     EventParticipants,
              //     {
              //       id: In(eventParticipantsDeleteIds),
              //     },
              //     {
              //       isActive: false,
              //       isArchived: true,
              //     },
              //   );

              if (insertPayload.length) await transactionalEntityManager.save(insertPayload);

              const scoresPayload = [];
              for await (const event of events) {
                try {
                  const eventScores = await transactionalEntityManager.count(Scores, {
                    where: {
                      eventId: event.id,
                    },
                    select: {
                      isActive: true,
                    },
                  });

                  const isPostCut: boolean = isAfter(
                    event.startDate,
                    postCutDate(getYear(event.startDate)),
                  );

                  const openingRound: {
                    [key: number]: number[];
                  } = fetchOpeningRoundSeedPlacements(
                    isPostCut,
                    event.tourYear.tour.gender as Gender,
                  );

                  /* if (!isPostCut) {
                  openingRound =
                    event.tourYear.tour.gender === Gender.MALE
                      ? {
                          1: [6, 19, 31],
                          2: [5, 20, 32],
                          3: [4, 21, 33],
                          4: [3, 22, 34],
                          5: [2, 23, 35],
                          6: [1, 24, 36],
                          7: [7, 18, 30],
                          8: [8, 17, 29],
                          9: [9, 16, 28],
                          10: [10, 15, 27],
                          11: [11, 14, 26],
                          12: [12, 13, 25],
                          // 1: [11, 14, 26],
                          // 2: [9, 16, 28],
                          // 3: [7, 18, 30],
                          // 4: [5, 20, 32],
                          // 5: [3, 22, 35],
                          // 6: [1, 24, 36],
                          // 7: [2, 23, 34],
                          // 8: [4, 21, 33],
                          // 9: [6, 19, 31],
                          // 10: [8, 17, 29],
                          // 11: [10, 15, 27],
                          // 12: [12, 13, 25],
                        }
                      : {
                          1: [3, 10, 16],
                          2: [2, 11, 17],
                          3: [1, 12, 18],
                          4: [4, 9, 15],
                          5: [5, 8, 14],
                          6: [6, 7, 13],
                          // 1: [3, 10, 16],
                          // 2: [2, 11, 17],
                          // 3: [1, 12, 18],
                          // 4: [4, 9, 15],
                          // 5: [5, 8, 14],
                          // 6: [6, 7, 13],
                        };
                } else {
                  openingRound =
                    event.tourYear.tour.gender === Gender.MALE
                      ? {
                          1: [4, 13, 21],
                          2: [3, 14, 22],
                          3: [2, 15, 23],
                          4: [1, 16, 24],
                          5: [5, 12, 20],
                          6: [6, 11, 19],
                          7: [7, 10, 18],
                          8: [8, 9, 17],
                        }
                      : {
                          1: [4, 5, 9],
                          2: [1, 8, 12],
                          3: [2, 7, 11],
                          4: [3, 6, 10],
                        };
                } */

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
                      continue;
                    } else {
                      // clearing all scores for the event so the data can be reinserted
                      await transactionalEntityManager.delete(Scores, {
                        eventId: event.id,
                        roundHeatId: In(heats.map((heat) => heat.id)),
                      });
                    }
                  }

                  // there are no heats, which means that the event seed needs to be inserted into round 1 for all heats
                  // since this is WSL

                  const eventParticipants = await transactionalEntityManager.find(
                    EventParticipants,
                    {
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
                    },
                  );

                  const scorePayload: Scores[] = [];
                  Object.keys(openingRound).forEach((key) => {
                    const heat = heats.find((heatItem) => heatItem.heatNo === +key);
                    const seeds: number[] = openingRound[key];

                    const participants = eventParticipants.filter((participant) =>
                      seeds.includes(participant.seedNo),
                    );

                    scorePayload.push(
                      ...participants.map((eventParticipant) =>
                        this.scoresRepository.create({
                          eventId: event.id,
                          roundHeatId: heat.id,
                          athleteId: eventParticipant.athleteId,
                          roundSeed: eventParticipant.seedNo,
                          heatScore: 0,
                        }),
                      ),
                    );
                  });

                  scoresPayload.push(scorePayload);
                } catch (error) {
                  throw error;
                }
              }

              const flattenedPayload = scoresPayload.flat();
              if (flattenedPayload.length) await transactionalEntityManager.save(flattenedPayload);
            } catch (error) {
              throw error;
            }
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

          // if (events.length)
          //   await Promise.all(
          //     events.map((event) =>
          //       this.queueService.notifyEventUpdate({
          //         eventId: event.id,
          //         delaySeconds: 10,
          //         sportType: SportsTypes.SURFING,
          //       }),
          //     ),
          //   );

          return true;
        } catch (transactionError) {
          throw transactionError;
        }
      },
    );

    return true;
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
        ]);

        await transactionalEntityManager.delete(EventParticipants, {
          eventId,
        });

        return true;
      },
    );

    return result;
  }

  private async handleSaveWomensLiveScore(
    isPostCut: boolean,
    heatWinnerId: string,
    currentRoundHeat: RoundHeats,
    eventId: string,
    transactionalEntityManager: EntityManager,
  ): Promise<boolean> {
    try {
      // assuming here that it is post cut so not checking anything else

      // fetch the event rounds and sort ascending to know the rounds for the event
      const eventRounds = await this.eventRoundRepository.find({
        where: {
          eventId,
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

      // const enum Rounds {
      //   OPENING_ROUND = 1,
      //   ELIMINATION_ROUND = 2,
      //   QUARTERFINALS = 3,
      //   SEMIFINALS = 4,
      //   FINALS = 5,
      // }

      // type RoundState = {
      //   eventRoundId: string;
      //   roundId: string;
      //   name: string;
      //   roundNo: number;
      //   status: number;
      //   eventRoundNo: Rounds; // this is the number that should be used for checks
      // };

      const roundConfig: {
        [key: number]: RoundState<RoundsWomen>;
      } = {
        [RoundsWomen.OPENING_ROUND]: null,
        [RoundsWomen.ELIMINATION_ROUND]: null,
        [RoundsWomen.ROUND16]: null,
        [RoundsWomen.QUARTERFINALS]: null,
        [RoundsWomen.SEMIFINALS]: null,
        [RoundsWomen.FINALS]: null,
      };

      let count = 1;
      eventRounds.forEach((eventRound) => {
        if (isPostCut && count === 3) count++;

        roundConfig[count] = {
          eventRoundId: eventRound.id,
          roundId: eventRound.round.id,
          name: eventRound.round.name,
          roundNo: +eventRound.round.roundNo,
          status: +eventRound.roundStatus,
          eventRoundNo: count++,
        };
      });

      const roundsMap: RoundState<RoundsWomen>[] = Object.keys(roundConfig)
        .map((key): RoundState<RoundsWomen> => roundConfig[+key])
        .filter(Boolean);

      // get the current round
      const currentRoundItem = roundsMap.find((item) => item.status === RoundStatus.LIVE);

      const hasMultipleLiveRounds: boolean =
        roundsMap.filter((row) => row.status === RoundStatus.LIVE).length > 1;
      // get the next round, this will be the first round that is upcoming or next
      const nextRoundItem = roundsMap.find((item) =>
        !hasMultipleLiveRounds
          ? [RoundStatus.UPCOMING, RoundStatus.NEXT].includes(item.status)
          : [RoundStatus.UPCOMING, RoundStatus.NEXT, RoundStatus.LIVE].includes(item.status) &&
            item.eventRoundNo !== currentRoundItem.eventRoundNo,
      );

      let shouldRunSim: boolean = true;

      if (
        !nextRoundItem &&
        currentRoundHeat.heatNo === 1 &&
        [RoundsWomen.FINALS].includes(currentRoundItem.eventRoundNo)
      ) {
        await Promise.all([
          // final
          transactionalEntityManager.update(
            EventRounds,
            { id: currentRoundItem.eventRoundId },
            {
              roundStatus: RoundStatus.COMPLETED,
              endDate: new Date().toISOString(),
            },
          ),
          // close market for the current heat
          // transactionalEntityManager.update(
          //   RoundHeats,
          //   { id: currentRoundHeat.id },
          //   {
          //     isHeatWinnerMarketOpen: false,
          //     heatStatus: HeatStatus.COMPLETED,
          //     endDate: new Date().toISOString(),
          //   },
          // ),
          // this is the last round and the event market should close as well
          transactionalEntityManager.update(
            Events,
            { id: eventId },
            {
              winnerAthleteId: heatWinnerId,
              eventStatus: EventStatus.COMPLETED,
              isEventWinnerMarketOpen: false,
              endDate: new Date().toISOString(),
            },
          ),
        ]);

        shouldRunSim = false;
        return shouldRunSim;
      }

      const nextRound = await this.eventRoundRepository.findOne({
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
      });

      if (
        // precut
        (currentRoundHeat.heatNo === 6 &&
          [RoundsWomen.OPENING_ROUND].includes(currentRoundItem.eventRoundNo) &&
          !isPostCut) ||
        // postcut
        (currentRoundHeat.heatNo === 4 &&
          [RoundsWomen.OPENING_ROUND].includes(currentRoundItem.eventRoundNo) &&
          isPostCut) ||
        // precut
        (currentRoundHeat.heatNo === 2 &&
          [RoundsWomen.ELIMINATION_ROUND].includes(currentRoundItem.eventRoundNo) &&
          !isPostCut) ||
        // postcut
        (currentRoundHeat.heatNo === 4 &&
          [RoundsWomen.ELIMINATION_ROUND].includes(currentRoundItem.eventRoundNo) &&
          isPostCut) ||
        (currentRoundHeat.heatNo === 8 &&
          [RoundsWomen.ROUND16].includes(currentRoundItem.eventRoundNo)) ||
        (currentRoundHeat.heatNo === 4 &&
          [RoundsWomen.QUARTERFINALS].includes(currentRoundItem.eventRoundNo)) ||
        (currentRoundHeat.heatNo === 2 &&
          [RoundsWomen.SEMIFINALS].includes(currentRoundItem.eventRoundNo))
      ) {
        await Promise.all([
          // transactionalEntityManager.update(
          //   EventRounds,
          //   { id: nextRound.id },
          //   {
          //     roundStatus: RoundStatus.LIVE,
          //   },
          // ),
          // open markets for the next few heats
          transactionalEntityManager.update(
            RoundHeats,
            { id: In(nextRound.round.heats.map((heatItem) => heatItem.id)) },
            {
              isHeatWinnerMarketOpen: false,
              // heatStatus: HeatStatus.LIVE,
            },
          ),
          // close the round as well
          transactionalEntityManager.update(
            EventRounds,
            { id: currentRoundItem.eventRoundId },
            {
              roundStatus: RoundStatus.COMPLETED,
              endDate: new Date().toISOString(),
            },
          ),
          // close market for the current heat
          // transactionalEntityManager.update(
          //   RoundHeats,
          //   { id: currentRoundHeat.id },
          //   {
          //     isHeatWinnerMarketOpen: false,
          //     heatStatus: HeatStatus.COMPLETED,
          //     endDate: new Date().toISOString(),
          //   },
          // ),
        ]);

        // shouldRunSim = true;
      }

      // find all heats for the current round
      const currentRoundHeats = await transactionalEntityManager.find(RoundHeats, {
        where: {
          roundId: currentRoundHeat.round.id,
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
            heatScore: true,
            heatPosition: true,
            athleteId: true,
            athlete: {
              id: true,
              participant: {
                id: true,
                athleteId: true,
                seedNo: true,
                tier: true,
                tierSeed: true,
              },
            },
          },
        },
        relations: ["scores.athlete.participant"],
        order: {
          scores: {
            heatScore: "DESC",
          },
        },
      });
      /* const currentRoundHeats = await this.heatsRepository.find({
        where: {
          roundId: currentRoundHeat.round.id,
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
          scores: {
            roundHeatId: true,
            roundSeed: true,
            heatScore: true,
            heatPosition: true,
            athleteId: true,
            athlete: {
              id: true,
              participant: {
                id: true,
                athleteId: true,
                seedNo: true,
                tier: true,
                tierSeed: true,
              },
            },
          },
        },
        relations: ["scores.athlete.participant"],
        order: {
          scores: {
            heatScore: "DESC",
          },
        },
      }); */

      const scoresPayload: Scores[] = [];
      // logic for round advancement

      if (
        currentRoundItem.eventRoundNo === RoundsWomen.OPENING_ROUND &&
        ((isPostCut && currentRoundHeat.heatNo === 4) ||
          (!isPostCut && currentRoundHeat.heatNo === 6)) &&
        currentRoundItem.status !== RoundStatus.COMPLETED
      ) {
        // Current Round: Opening round
        // Next Round: Elimination Round

        // this is the opening round and the athlete goes to round of 16 and elimination rounds
        // for now round of 16 is not handled since it would be incomplete
        // as elimiation round also has participants going to round of 16
        // elimination round athletes are those th
        let eliminationPlayers: IAthlete[] = [];
        currentRoundHeats.map((roundHeatItem) => {
          // roundHeatItem.scores.slice(1, roundHeatItem.scores.length).forEach((score) => {
          roundHeatItem.scores
            .slice(!isPostCut ? -1 : 1, roundHeatItem.scores.length)
            .forEach((score) => {
              eliminationPlayers.push({
                athleteId: score.athleteId,
                seedNo: score.athlete.participant.seedNo,
              });
            });
        });

        eliminationPlayers = orderBy(eliminationPlayers, ["seedNo"], "asc");

        const eliminationRound = !isPostCut
          ? {
              1: [1, 4, 6],
              2: [2, 3, 5],
              // 1: [1, 4, 6],
              // 2: [2, 3, 5],
            }
          : {
              1: [1, 8],
              2: [3, 6],
              3: [2, 7],
              4: [4, 5],
            };

        scoresPayload.push(
          ...this.createHeatScores(eventId, eliminationRound, nextRound, eliminationPlayers),
        );

        // Object.keys(eliminationRound).map((key: string) => {
        //   const value: number[] = eliminationRound[+key];

        //   const nextRoundHeat = nextRound.round.heats.find((heat) => heat.heatNo === +key);

        //   scoresPayload.push(
        //     ...eliminationPlayers
        //       .filter((_, index) => value.includes(index + 1))
        //       .map((item) => {
        //         const roundSeed = eliminationPlayers.findIndex(
        //           (rowItem) => rowItem.athleteId === item.athleteId,
        //         );

        //         return this.scoresRepository.create({
        //           eventId,
        //           roundHeatId: nextRoundHeat.id,
        //           athleteId: item.athleteId,
        //           roundSeed: roundSeed + 1,
        //         });
        //       }),
        //   );
        // });
      } else if (
        currentRoundItem.eventRoundNo === RoundsWomen.ELIMINATION_ROUND &&
        // ((isPostCut && currentRoundHeat.heatNo === 4) ||
        //   (!isPostCut && currentRoundHeat.heatNo === 2)) &&
        currentRoundItem.status !== RoundStatus.COMPLETED
      ) {
        // Current Round: Elimination round
        // Next Round: Round of 16 / Quarterfinals

        // delete existing next round data and re-insert all of it
        await transactionalEntityManager.delete(Scores, {
          roundHeatId: In(nextRound.round.heats.map((rowHeat) => rowHeat.id)),
          eventId,
        });

        // for this one the winners of each heat need to be picked and the winners of the opening round heat as well
        // these are the athletes that will progress to round of 16
        const openingRoundItem = roundsMap.find(
          (item) => item.eventRoundNo === RoundsWomen.OPENING_ROUND,
        );
        const openingEventRound = await this.eventRoundRepository.findOne({
          where: {
            // round: {
            //   roundNo: 1,
            // },
            id: openingRoundItem.eventRoundId,
            eventId,
          },
          select: {
            id: true,
            roundId: true,
            round: {
              id: true,
              roundNo: true,
            },
          },
          relations: ["round"],
        });
        const openingRoundHeats = await this.heatsRepository.find({
          where: {
            roundId: openingEventRound.roundId,
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
            scores: {
              roundHeatId: true,
              roundSeed: true,
              heatScore: true,
              heatPosition: true,
              athleteId: true,
              athlete: {
                id: true,
                participant: {
                  id: true,
                  athleteId: true,
                  seedNo: true,
                  tier: true,
                  tierSeed: true,
                },
              },
            },
          },
          relations: ["scores.athlete.participant"],
          order: {
            scores: {
              heatScore: "DESC",
            },
          },
        });

        let nextRoundPlayers: IAthlete[] = [];
        // current round at this point is elimiation round
        currentRoundHeats.map((roundHeatItem) => {
          if (roundHeatItem.heatStatus === HeatStatus.COMPLETED)
            roundHeatItem.scores.slice(0, isPostCut ? 1 : 2).forEach((score) => {
              nextRoundPlayers.push({
                athleteId: score.athleteId,
                seedNo: score.athlete.participant.seedNo,
                tier: score.athlete.participant.tier,
                tierSeed: +score.athlete.participant.tierSeed,
                // used for pre-cut only to determnie round place and used at a later point in the formula
                roundPlace: 3,
              });
            });
        });

        // need to also pick winners from opening round
        // all of opening round can be picked for upcoming because that is anyways completed
        openingRoundHeats.map((roundHeatItem) => {
          roundHeatItem.scores.slice(0, isPostCut ? 1 : 2).forEach((score) => {
            nextRoundPlayers.push({
              athleteId: score.athleteId,
              seedNo: score.athlete.participant.seedNo,
              tier: score.athlete.participant.tier,
              tierSeed: +score.athlete.participant.tierSeed,
              // used for pre-cut only to determnie round place and used at a later point in the formula
              roundPlace: +score.heatPosition === 1 ? 1 : 3,
            });
          });
        });

        nextRoundPlayers = isPostCut
          ? orderBy(nextRoundPlayers, ["seedNo"], "asc")
          : this.fetchTieredSeeds(nextRoundPlayers);

        const nextRoundPlacement = !isPostCut
          ? {
              1: [3, 14],
              2: [6, 11],
              3: [2, 15],
              4: [7, 10],
              5: [1, 16],
              6: [8, 9],
              7: [4, 13],
              8: [5, 12],
            }
          : {
              1: [2, 7],
              2: [3, 6],
              3: [1, 8],
              4: [4, 5],
            };

        scoresPayload.push(
          ...this.createHeatScores(eventId, nextRoundPlacement, nextRound, nextRoundPlayers),
        );
        // Object.keys(nextRoundPlacement).map((key: string) => {
        //   const value: number[] = nextRoundPlacement[+key];

        //   const nextRoundHeat = nextRound.round.heats.find((heat) => heat.heatNo === +key);

        //   scoresPayload.push(
        //     ...nextRoundPlayers
        //       .filter((_, index) => value.includes(index + 1))
        //       .map((item) => {
        //         const roundSeed = nextRoundPlayers.findIndex(
        //           (rowItem) => rowItem.athleteId === item.athleteId,
        //         );

        //         return this.scoresRepository.create({
        //           eventId,
        //           roundHeatId: nextRoundHeat.id,
        //           athleteId: item.athleteId,
        //           roundSeed: roundSeed + 1,
        //         });
        //       }),
        //   );
        // });
      } else if (
        currentRoundItem.eventRoundNo === RoundsWomen.ROUND16 &&
        // currentRoundHeat.heatNo === 8 &&
        currentRoundItem.status !== RoundStatus.COMPLETED
      ) {
        // Current Round: Quarterfinals
        // Next Round: Senifinals

        // delete existing next round data and re-insert all of it
        await transactionalEntityManager.delete(Scores, {
          roundHeatId: In(nextRound.round.heats.map((rowHeat) => rowHeat.id)),
          eventId,
        });

        currentRoundHeats.forEach((roundHeatItem) => {
          const heatNo: number = roundHeatItem.heatNo;

          if (roundHeatItem.heatStatus === HeatStatus.COMPLETED)
            roundHeatItem.scores.slice(0, 1).forEach((score) => {
              const nextRoundHeat = nextRound.round.heats.find((heat) => {
                switch (heatNo) {
                  case 1:
                  case 2:
                    return heat.heatNo === 1;

                  case 3:
                  case 4:
                    return heat.heatNo === 2;

                  case 5:
                  case 6:
                    return heat.heatNo === 3;

                  case 7:
                  case 8:
                    return heat.heatNo === 4;

                  default:
                    break;
                }

                return heat.heatNo === heatNo;
              });

              scoresPayload.push(
                this.scoresRepository.create({
                  eventId,
                  roundHeatId: nextRoundHeat.id,
                  athleteId: score.athleteId,
                  roundSeed: score.athlete.participant.seedNo,
                }),
              );
            });
        });
      } else if (
        currentRoundItem.eventRoundNo === RoundsWomen.QUARTERFINALS &&
        // currentRoundHeat.heatNo === 4 &&
        currentRoundItem.status !== RoundStatus.COMPLETED
      ) {
        // Current Round: Quarterfinals
        // Next Round: Senifinals

        // delete existing next round data and re-insert all of it
        await transactionalEntityManager.delete(Scores, {
          roundHeatId: In(nextRound.round.heats.map((rowHeat) => rowHeat.id)),
          eventId,
        });

        currentRoundHeats.map((roundHeatItem) => {
          const heatNo: number = roundHeatItem.heatNo;

          if (roundHeatItem.heatStatus === HeatStatus.COMPLETED)
            roundHeatItem.scores.slice(0, 1).forEach((score) => {
              const nextRoundHeat = nextRound.round.heats.find((heat) => {
                switch (heatNo) {
                  case 1:
                  case 2:
                    return heat.heatNo === 1;

                  case 3:
                  case 4:
                    return heat.heatNo === 2;

                  default:
                    break;
                }

                return heat.heatNo === heatNo;
              });

              scoresPayload.push(
                this.scoresRepository.create({
                  eventId,
                  roundHeatId: nextRoundHeat.id,
                  athleteId: score.athleteId,
                  roundSeed: score.athlete.participant.seedNo,
                }),
              );
            });
        });
      } else if (
        currentRoundItem.eventRoundNo === RoundsWomen.SEMIFINALS &&
        // currentRoundHeat.heatNo === 2 &&
        currentRoundItem.status !== RoundStatus.COMPLETED
      ) {
        // Current Round: Senifinals
        // Next Round: Finals

        // delete existing next round data and re-insert all of it
        await transactionalEntityManager.delete(Scores, {
          roundHeatId: In(nextRound.round.heats.map((rowHeat) => rowHeat.id)),
          eventId,
        });

        currentRoundHeats.map((roundHeatItem) => {
          const heatNo: number = roundHeatItem.heatNo;

          if (roundHeatItem.heatStatus === HeatStatus.COMPLETED)
            roundHeatItem.scores.slice(0, 1).forEach((score) => {
              const nextRoundHeat = nextRound.round.heats.find((heat) => {
                switch (heatNo) {
                  case 1:
                  case 2:
                    return heat.heatNo === 1;

                  default:
                    break;
                }

                return heat.heatNo === heatNo;
              });

              scoresPayload.push(
                this.scoresRepository.create({
                  eventId,
                  roundHeatId: nextRoundHeat.id,
                  athleteId: score.athleteId,
                  roundSeed: score.athlete.participant.seedNo,
                }),
              );
            });
        });
      }

      if (scoresPayload.length)
        await transactionalEntityManager.upsert(Scores, scoresPayload, {
          conflictPaths: ["eventId", "roundHeatId", "athleteId"],
        });

      // await this.queueService.notifyEventUpdate({
      //   eventId,
      //   delaySeconds: 10,
      //   sportType: SportsTypes.SURFING,
      // });

      return shouldRunSim;
    } catch (error) {
      throw error;
    }
  }

  private async handleSaveMensLiveScore(
    isPostCut: boolean,
    heatWinnerId: string,
    currentRoundHeat: RoundHeats,
    eventId: string,
    transactionalEntityManager: EntityManager,
  ): Promise<boolean> {
    try {
      // fetch the event rounds and sort ascending to know the rounds for the event
      const eventRounds = await this.eventRoundRepository.find({
        where: {
          eventId,
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

      let shouldRunSim: boolean = true;

      const roundConfig: {
        [key: number]: RoundState<RoundsMen>;
      } = {
        [RoundsMen.OPENING_ROUND]: null,
        [RoundsMen.ELIMINATION_ROUND]: null,
        [RoundsMen.ROUND32]: null,
        [RoundsMen.ROUND16]: null,
        [RoundsMen.QUARTERFINALS]: null,
        [RoundsMen.SEMIFINALS]: null,
        [RoundsMen.FINALS]: null,
      };

      let count = 1;
      eventRounds.forEach((eventRound) => {
        if (isPostCut && count === 3) count++;

        roundConfig[count] = {
          eventRoundId: eventRound.id,
          roundId: eventRound.round.id,
          name: eventRound.round.name,
          roundNo: +eventRound.round.roundNo,
          status: +eventRound.roundStatus,
          eventRoundNo: count++,
        };
      });

      const roundsMap: RoundState<RoundsMen>[] = Object.keys(roundConfig)
        // .filter((key) => (isPostCut ? +key !== RoundsMen.ROUND32 : +key))
        .map((key): RoundState<RoundsMen> => roundConfig[+key])
        .filter(Boolean);

      // get the current round
      const currentRoundItem = roundsMap.find((item) => item.status === RoundStatus.LIVE);

      // get the next round, this will be the first round that is upcoming or next
      const hasMultipleLiveRounds: boolean =
        roundsMap.filter((row) => row.status === RoundStatus.LIVE).length > 1;
      // get the next round, this will be the first round that is upcoming or next
      const nextRoundItem = roundsMap.find((item) =>
        !hasMultipleLiveRounds
          ? [RoundStatus.UPCOMING, RoundStatus.NEXT].includes(item.status)
          : [RoundStatus.UPCOMING, RoundStatus.NEXT, RoundStatus.LIVE].includes(item.status) &&
            item.eventRoundNo !== currentRoundItem.eventRoundNo,
      );

      if (
        currentRoundHeat.heatNo === 1 &&
        [RoundsMen.FINALS].includes(currentRoundItem.eventRoundNo)
      ) {
        // final
        await transactionalEntityManager.update(
          EventRounds,
          { id: currentRoundItem.eventRoundId },
          {
            roundStatus: RoundStatus.COMPLETED,
            endDate: new Date().toISOString(),
          },
        );
        // this is the last round and the event market should close as well
        await transactionalEntityManager.update(
          Events,
          { id: eventId },
          {
            // heat winner in the final event is the event winner
            winnerAthleteId: heatWinnerId,
            eventStatus: EventStatus.COMPLETED,
            isEventWinnerMarketOpen: false,
            endDate: new Date().toISOString(),
          },
        );

        shouldRunSim = false;
        return shouldRunSim;
      }

      const nextRound = await this.eventRoundRepository.findOne({
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
      });

      if (
        // postcut
        (currentRoundHeat.heatNo === 12 &&
          [RoundsMen.OPENING_ROUND].includes(currentRoundItem.eventRoundNo) &&
          !isPostCut) ||
        // precut
        (currentRoundHeat.heatNo === 8 &&
          [RoundsMen.OPENING_ROUND].includes(currentRoundItem.eventRoundNo) &&
          isPostCut) ||
        // postcut
        (currentRoundHeat.heatNo === 4 &&
          [RoundsMen.ELIMINATION_ROUND].includes(currentRoundItem.eventRoundNo) &&
          !isPostCut) ||
        // precut
        (currentRoundHeat.heatNo === 8 &&
          [RoundsMen.ELIMINATION_ROUND].includes(currentRoundItem.eventRoundNo) &&
          isPostCut) ||
        // postcut
        (currentRoundHeat.heatNo === 16 &&
          [RoundsMen.ROUND32].includes(currentRoundItem.eventRoundNo)) ||
        (currentRoundHeat.heatNo === 8 &&
          [RoundsMen.ROUND16].includes(currentRoundItem.eventRoundNo)) ||
        (currentRoundHeat.heatNo === 4 &&
          [RoundsMen.QUARTERFINALS].includes(currentRoundItem.eventRoundNo)) ||
        (currentRoundHeat.heatNo === 2 &&
          [RoundsMen.SEMIFINALS].includes(currentRoundItem.eventRoundNo))
      ) {
        await Promise.all([
          // open markets for the next few heats
          transactionalEntityManager.update(
            RoundHeats,
            { id: In(nextRound.round.heats.map((heatItem) => heatItem.id)) },
            {
              isHeatWinnerMarketOpen: false,
            },
          ),
          // close the round as well
          transactionalEntityManager.update(
            EventRounds,
            { id: currentRoundItem.eventRoundId },
            {
              roundStatus: RoundStatus.COMPLETED,
              endDate: new Date().toISOString(),
            },
          ),
        ]);

        // shouldRunSim = true;
      }

      // find all heats for the current round
      const currentRoundHeats = await transactionalEntityManager.find(RoundHeats, {
        where: {
          roundId: currentRoundHeat.round.id,
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
            heatScore: true,
            heatPosition: true,
            athleteId: true,
            athlete: {
              id: true,
              participant: {
                id: true,
                athleteId: true,
                seedNo: true,
                tier: true,
                tierSeed: true,
              },
            },
          },
        },
        relations: ["scores.athlete.participant"],
        order: {
          scores: {
            heatScore: "DESC",
          },
        },
      });

      const scoresPayload: Scores[] = [];
      // logic for round advancement

      if (
        currentRoundItem.eventRoundNo === RoundsMen.OPENING_ROUND &&
        ((isPostCut && currentRoundHeat.heatNo === 8) ||
          (!isPostCut && currentRoundHeat.heatNo === 12)) &&
        currentRoundItem.status !== RoundStatus.COMPLETED
      ) {
        // current round : Opening
        // next round : Elimination
        // this is the opening round and the athlete goes to round of 32 and elimination rounds

        let eliminationPlayers: IAthlete[] = [];
        currentRoundHeats.map((roundHeatItem) => {
          roundHeatItem.scores
            .slice(!isPostCut ? -1 : 1, roundHeatItem.scores.length)
            // .slice(1, roundHeatItem.scores.length)
            .forEach((score) => {
              eliminationPlayers.push({
                athleteId: score.athleteId,
                seedNo: score.athlete.participant.seedNo,
              });
            });
        });

        eliminationPlayers = orderBy(eliminationPlayers, ["seedNo"], "asc");

        const eliminationRound = !isPostCut
          ? {
              1: [1, 8, 12],
              2: [2, 7, 11],
              3: [3, 6, 10],
              4: [4, 5, 9],
              // 1: [2, 8, 12],
              // 2: [1, 6, 10],
              // 3: [3, 4, 11],
              // 4: [5, 7, 9],
            }
          : {
              1: [1, 16],
              2: [5, 12],
              3: [2, 15],
              4: [6, 11],
              5: [3, 14],
              6: [7, 10],
              7: [4, 13],
              8: [8, 9],
            };

        scoresPayload.push(
          ...this.createHeatScores(eventId, eliminationRound, nextRound, eliminationPlayers),
        );
      } else if (
        currentRoundItem.eventRoundNo === RoundsMen.ELIMINATION_ROUND &&
        // ((!isPostCut && currentRoundHeat.heatNo === 4) ||
        //   (isPostCut && currentRoundHeat.heatNo === 8)) &&
        currentRoundItem.status !== RoundStatus.COMPLETED
      ) {
        // current round : Elimination
        // next round : Round of 32 / 16

        // delete existing next round data and re-insert all of it
        await transactionalEntityManager.delete(Scores, {
          roundHeatId: In(nextRound.round.heats.map((rowHeat) => rowHeat.id)),
          eventId,
        });

        // for this one the winners of each heat need to be picked and the winners of the opening round heat as well
        // these are the athletes that will progress to round of 16
        const openingRoundItem = roundsMap.find(
          (item) => item.eventRoundNo === RoundsMen.OPENING_ROUND,
        );
        const openingEventRound = await this.eventRoundRepository.findOne({
          where: {
            id: openingRoundItem.eventRoundId,
            eventId,
          },
          select: {
            id: true,
            roundId: true,
            round: {
              id: true,
              roundNo: true,
            },
          },
          relations: ["round"],
        });
        const openingRoundHeats = await this.heatsRepository.find({
          where: {
            roundId: openingEventRound.roundId,
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
            scores: {
              roundHeatId: true,
              roundSeed: true,
              heatScore: true,
              heatPosition: true,
              athleteId: true,
              athlete: {
                id: true,
                participant: {
                  id: true,
                  athleteId: true,
                  seedNo: true,
                  tier: true,
                  tierSeed: true,
                },
              },
            },
          },
          relations: ["scores.athlete.participant"],
          order: {
            scores: {
              heatScore: "DESC",
            },
          },
        });

        let nextRoundPlayers: IAthlete[] = [];
        // current round at this point is elimiation round
        currentRoundHeats.map((roundHeatItem) => {
          if (roundHeatItem.heatStatus === HeatStatus.COMPLETED)
            roundHeatItem.scores
              .slice(0, isPostCut ? 1 : 2)
              // .slice(0, 1)
              .forEach((score) => {
                nextRoundPlayers.push({
                  athleteId: score.athleteId,
                  seedNo: score.athlete.participant.seedNo,
                  tier: score.athlete.participant.tier,
                  tierSeed: +score.athlete.participant.tierSeed,
                  // used for pre-cut only to determnie round place and used at a later point in the formula
                  roundPlace: 3,
                });
              });
        });
        // need to also pick winners from opening round
        // all of opening round can be picked for upcoming because that is anyways completed
        openingRoundHeats.map((roundHeatItem) => {
          roundHeatItem.scores
            .slice(0, isPostCut ? 1 : 2)
            // .slice(0, 1)
            .forEach((score) => {
              nextRoundPlayers.push({
                athleteId: score.athleteId,
                seedNo: score.athlete.participant.seedNo,
                tier: score.athlete.participant.tier,
                tierSeed: +score.athlete.participant.tierSeed,
                // used for pre-cut only to determnie round place and used at a later point in the formula
                roundPlace: +score.heatPosition === 1 ? 1 : 3,
              });
            });
        });

        nextRoundPlayers = isPostCut
          ? orderBy(nextRoundPlayers, ["seedNo"], "asc")
          : this.fetchTieredSeeds(nextRoundPlayers);

        const nextRoundPlacement = !isPostCut
          ? {
              1: [3, 30],
              2: [14, 19],
              3: [6, 27],
              4: [11, 22],
              5: [2, 31],
              6: [15, 18],
              7: [7, 26],
              8: [10, 23],
              9: [1, 32],
              10: [16, 17],
              11: [9, 24],
              12: [8, 25],
              13: [4, 29],
              14: [13, 20],
              15: [12, 21],
              16: [5, 28],
              // 1: [5, 27],
              // 2: [15, 16],
              // 3: [11, 30],
              // 4: [10, 21],
              // 5: [3, 29],
              // 6: [17, 14],
              // 7: [2, 28],
              // 8: [8, 23],
              // 9: [1, 32],
              // 10: [20, 22],
              // 11: [6, 24],
              // 12: [4, 26],
              // 13: [7, 25],
              // 14: [13, 18],
              // 15: [12, 19],
              // 16: [9, 31],
            }
          : {
              1: [2, 15],
              2: [7, 10],
              3: [3, 14],
              4: [6, 11],
              5: [1, 16],
              6: [8, 9],
              7: [4, 13],
              8: [5, 12],
            };

        scoresPayload.push(
          ...this.createHeatScores(eventId, nextRoundPlacement, nextRound, nextRoundPlayers),
        );
      } else if (
        currentRoundItem.eventRoundNo === RoundsMen.ROUND32 &&
        // currentRoundHeat.heatNo === 16 &&
        currentRoundItem.status !== RoundStatus.COMPLETED
      ) {
        // current round : Round of 32
        // next round : Round of 16

        // delete existing next round data and re-insert all of it
        await transactionalEntityManager.delete(Scores, {
          roundHeatId: In(nextRound.round.heats.map((rowHeat) => rowHeat.id)),
          eventId,
        });

        currentRoundHeats.map((roundHeatItem) => {
          const heatNo: number = roundHeatItem.heatNo;

          if (roundHeatItem.heatStatus === HeatStatus.COMPLETED)
            roundHeatItem.scores.slice(0, 1).forEach((score) => {
              const nextRoundHeat = nextRound.round.heats.find((heat) => {
                switch (heatNo) {
                  case 1:
                  case 2:
                    return heat.heatNo === 1;

                  case 3:
                  case 4:
                    return heat.heatNo === 2;

                  case 5:
                  case 6:
                    return heat.heatNo === 3;

                  case 7:
                  case 8:
                    return heat.heatNo === 4;

                  case 9:
                  case 10:
                    return heat.heatNo === 5;

                  case 11:
                  case 12:
                    return heat.heatNo === 6;

                  case 13:
                  case 14:
                    return heat.heatNo === 7;

                  case 15:
                  case 16:
                    return heat.heatNo === 8;

                  default:
                    break;
                }

                return heat.heatNo === heatNo;
              });

              scoresPayload.push(
                this.scoresRepository.create({
                  eventId,
                  roundHeatId: nextRoundHeat.id,
                  athleteId: score.athleteId,
                  roundSeed: score.athlete.participant.seedNo,
                }),
              );
            });
        });
      } else if (
        currentRoundItem.eventRoundNo === RoundsMen.ROUND16 &&
        // currentRoundHeat.heatNo === 8 &&
        currentRoundItem.status !== RoundStatus.COMPLETED
      ) {
        // current round : Round of 16
        // next round : Quarterfinals

        // delete existing next round data and re-insert all of it
        await transactionalEntityManager.delete(Scores, {
          roundHeatId: In(nextRound.round.heats.map((rowHeat) => rowHeat.id)),
          eventId,
        });

        currentRoundHeats.map((roundHeatItem) => {
          const heatNo: number = roundHeatItem.heatNo;

          if (roundHeatItem.heatStatus === HeatStatus.COMPLETED)
            roundHeatItem.scores.slice(0, 1).forEach((score) => {
              const nextRoundHeat = nextRound.round.heats.find((heat) => {
                switch (heatNo) {
                  case 1:
                  case 2:
                    return heat.heatNo === 1;

                  case 3:
                  case 4:
                    return heat.heatNo === 2;

                  case 5:
                  case 6:
                    return heat.heatNo === 3;

                  case 7:
                  case 8:
                    return heat.heatNo === 4;

                  default:
                    break;
                }

                return heat.heatNo === heatNo;
              });

              scoresPayload.push(
                this.scoresRepository.create({
                  eventId,
                  roundHeatId: nextRoundHeat.id,
                  athleteId: score.athleteId,
                  roundSeed: score.athlete.participant.seedNo,
                }),
              );
            });
        });
      } else if (
        currentRoundItem.eventRoundNo === RoundsMen.QUARTERFINALS &&
        // currentRoundHeat.heatNo === 4 &&
        currentRoundItem.status !== RoundStatus.COMPLETED
      ) {
        // current round : Quarterfinals
        // next round : Semifinals

        // delete existing next round data and re-insert all of it
        await transactionalEntityManager.delete(Scores, {
          roundHeatId: In(nextRound.round.heats.map((rowHeat) => rowHeat.id)),
          eventId,
        });

        currentRoundHeats.map((roundHeatItem) => {
          const heatNo: number = roundHeatItem.heatNo;

          if (roundHeatItem.heatStatus === HeatStatus.COMPLETED)
            roundHeatItem.scores.slice(0, 1).forEach((score) => {
              const nextRoundHeat = nextRound.round.heats.find((heat) => {
                switch (heatNo) {
                  case 1:
                  case 2:
                    return heat.heatNo === 1;

                  case 3:
                  case 4:
                    return heat.heatNo === 2;

                  default:
                    break;
                }

                return heat.heatNo === heatNo;
              });

              scoresPayload.push(
                this.scoresRepository.create({
                  eventId,
                  roundHeatId: nextRoundHeat.id,
                  athleteId: score.athleteId,
                  roundSeed: score.athlete.participant.seedNo,
                }),
              );
            });
        });
      } else if (
        currentRoundItem.eventRoundNo === RoundsMen.SEMIFINALS &&
        // currentRoundHeat.heatNo === 2 &&
        currentRoundItem.status !== RoundStatus.COMPLETED
      ) {
        // current round : Semifinals
        // next round : Finals

        // delete existing next round data and re-insert all of it
        await transactionalEntityManager.delete(Scores, {
          roundHeatId: In(nextRound.round.heats.map((rowHeat) => rowHeat.id)),
          eventId,
        });

        currentRoundHeats.map((roundHeatItem) => {
          const heatNo: number = roundHeatItem.heatNo;

          if (roundHeatItem.heatStatus === HeatStatus.COMPLETED)
            roundHeatItem.scores.slice(0, 1).forEach((score) => {
              const nextRoundHeat = nextRound.round.heats.find((heat) => {
                switch (heatNo) {
                  case 1:
                  case 2:
                    return heat.heatNo === 1;

                  default:
                    break;
                }

                return heat.heatNo === heatNo;
              });

              scoresPayload.push(
                this.scoresRepository.create({
                  eventId,
                  roundHeatId: nextRoundHeat.id,
                  athleteId: score.athleteId,
                  roundSeed: score.athlete.participant.seedNo,
                }),
              );
            });
        });
      }

      if (scoresPayload.length)
        await transactionalEntityManager.upsert(Scores, scoresPayload, {
          conflictPaths: ["eventId", "roundHeatId", "athleteId"],
        });

      return shouldRunSim;
    } catch (error) {
      throw error;
    }
  }

  private createHeatScores(
    eventId: string,
    roundKey: IRoundKey,
    nextRound: EventRounds,
    athletes: IAthlete[],
  ): Scores[] {
    try {
      return Object.keys(roundKey)
        .map((key: string) => {
          const value: number[] = roundKey[+key];

          const nextRoundHeat = nextRound.round.heats.find((heat) => {
            return heat.heatNo === +key;
          });
          return athletes
            .filter((_, index) => value.includes(index + 1))
            .map((item) => {
              const roundSeed = athletes.findIndex(
                (rowItem) => rowItem.athleteId === item.athleteId,
              );

              return this.scoresRepository.create({
                eventId,
                roundHeatId: nextRoundHeat.id,
                athleteId: item.athleteId,
                roundSeed: roundSeed + 1,
              });
            });
        })
        .flat();
    } catch (error) {
      throw error;
    }
  }

  fetchTieredSeeds(athletes: IAthlete[]): IAthlete[] {
    const sortedAthletes = orderBy(athletes, ["seedNo"], "asc");

    // group based on the tier in order to set the updated tier ranking
    const grouped: {
      [tier: string]: IAthlete[];
    } = groupBy(sortedAthletes, "tier");

    const updatedTierData: IAthlete[] = [];
    Object.keys(grouped).forEach((key) => {
      const values = grouped[key];

      values.forEach((row, index) => {
        updatedTierData.push({
          ...row,
          tierSeed: index + 1,
        });
      });
    });

    const sortedupdatedTierData: IAthlete[] = updatedTierData.sort((a, b) => a.seedNo - b.seedNo);

    const updatedData: IAthlete[] = orderBy(
      sortedupdatedTierData.map((row, rowIndex) => {
        const currentRowNo = rowIndex + 1;

        let tierSeed = +row.tierSeed;

        if (row.roundPlace > 1) {
          const rowCount = sortedupdatedTierData.filter(
            (itemRow, itemRowIndex) =>
              row.tier === itemRow.tier &&
              itemRowIndex + 1 > currentRowNo &&
              itemRow.roundPlace === 1,
          ).length;

          tierSeed += rowCount;
        } else {
          const rowCount = sortedupdatedTierData.filter(
            (itemRow, itemRowIndex) =>
              row.tier === itemRow.tier &&
              itemRowIndex + 1 < currentRowNo &&
              itemRow.roundPlace > 1,
          ).length;
          tierSeed -= rowCount;
        }

        const newTierSeed = `${row.tier}${tierSeed}`;

        return {
          ...row,
          tierSeed,
          newTierSeed,
        };
      }),
      ["tier", "tierSeed"],
      ["asc", "asc"],
      // ["newTierSeed"],
      // "asc",
    );

    return updatedData.map((row, index) => ({
      ...row,
      seedNo: index + 1,
    }));
  }

  async seedPreview(
    eventId: string,
    payload: EventSeedPreviewDto,
  ): Promise<EventParticipantResponse[]> {
    try {
      const event = await this.eventsRepository.findOne({
        where: {
          id: eventId,
        },
        select: {
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
          participants: {
            id: true,
            seedNo: true,
            tier: true,
            tierSeed: true,
            status: true,
            notes: true,
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
        },
        relations: ["tourYear.tour", "participants.athlete"],
      });

      const promises = event.participants.map(async (participant) => {
        const baseProjection = await this.wslSyncHelperService.fetchAthleteProjection(
          participant.athlete.id,
          event.tourYear.tour.gender,
          payload.weights,
        );

        return {
          id: participant.id,
          seedNo: participant.seedNo,
          tier: participant.tier,
          tierSeed: participant.tierSeed,
          baseProjection,
          status: participant.status,
          notes: participant.notes,
          athlete: {
            id: participant.athlete.id,
            firstName: participant.athlete.firstName,
            middleName: participant.athlete.middleName,
            lastName: participant.athlete.lastName,
            nationality: participant.athlete.nationality,
            stance: participant.athlete.stance,
            gender: participant.athlete.gender,
          },
          event: {
            id: event.id,
            eventStatus: event.eventStatus,
            name: event.name,
            tourId: event.tourYear.tourId,
            tourYearId: event.tourYear.id,
            tourYear: event.tourYear.year,
            tourGender: event.tourYear.tour.gender,
          },
        };
      });

      const result = await Promise.all(promises);

      return result;
    } catch (error) {
      throw error;
    }
  }
}

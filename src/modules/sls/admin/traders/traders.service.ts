import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository, In, Not } from "typeorm";
import orderBy from "lodash.orderby";

import Events from "../../../../entities/sls/events.entity";
import Leagues from "../../../../entities/sls/leagues.entity";
// import Rounds from "../../../../entities/sls/rounds.entity";
import RoundHeats from "../../../../entities/sls/roundHeats.entity";
import Athletes from "../../../../entities/sls/athletes.entity";
import Scores from "../../../../entities/sls/scores.entity";
import EventParticipants from "../../../../entities/sls/eventParticipants.entity";
import EventRounds from "../../../../entities/sls/eventRounds.entity";
import ProjectionEventHeatOutcome from "../../../../entities/sls/projectionEventHeatOutcome.entity";
import ProjectionEventOutcome from "../../../../entities/sls/projectionEventOutcome.entity";
import PropBets from "../../../../entities/sls/propBets.entity";
import PlayerHeadToHeads from "../../../../entities/sls/playerHeadToHeads.entity";
import ProjectionEventPodiums from "../../../../entities/sls/projectionEventPodiums.entity";
import ProjectionEventShows from "../../../../entities/sls/projectionEventShows.entity";

import ClientProjectionEventOutcome from "../../../../entities/sls/clientProjectionEventOutcome.entity";
import ClientProjectionEventHeatOutcome from "../../../../entities/sls/clientProjectionEventHeatOutcome.entity";
import ClientPropBets from "../../../../entities/sls/clientPropBets.entity";
import ClientPlayerHeadToHeads from "../../../../entities/sls/clientPlayerHeadToHeads.entity";
import ClientProjectionEventPodiums from "../../../../entities/sls/clientProjectionEventPodiums.entity";
import ClientProjectionEventShows from "../../../../entities/sls/clientProjectionEventShows.entity";

import TraderScores from "./dto/traderScores.dto";
import TraderLiveScoresDto from "./dto/traderLiveScores.dto";
import EventSeedDto from "./dto/eventSeed.dto";

import * as leagueExceptions from "../../../../exceptions/league";
import * as eventExceptions from "../../../../exceptions/events";
import * as roundExceptions from "../../../../exceptions/rounds";
import * as eventRoundExceptions from "../../../../exceptions/eventRound";
import * as heatExceptions from "../../../../exceptions/heats";
// import * as athleteExceptions from "../../../../exceptions/athletes";

import { IParticipantReplacement } from "../../../../interfaces/participants";

import { RoundState, IAthlete } from "../../../../interfaces/sls";

import { RoundsMen } from "../../../../constants/sls";

import QueueService from "../../../system/queue/queue.service";

import {
  RoundStatus,
  HeatStatus,
  SportsTypes,
  EventStatus,
  AthleteStatus,
  OddMarkets,
  SportsDbSchema,
  Gender,
} from "../../../../constants/system";

@Injectable()
export default class TradersService {
  constructor(
    @InjectRepository(Leagues) private readonly leagueRepository: Repository<Leagues>,
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
              INSERT INTO ${SportsDbSchema.SLS}."clientProjectionEventOutcome"("eventId", "eventParticipantId", "position", "odds", "probability", "trueProbability", "hasModifiedProbability")
              SELECT "eventId", "eventParticipantId", "position", "odds", "probability", "trueProbability", "hasModifiedProbability" FROM ${SportsDbSchema.SLS}."projectionEventOutcome"
              WHERE ${SportsDbSchema.SLS}."projectionEventOutcome"."eventId" = '${eventId}' AND ${SportsDbSchema.SLS}."projectionEventOutcome"."position" = 1;
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
              INSERT INTO ${SportsDbSchema.SLS}."clientProjectionEventOutcome"("eventId", "eventParticipantId", "position", "odds", "probability", "trueProbability", "hasModifiedProbability")
              SELECT "eventId", "eventParticipantId", "position", "odds", "probability", "trueProbability", "hasModifiedProbability" FROM ${SportsDbSchema.SLS}."projectionEventOutcome"
              WHERE ${SportsDbSchema.SLS}."projectionEventOutcome"."eventId" = '${eventId}' AND ${SportsDbSchema.SLS}."projectionEventOutcome"."position" = 2;
            `);
            break;

          case OddMarkets.HEAT_PROJECTIONS:
            if (roundId) {
              // assumption here is that the heats have been published
              // client is trying to notify the client

              await this.queueService.notifyMarketPublishNotification({
                eventId,
                sportType: SportsTypes.SKATEBOARDING,
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
              INSERT INTO ${SportsDbSchema.SLS}."clientProjectionEventHeatOutcome"("eventId", "eventParticipantId", "roundHeatId", "position", "odds", "probability", "trueProbability", "hasModifiedProbability")
              SELECT "eventId", "eventParticipantId", "roundHeatId", "position", "odds", "probability", "trueProbability", "hasModifiedProbability" FROM ${SportsDbSchema.SLS}."projectionEventHeatOutcome"
              WHERE ${SportsDbSchema.SLS}."projectionEventHeatOutcome"."eventId" = '${eventId}' AND ${SportsDbSchema.SLS}."projectionEventHeatOutcome"."roundHeatId" = '${roundHeatId}';
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
              INSERT INTO ${SportsDbSchema.SLS}."clientPropBets"("eventId", "betId", "eventParticipantId", "proposition", "odds", "payout", "voided")
              SELECT "eventId", "betId", "eventParticipantId", "proposition", "odds", "payout", "voided" FROM ${SportsDbSchema.SLS}."propBets"
              WHERE ${SportsDbSchema.SLS}."propBets"."eventId" = '${eventId}';
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
              INSERT INTO ${SportsDbSchema.SLS}."clientPlayerHeadToHeads"("eventId", "eventParticipant1Id", "eventParticipant2Id", "eventParticipantWinnerId", "player1Position", "player2Position", "player1Odds", "player2Odds", "player1Probability", "player2Probability", "player1TrueProbability", "player2TrueProbability", "player1HasModifiedProbability", "player2HasModifiedProbability", "voided", "draw", "holdingPercentage")
              SELECT "eventId", "eventParticipant1Id", "eventParticipant2Id", "eventParticipantWinnerId", "player1Position", "player2Position", "player1Odds", "player2Odds", "player1Probability", "player2Probability", "player1TrueProbability", "player2TrueProbability", "player1HasModifiedProbability", "player2HasModifiedProbability", "voided", "draw", "holdingPercentage" FROM ${SportsDbSchema.SLS}."playerHeadToHeads"
              WHERE ${SportsDbSchema.SLS}."playerHeadToHeads"."eventId" = '${eventId}' AND ${SportsDbSchema.SLS}."playerHeadToHeads"."visible" = true;
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
                  INSERT INTO ${SportsDbSchema.SLS}."clientProjectionEventPodiums"("eventId", "eventParticipantId", "odds", "probability", "trueProbability", "hasModifiedProbability")
                  SELECT "eventId", "eventParticipantId", "odds", "probability", "trueProbability", "hasModifiedProbability" FROM ${SportsDbSchema.SLS}."projectionEventPodiums"
                  WHERE ${SportsDbSchema.SLS}."projectionEventPodiums"."eventId" = '${eventId}';
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
                  INSERT INTO ${SportsDbSchema.SLS}."clientProjectionEventShows"("eventId", "eventParticipantId", "odds", "probability", "trueProbability", "hasModifiedProbability")
                  SELECT "eventId", "eventParticipantId", "odds", "probability", "trueProbability", "hasModifiedProbability" FROM ${SportsDbSchema.SLS}."projectionEventShows"
                  WHERE ${SportsDbSchema.SLS}."projectionEventShows"."eventId" = '${eventId}';
                `);
            break;

          default:
            break;
        }

        if (projectionType !== OddMarkets.HEAT_PROJECTIONS)
          await this.queueService.notifyMarketPublishNotification({
            eventId,
            sportType: SportsTypes.SKATEBOARDING,
            market: projectionType,
          });
      },
    );

    return true;
  }

  async saveScores(scoresPayload: TraderScores): Promise<boolean> {
    await this.scoresRepository.manager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        for await (const score of scoresPayload.items) {
          try {
            const league = await this.leagueRepository.findOne({
              where: {
                name: score.leagueName,
                gender: score.leagueGender,
              },
              select: {
                id: true,
                gender: true,
                years: {
                  id: true,
                  year: true,
                },
              },
              relations: ["years"],
            });
            if (!league)
              throw leagueExceptions.leagueNotFound({
                name: score.leagueName,
                gender: score.leagueGender,
              });

            const year = league.years.find((leagueYear) => leagueYear.year === score.leagueYear);
            const event = await this.eventsRepository.findOne({
              where: {
                name: score.eventName,
                leagueYearId: year.id,
              },
              select: {
                id: true,
                name: true,
              },
            });
            if (!event)
              throw eventExceptions.eventNotFound({
                eventName: score.eventName,
                leagueYearId: year.id,
              });

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
            if (!eventRound)
              throw roundExceptions.roundNotFound({
                roundName: score.roundName,
                eventId: event.id,
              });
            const { round } = eventRound;

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
            if (!roundHeat)
              throw heatExceptions.heatNotFound({
                event: event.name,
                round: round.name,
                eventId: event.id,
                roundId: round.id,
                heatNo: score.heatNumber,
              });

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
                  gender: league.gender,
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
                  seedNo: 0,
                  baseRoundScore: 0,
                  baseRunScore: 0,
                  baseTrickScore: 0,
                  trickCompletion: 0,
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
                  roundSeed: eventParticipant.seedNo,
                  lineScore1: score.lineScore1,
                  lineScore2: score.lineScore2,
                  roundScore: score.roundScore,
                  trick1Score: score.trick1Score,
                  trick2Score: score.trick2Score,
                  trick3Score: score.trick3Score,
                  trick4Score: score.trick4Score,
                  trick5Score: score.trick5Score,
                  trick6Score: score.trick6Score,
                  notes: score.notes,
                  // FIXME: need to figure out how to handle heat position here
                },
              );
            } else {
              await transactionalEntityManager.save(
                this.scoresRepository.create({
                  athleteId: athlete.id,
                  eventId: event.id,
                  roundSeed: eventParticipant.seedNo,
                  roundHeatId: roundHeat.id,
                  lineScore1: score.lineScore1,
                  lineScore2: score.lineScore2,
                  roundScore: score.roundScore,
                  trick1Score: score.trick1Score,
                  trick2Score: score.trick2Score,
                  trick3Score: score.trick3Score,
                  trick4Score: score.trick4Score,
                  trick5Score: score.trick5Score,
                  trick6Score: score.trick6Score,
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
          lineScore1: true,
          lineScore2: true,
          roundScore: true,
          trick1Score: true,
          trick2Score: true,
          trick3Score: true,
          trick4Score: true,
          trick5Score: true,
          trick6Score: true,
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

    return {
      heat,
      scores,
    };
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
          lineScore1: true,
          lineScore2: true,
          roundScore: true,
          trick1Score: true,
          trick2Score: true,
          trick3Score: true,
          trick4Score: true,
          trick5Score: true,
          trick6Score: true,
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
      relations: ["event.leagueYear.league", "athlete"],
      select: {
        id: true,
        seedNo: true,
        baseRoundScore: true,
        baseRunScore: true,
        baseTrickScore: true,
        trickCompletion: true,
        notes: true,
        status: true,
        event: {
          id: true,
          name: true,
          eventStatus: true,
          eventLocation: true,
          leagueYear: {
            id: true,
            leagueId: true,
            year: true,
            league: {
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

          // need to know the current round so you can get the next round
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
              startDate: true,
              endDate: true,
              heatStatus: true,
              round: {
                id: true,
                roundNo: true,
              },
            },
            relations: ["round"],
          });

          if (roundHeat.heatStatus === HeatStatus.UPCOMING && payload.hasHeatEnded)
            throw heatExceptions.markHeatLiveBeforeEndingError;

          if (roundHeat.heatStatus === HeatStatus.COMPLETED && payload.hasHeatEnded)
            throw heatExceptions.heatAlreadyEnded;

          const scoresToArchive = [];
          const scoresPayload = payload.athletes
            .map((item) => {
              if (item?.athleteId) {
                return {
                  id: item.id || undefined,
                  eventId,
                  athleteId: item.athleteId,
                  roundHeatId: heatId,
                  roundSeed: item.seed,
                  lineScore1: item.lineScore1,
                  lineScore2: item.lineScore2,
                  roundScore: item.roundScore,
                  trick1Score: item.trick1Score,
                  trick2Score: item.trick2Score,
                  trick3Score: item.trick3Score,
                  trick4Score: item.trick4Score,
                  trick5Score: item.trick5Score,
                  trick6Score: item.trick6Score,
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

          if (scoresPayload.length) await transactionalEntityManager.save(Scores, scoresPayload);

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
              relations: ["leagueYear.league"],
              select: {
                id: true,
                leagueYear: {
                  id: true,
                  leagueId: true,
                  league: {
                    id: true,
                    gender: true,
                  },
                },
              },
            });

            let shouldRunSim: boolean = false;

            // eslint-disable-next-line unicorn/prefer-ternary
            if (event.leagueYear.league.gender === Gender.FEMALE) {
              // womens
              shouldRunSim = await this.handleSaveWomensLiveScore(
                heatWinner?.athleteId,
                eventId,
                transactionalEntityManager,
              );
            } else {
              // mens
              shouldRunSim = await this.handleSaveMensLiveScore(
                heatWinner?.athleteId,
                roundHeat,
                eventId,
                transactionalEntityManager,
              );
            }

            if (payload.hasHeatEnded && shouldRunSim)
              await this.queueService.notifyEventUpdate({
                eventId,
                delaySeconds: 10,
                sportType: SportsTypes.SKATEBOARDING,
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

  async saveEventSeed(payload: EventSeedDto) {
    await this.eventParticipantsRepository.manager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        try {
          // const affectedEventIds = [];
          const insertPayload = [];
          const replacementList: IParticipantReplacement[] = [];
          // const affectedEventParticipantsIds = [];

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
            const key = `${item.eventName}_${item.gender}_${item.leagueYear}`;
            if (!uniqueEventObj[key])
              uniqueEventObj[key] = {
                name: item.eventName,
                gender: item.gender,
                year: +item.leagueYear,
              };
          });

          // loop through and find the unique events
          const events = await Promise.all(
            Object.values(uniqueEventObj).map(async (row) => {
              try {
                const event = await this.eventsRepository.findOne({
                  where: {
                    name: row.name,
                    leagueYear: {
                      league: {
                        gender: row.gender,
                      },
                      year: row.year,
                    },
                    isActive: true,
                    isArchived: false,
                  },
                  relations: ["leagueYear.league"],
                  select: {
                    id: true,
                    name: true,
                    leagueYear: {
                      leagueId: true,
                      year: true,
                      league: {
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

              // const event = events.find((eventItem) => eventItem.leagueYear.year === item.leagueYear);
              const event = events.find((eventRow) => {
                const eventKey = `${eventRow.name}_${eventRow.leagueYear.league.gender}_${eventRow.leagueYear.year}`;
                const itemKey = `${item.eventName}_${item.gender}_${item.leagueYear}`;

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
                    baseRoundScore: item.baseRoundScore,
                    baseRunScore: item.baseRunScore,
                    baseTrickScore: item.baseTrickScore,
                    trickCompletion: item.trickCompletion,
                    notes: item.notes,
                    status: item.playerStatus,
                    isActive: item.seed > 0 && isActiveParticipant,
                    isArchived: item.seed <= 0 || !isActiveParticipant,
                  },
                );
                // affectedEventParticipantsIds.push(existingEventParticipant.id);
              } else {
                // insert
                const eventParticipant = this.eventParticipantsRepository.create({
                  eventId: event.id,
                  athleteId: athlete.id,
                  seedNo: item.seed,
                  baseRoundScore: item.baseRoundScore,
                  baseRunScore: item.baseRunScore,
                  baseTrickScore: item.baseTrickScore,
                  trickCompletion: item.trickCompletion,
                  notes: item.notes,
                  status: item.playerStatus,
                  isActive: item.seed > 0 && isActiveParticipant,
                  isArchived: item.seed <= 0 || !isActiveParticipant,
                });
                insertPayload.push(eventParticipant);
                // affectedEventParticipantsIds.push(eventParticipant.id);
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

          try {
            // mark every participant that is not affected as inactive
            // if (affectedEventParticipantsIds.length)
            //   await transactionalEntityManager.update(
            //     EventParticipants,
            //     {
            //       id: Not(In(affectedEventParticipantsIds)),
            //     },
            //     {
            //       isActive: false,
            //       isArchived: true,
            //     },
            //   );

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

            // at the same time also check if the event for which these seeds are inserted
            // has the heat 1 of round 1 setup or not
            // if it is a new round then it will not have players, insert these players
            if (events.length) {
              const scoresPayload = [];
              for await (const event of events) {
                try {
                  const eventId: string = event.id;
                  const eventScores = await transactionalEntityManager.count(Scores, {
                    where: {
                      eventId,
                    },
                    select: {
                      isActive: true,
                    },
                  });

                  const openingRound: {
                    [key: number]: number[];
                  } =
                    event.leagueYear.league.gender === Gender.MALE
                      ? {
                          1: [5, 9, 13, 17, 18],
                          2: [3, 7, 11, 15, 20],
                          3: [2, 6, 10, 14, 21],
                          4: [4, 8, 12, 16, 19],
                        }
                      : {
                          1: [1, 2, 3, 4, 5, 6],
                        };

                  const eventRound = await transactionalEntityManager.findOne(EventRounds, {
                    where: {
                      eventId,
                      round: {
                        roundNo: 1,
                      },
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

                  if (!eventRound)
                    throw eventRoundExceptions.eventRoundNotFound({ EventId: eventId });

                  // for sls mens, seed one is automatically promoted to final round
                  let finalRoundHeat: EventRounds;
                  if (event.leagueYear.league.gender === Gender.MALE) {
                    finalRoundHeat = await transactionalEntityManager.findOne(EventRounds, {
                      where: {
                        eventId,
                        round: {
                          roundNo: 2,
                          heats: {
                            eventId,
                            heatNo: 1,
                          },
                        },
                      },
                      select: {
                        id: true,
                        roundId: true,
                        round: {
                          id: true,
                          roundNo: true,
                          heats: {
                            id: true,
                          },
                        },
                      },
                      relations: ["round.heats"],
                    });
                  }

                  // fetch all round heats for the current event for round 1
                  const heats = await transactionalEntityManager.find(RoundHeats, {
                    where: {
                      eventId,
                      roundId: eventRound.round.id,
                    },
                    select: {
                      id: true,
                      heatNo: true,
                    },
                  });

                  // open markets for all round 1 heats
                  // open markets for the event as well
                  await Promise.all([
                    transactionalEntityManager.update(
                      RoundHeats,
                      {
                        id: In(heats.map((heat) => heat.id)),
                      },
                      {
                        isHeatWinnerMarketOpen: true,
                      },
                    ),
                    transactionalEntityManager.update(
                      Events,
                      {
                        id: eventId,
                      },
                      {
                        isEventWinnerMarketOpen: true,
                      },
                    ),
                  ]);

                  // this event already has heats, nothing to do here
                  // if (eventScores > 0) continue;
                  if (eventScores > 0) {
                    // instead of not doing anything here, the issue that occurs is the seeds can change
                    // in which case a lot changes so clear the data only if round 1 is not completed
                    if ([RoundStatus.COMPLETED].includes(eventRound.roundStatus)) {
                      // if it is completed that means that the event has already progressed and nothing to do here
                      continue;
                    } else {
                      // clearing all scores for the event so the data can be reinserted
                      await transactionalEntityManager.delete(Scores, {
                        eventId,
                        roundHeatId: In(heats.map((heat) => heat.id)),
                      });
                    }
                  }

                  // there are no heats, which means that the event seed needs to be inserted into round 1 for all heats
                  const eventParticipants = await transactionalEntityManager.find(
                    EventParticipants,
                    {
                      where: {
                        eventId,
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
                    const heat = heats.find((heatItem) => {
                      return heatItem.heatNo === +key;
                    });

                    const seeds: number[] = openingRound[key];

                    const participants = eventParticipants.filter((participant) =>
                      seeds.includes(participant.seedNo),
                    );

                    scorePayload.push(
                      ...participants.map((eventParticipant) =>
                        this.scoresRepository.create({
                          eventId,
                          roundHeatId: heat.id,
                          athleteId: eventParticipant.athleteId,
                          roundSeed: eventParticipant.seedNo,
                        }),
                      ),
                    );
                  });

                  if (
                    finalRoundHeat?.round?.heats?.[0]?.id &&
                    event.leagueYear.league.gender === Gender.MALE
                  ) {
                    const seedOneRow = eventParticipants.find((row) => row.seedNo === 1);

                    // check if there is already a row for the given athelte in that heat
                    const existingSeedOneScore = await transactionalEntityManager.findOne(Scores, {
                      where: {
                        eventId,
                        athleteId: seedOneRow.athleteId,
                        roundHeatId: finalRoundHeat?.round?.heats?.[0]?.id,
                      },
                      select: {
                        id: true,
                      },
                    });

                    if (seedOneRow)
                      scorePayload.push(
                        this.scoresRepository.create({
                          id: existingSeedOneScore?.id,
                          eventId,
                          roundHeatId: finalRoundHeat?.round?.heats?.[0]?.id,
                          athleteId: seedOneRow.athleteId,
                          roundSeed: seedOneRow.seedNo,
                        }),
                      );
                  }

                  // chunk athletes into groups of 6
                  /* const CHUNK_SIZE = 6;
                  const participantsSplit = chunk(eventParticipants, CHUNK_SIZE);
                  const scores: Scores[] = []; */

                  // loop through each chunk and add them to the heat
                  // if a heat does not exist for the round then create it

                  /* const affectedHeatIds = [];
                  const promises = participantsSplit.map(async (participants, heatNo) => {
                    try {
                      let heat = await transactionalEntityManager.findOne(RoundHeats, {
                        where: {
                          eventId,
                          roundId: eventRound.round.id,
                          heatNo: heatNo + 1,
                        },
                        select: {
                          id: true,
                        },
                      });

                      if (!heat) {
                        // heat does not exist, add a new one
                        const newHeat = this.heatsRepository.create({
                          heatName: "Heat",
                          eventId,
                          roundId: eventRound.round.id,
                          heatNo: heatNo + 1,
                          heatStatus: HeatStatus.UPCOMING,
                          startDate: null,
                          endDate: null,
                        });

                        heat = await transactionalEntityManager.save(newHeat);
                      }

                      scores.push(
                        ...participants.map((participant) =>
                          this.scoresRepository.create({
                            eventId,
                            roundHeatId: heat.id,
                            athleteId: participant.athleteId,
                            roundSeed: participant.seedNo,
                          }),
                        ),
                      );

                      affectedHeatIds.push(heat.id);

                      return true;
                    } catch (error) {
                      throw error;
                    }
                  });
                  await Promise.all(promises);

                  // find all round 1 heats that were not affected
                  const nonAffectedRound1Heats = await transactionalEntityManager.find(RoundHeats, {
                    where: {
                      id: Not(In(affectedHeatIds)),
                      eventId,
                      roundId: eventRound.round.id,
                    },
                    select: {
                      id: true,
                    },
                  });

                  const nonAffectedRound1HeatsIds = nonAffectedRound1Heats.map((v) => v.id);

                  // clear scores and heats that are not related to this event anymore if they exist
                  if (nonAffectedRound1HeatsIds.length) {
                    await transactionalEntityManager.delete(Scores, {
                      eventId,
                      roundHeatId: In(nonAffectedRound1HeatsIds),
                    });
                    await transactionalEntityManager.delete(RoundHeats, {
                      eventId,
                      id: In(nonAffectedRound1HeatsIds),
                    });
                  }

                  if (scores) await transactionalEntityManager.save(scores); */
                  scoresPayload.push(scorePayload);
                } catch (error) {
                  throw error;
                }
              }

              const flattenedPayload = scoresPayload.flat();
              if (flattenedPayload.length) await transactionalEntityManager.save(flattenedPayload);
            }
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

          if (events.length)
            await Promise.all(
              events.map((event) =>
                this.queueService.notifyEventUpdate({
                  eventId: event.id,
                  delaySeconds: 10,
                  sportType: SportsTypes.SKATEBOARDING,
                }),
              ),
            );
        } catch (transactionError) {
          throw transactionError;
        }
      },
    );

    return true;
  }

  // for dev only
  async resetEvent(eventId: string /* baseReset: boolean = false */) {
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

        await Promise.all([
          transactionalEntityManager.delete(EventParticipants, {
            eventId,
          }),
          /* transactionalEntityManager.delete(RoundHeats, {
            eventId,
            id: Not(In([round1Heat1.id, ...otherRoundHeatIds])),
          }), */
        ]);

        return true;
      },
    );

    return result;
  }

  private async handleSaveWomensLiveScore(
    heatWinnerId: string,
    eventId: string,
    transactionalEntityManager: EntityManager,
  ): Promise<boolean> {
    try {
      // womens only has a single round so ending the round ends the event as well

      await Promise.all([
        transactionalEntityManager.update(
          EventRounds,
          { eventId },
          {
            roundStatus: RoundStatus.COMPLETED,
            endDate: new Date().toISOString(),
          },
        ),
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

      return false;
    } catch (error) {
      throw error;
    }
  }

  private async handleSaveMensLiveScore(
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
        [RoundsMen.KNOCK_OUT_ROUND]: null,
        [RoundsMen.FINALS]: null,
      };

      let count = 1;
      eventRounds.forEach((eventRound) => {
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
        .map((key): RoundState<RoundsMen> => roundConfig[+key])
        .filter(Boolean);

      // get the current round
      const currentRoundItem = roundsMap.find((item) => item.status === RoundStatus.LIVE);

      // get the next round, this will be the first round that is upcoming or next
      const nextRoundItem = roundsMap.find((item) =>
        [RoundStatus.UPCOMING, RoundStatus.NEXT].includes(item.status),
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
        currentRoundHeat.heatNo === 4 &&
        [RoundsMen.KNOCK_OUT_ROUND].includes(currentRoundItem.eventRoundNo)
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
            roundScore: true,
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
        order: {
          scores: {
            roundScore: "DESC",
          },
        },
      });

      const scoresPayload: Scores[] = [];

      if (
        currentRoundItem.eventRoundNo === RoundsMen.KNOCK_OUT_ROUND &&
        currentRoundItem.status !== RoundStatus.COMPLETED
      ) {
        const seedOneRow = await this.eventParticipantsRepository.findOne({
          where: {
            eventId,
            seedNo: 1,
            isActive: true,
            isArchived: false,
          },
          select: {
            athleteId: true,
            seedNo: true,
          },
        });

        const allScores: IAthlete[] = [];

        // seed one is automatically promoted to final round
        const finalRoundPlayers: IAthlete[] = [
          {
            athleteId: seedOneRow.athleteId,
            seedNo: seedOneRow.seedNo,
            roundScore: 0,
          },
        ];
        // pick winner of each heat for starters
        currentRoundHeats.map((roundHeatItem) => {
          roundHeatItem.scores.forEach((score, position) => {
            // heat winner added to winner array
            // everyone else added to a different array in order to calculate
            // second highest score among all heats
            if (position + 1 === 1 && roundHeatItem.heatStatus === HeatStatus.COMPLETED)
              finalRoundPlayers.push({
                athleteId: score.athleteId,
                seedNo: score.athlete.participant.seedNo,
                roundScore: +score.roundScore,
              });
            else
              allScores.push({
                athleteId: score.athleteId,
                seedNo: score.athlete.participant.seedNo,
                roundScore: +score.roundScore,
              });
          });
        });

        // need to pick second highest round score among all heats
        // which does not include already promoted participants
        const orderedAthletes: IAthlete[] = orderBy(allScores, ["roundScore"], "desc");
        finalRoundPlayers.push(orderedAthletes[0]);

        const nextRoundHeat = nextRound.round.heats.find((heat) => {
          return heat.heatNo === 1;
        });

        finalRoundPlayers.forEach((rowScore: IAthlete, position: number) => {
          scoresPayload.push(
            this.scoresRepository.create({
              eventId,
              roundHeatId: nextRoundHeat.id,
              athleteId: rowScore.athleteId,
              roundSeed: position + 1,
            }),
          );
        });

        // delete existing next round data and re-insert all of it
        await transactionalEntityManager.delete(Scores, {
          roundHeatId: In(nextRound.round.heats.map((rowHeat) => rowHeat.id)),
          eventId,
        });
      }

      if (scoresPayload.length) await transactionalEntityManager.save(Scores, scoresPayload);

      return true;
    } catch (error) {
      throw error;
    }
  }
}

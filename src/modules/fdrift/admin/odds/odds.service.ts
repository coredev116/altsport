import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository, In, ILike } from "typeorm";

import EventParticipant from "../../../../entities/fdrift/eventParticipants.entity";
import ProjectionEventHeatOutcome from "../../../../entities/fdrift/projectionEventHeatOutcome.entity";
import ProjectionEventOutcome from "../../../../entities/fdrift/projectionEventOutcome.entity";
import PlayerHeadToHeads from "../../../../entities/fdrift/playerHeadToHeads.entity";
import RoundHeats from "../../../../entities/fdrift/roundHeats.entity";

import ClientProjectionEventHeatOutcome from "../../../../entities/fdrift/clientProjectionEventHeatOutcome.entity";
import ClientProjectionEventOutcome from "../../../../entities/fdrift/clientProjectionEventOutcome.entity";
import ClientPlayerHeadToHeads from "../../../../entities/fdrift/clientPlayerHeadToHeads.entity";

import { UpdateEventOddDto, UpdateEventHeatOddDto } from "./dto/odds.dto";
import {
  createPlayerHeadToHeadsDto,
  updatePlayerHeadToHeadsDto,
  updatePlayerHeadToHeadsPayoutDto,
} from "../odds/dto/playerHeadToHeads.dto";

import { PlayerHeadToHeadsPageResponse } from "./schemas/response/playerHeadToHeads.response";

import { API_SORT_ORDER } from "../../../../constants/system";
import { FDRIFTPublicStatsSortColumns } from "../../../../constants/fdrift";

import * as eventParticipantExceptions from "../../../../exceptions/eventParticipants";
import * as playerHeadToHeadsExceptions from "../../../../exceptions/playerHeadToHeads";
import * as roundHeatExceptions from "../../../../exceptions/heats";

@Injectable()
export class OddsService {
  constructor(
    @InjectRepository(ProjectionEventOutcome)
    private readonly projectionEventOutcomeRepository: Repository<ProjectionEventOutcome>,
    @InjectRepository(ProjectionEventHeatOutcome)
    private readonly projectionEventHeatOutcomeRepository: Repository<ProjectionEventHeatOutcome>,
    @InjectRepository(EventParticipant)
    private readonly eventParticipantRepository: Repository<EventParticipant>,
    @InjectRepository(PlayerHeadToHeads)
    private readonly playerHeadToHeadsRepository: Repository<PlayerHeadToHeads>,
    @InjectRepository(RoundHeats)
    private readonly roundHeatsRepository: Repository<RoundHeats>,

    @InjectRepository(ClientProjectionEventOutcome)
    private readonly clientProjectionEventOutcomeRepository: Repository<ClientProjectionEventOutcome>,
    @InjectRepository(ClientProjectionEventHeatOutcome)
    private readonly clientProjectionEventHeatOutcomeRepository: Repository<ClientProjectionEventHeatOutcome>,
    @InjectRepository(ClientPlayerHeadToHeads)
    private readonly clientPlayerHeadToHeadsRepository: Repository<ClientPlayerHeadToHeads>,
  ) {}

  public async fetchEventOdds(
    eventId: string,
    position: number,
  ): Promise<ProjectionEventOutcome[]> {
    const data = await this.projectionEventOutcomeRepository.find({
      where: {
        eventId,
        position,
      },
      select: {
        id: true,
        eventParticipantId: true,
        position: true,
        odds: true,
        probability: true,
        trueProbability: true,
        hasModifiedProbability: true,
        createdAt: true,
        updatedAt: true,
        participant: {
          athleteId: true,
          seedNo: true,
          athlete: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
            gender: true,
            nationality: true,
            stance: true,
          },
        },
      },
      relations: ["participant.athlete"],
      order: {
        updatedAt: "DESC",
      },
    });

    return data;
  }

  public async fetchClientEventOdd(
    eventId: string,
    position: number,
  ): Promise<ClientProjectionEventOutcome> {
    const data = await this.clientProjectionEventOutcomeRepository.findOne({
      where: {
        eventId,
        position,
      },
      select: {
        updatedAt: true,
      },
      order: {
        updatedAt: "DESC",
      },
    });

    return data;
  }

  public async fetchHeatOdds(eventId: string): Promise<ProjectionEventHeatOutcome[]> {
    const data = await this.projectionEventHeatOutcomeRepository.find({
      select: {
        id: true,
        eventId: true,
        eventParticipantId: true,
        roundHeatId: true,
        odds: true,
        probability: true,
        trueProbability: true,
        hasModifiedProbability: true,
        createdAt: true,
        updatedAt: true,
        participant: {
          athleteId: true,
          seedNo: true,
          athlete: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
            gender: true,
            nationality: true,
            stance: true,
          },
        },
        heat: {
          id: true,
          heatName: true,
          heatNo: true,
          isHeatWinnerMarketVoided: true,
          isHeatWinnerMarketOpen: true,
          winnerAthleteId: true,
          heatStatus: true,
          round: {
            id: true,
            name: true,
            roundNo: true,
            eventRounds: {
              id: true,
              roundId: true,
              roundStatus: true,
            },
          },
        },
      },
      where: {
        eventId,
        participant: {
          eventId,
        },
        heat: {
          eventId,
          round: {
            eventRounds: {
              eventId,
            },
          },
        },
      },
      relations: ["heat.round.eventRounds", "participant.athlete"],
      order: {
        updatedAt: "DESC",
      },
    });

    return data;
  }

  public async fetchClientHeatOdds(eventId: string): Promise<ClientProjectionEventHeatOutcome[]> {
    const data = await this.clientProjectionEventHeatOutcomeRepository.find({
      select: {
        id: true,
        updatedAt: true,
        createdAt: true,
        roundHeatId: true,
      },
      where: {
        eventId,
        isActive: true,
        isArchived: false,
      },
    });

    return data;
  }

  async updateRoundHeatVoid(eventId: string, heatId: string) {
    try {
      const heat = await this.roundHeatsRepository.findOne({
        where: {
          id: heatId,
          eventId,
          isActive: true,
          isArchived: false,
        },
        select: {
          id: true,
        },
      });
      if (!heat) throw roundHeatExceptions.heatNotFound();

      if (heat.isHeatWinnerMarketVoided === true) throw roundHeatExceptions.heatAlreadyVoided;

      await this.roundHeatsRepository.update(
        {
          id: heatId,
        },
        {
          isHeatWinnerMarketVoided: true,
          isHeatWinnerMarketOpen: false,
          voidDate: new Date().toISOString(),
        },
      );

      return true;
    } catch (error) {
      throw error;
    }
  }

  async updateEventOdd(payload: UpdateEventOddDto, eventId: string) {
    try {
      await this.projectionEventOutcomeRepository.manager.transaction(
        async (transactionalEntityManager: EntityManager) => {
          const transactionResult = await Promise.allSettled(
            payload.items.map((item) =>
              transactionalEntityManager.update(
                ProjectionEventOutcome,
                {
                  id: item.id,
                  eventId,
                },
                {
                  id: item.id,
                  odds: item.odds,
                  probability: item.probability,
                  hasModifiedProbability: item.hasModifiedProbability,
                },
              ),
            ),
          );

          const errorItem = transactionResult.find(
            (resultItem) => resultItem.status === "rejected",
          ) as PromiseRejectedResult;
          if (errorItem) {
            // get the first error that was thrown in the loop and throw that error
            throw errorItem?.reason;
          }

          /* for await (const item of payload.items) {
            const eventOdd = await transactionalEntityManager.findOne(ProjectionEventOutcome, {
              where: {
                id: item.id,
              },
            });
            if (!eventOdd)
              throw projectionEventOutcomeExceptions.projectionEventOutcomeNotFound(payload);

            if (item.probability) eventOdd.probability = item.probability;
            if (item.odds) eventOdd.odds = item.odds;

            await transactionalEntityManager.save(eventOdd);
          } */
        },
      );

      return true;
    } catch (error) {
      throw error;
    }
  }

  async updateEventHeatOdd(payload: UpdateEventHeatOddDto, eventId: string) {
    try {
      await this.projectionEventHeatOutcomeRepository.manager.transaction(
        async (transactionalEntityManager: EntityManager) => {
          const transactionResult = await Promise.allSettled(
            payload.items.map((item) =>
              transactionalEntityManager.update(
                ProjectionEventHeatOutcome,
                {
                  id: item.id,
                  eventId,
                },
                {
                  id: item.id,
                  odds: item.odds,
                  probability: item.probability,
                  hasModifiedProbability: item.hasModifiedProbability,
                },
              ),
            ),
          );

          const errorItem = transactionResult.find(
            (resultItem) => resultItem.status === "rejected",
          ) as PromiseRejectedResult;
          if (errorItem) {
            // get the first error that was thrown in the loop and throw that error
            throw errorItem?.reason;
          }
          /* for await (const item of payload.items) {
            const eventOdd = await transactionalEntityManager.findOne(ProjectionEventHeatOutcome, {
              where: {
                id: item.id,
              },
            });
            if (!eventOdd)
              throw projectionEventHeatOutcomeExceptions.projectionEventHeatOutcomeNotFound(
                payload,
              );

            if (item.probability) eventOdd.probability = item.probability;
            if (item.odds) eventOdd.odds = item.odds;

            await transactionalEntityManager.save(eventOdd);
          } */
        },
      );

      return true;
    } catch (error) {
      throw error;
    }
  }

  async fetchPlayerHeadToHeads(eventId: string): Promise<PlayerHeadToHeads[]> {
    const playerHeadToHeads = await this.playerHeadToHeadsRepository.find({
      where: {
        eventId,
        visible: true,
        isActive: true,
        isArchived: false,
      },
      relations: [
        "eventParticipant1.athlete",
        "eventParticipant2.athlete",
        "eventParticipantWinner.athlete",
      ],
      select: {
        id: true,
        eventId: true,
        eventParticipant1Id: true,
        eventParticipant2Id: true,
        player1Position: true,
        player1Odds: true,
        player2Position: true,
        player2Odds: true,
        player1Probability: true,
        player2Probability: true,
        player1TrueProbability: true,
        player2TrueProbability: true,
        eventParticipantWinnerId: true,
        player1HasModifiedProbability: true,
        player2HasModifiedProbability: true,
        voided: true,
        draw: true,
        holdingPercentage: true,
        createdAt: true,
        updatedAt: true,
        eventParticipant1: {
          id: true,
          athleteId: true,
          seedNo: true,
          athlete: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
            nationality: true,
            stance: true,
          },
        },
        eventParticipant2: {
          id: true,
          athleteId: true,
          seedNo: true,
          athlete: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
            nationality: true,
            stance: true,
          },
        },
        eventParticipantWinner: {
          id: true,
          athleteId: true,
          seedNo: true,
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
      order: {
        voided: "ASC",
      },
    });

    return playerHeadToHeads;
  }

  async fetchPlayerHeadToHeadsPagination(
    eventId: string,
    page: number = 1,
    athleteQuery?: string,
    sortColumnName?: FDRIFTPublicStatsSortColumns,
    sortOrder?: API_SORT_ORDER,
  ): Promise<PlayerHeadToHeadsPageResponse> {
    const pageSize: number = 10;
    const skip: number = (page - 1) * pageSize;
    const limit: number = pageSize;

    let whereQuery: any = {
      eventId,
      visible: true,
      isActive: true,
      isArchived: false,
    };

    if (athleteQuery)
      whereQuery = [
        {
          ...whereQuery,
          eventParticipant1: {
            athlete: {
              firstName: ILike(`%${athleteQuery}%`),
            },
          },
        },
        {
          ...whereQuery,
          eventParticipant1: {
            athlete: {
              lastName: ILike(`%${athleteQuery}%`),
            },
          },
        },
        {
          ...whereQuery,
          eventParticipant2: {
            athlete: {
              firstName: ILike(`%${athleteQuery}%`),
            },
          },
        },
        {
          ...whereQuery,
          eventParticipant2: {
            athlete: {
              lastName: ILike(`%${athleteQuery}%`),
            },
          },
        },
      ];

    let query: any = {
      where: whereQuery,
      relations: [
        "eventParticipant1.athlete",
        "eventParticipant2.athlete",
        "eventParticipantWinner.athlete",
      ],
      select: {
        id: true,
        eventId: true,
        eventParticipant1Id: true,
        eventParticipant2Id: true,
        player1Position: true,
        player1Odds: true,
        player2Position: true,
        player2Odds: true,
        player1Probability: true,
        player2Probability: true,
        player1TrueProbability: true,
        player2TrueProbability: true,
        eventParticipantWinnerId: true,
        player1HasModifiedProbability: true,
        player2HasModifiedProbability: true,
        voided: true,
        draw: true,
        holdingPercentage: true,
        eventParticipant1: {
          id: true,
          athleteId: true,
          seedNo: true,
          athlete: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
            nationality: true,
            stance: true,
          },
        },
        eventParticipant2: {
          id: true,
          athleteId: true,
          seedNo: true,
          athlete: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
            nationality: true,
            stance: true,
          },
        },
        eventParticipantWinner: {
          id: true,
          athleteId: true,
          seedNo: true,
          athlete: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
            nationality: true,
            stance: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
      skip,
      take: limit,
    };

    if (sortColumnName && sortOrder) {
      query = {
        ...query,
        order: {
          [sortColumnName]: sortOrder,
        },
      };
    }

    const playerHeadToHeads = await this.playerHeadToHeadsRepository.find(query);
    const countQuery = query;
    delete countQuery.skip;
    delete countQuery.take;
    const total = await this.playerHeadToHeadsRepository.count(countQuery);

    const parsedResult = playerHeadToHeads.map((row) => {
      return {
        id: row.id,
        eventId: row.eventId,
        voided: row.voided,
        draw: row.draw,
        holdingPercentage: +row.holdingPercentage,
        eventParticipant1: {
          id: row.eventParticipant1.id,
          position: row.player1Position,
          odds: +Number(row.player1Odds).toFixed(2),
          probability: +Number(row.player1Probability).toFixed(2),
          trueProbability: +Number(row.player1TrueProbability).toFixed(2),
          hasModifiedProbability: row.player1HasModifiedProbability,
          athlete: {
            id: row.eventParticipant1.athlete.id,
            firstName: row.eventParticipant1.athlete.firstName,
            middleName: row.eventParticipant1.athlete.middleName,
            lastName: row.eventParticipant1.athlete.lastName,
            nationality: row.eventParticipant1.athlete.nationality,
            stance: row.eventParticipant1.athlete.stance,
            seedNo: row.eventParticipant1.seedNo,
          },
        },
        eventParticipant2: {
          id: row.eventParticipant2.id,
          position: row.player2Position,
          odds: +Number(row.player2Odds).toFixed(2),
          probability: +Number(row.player2Probability).toFixed(2),
          trueProbability: +Number(row.player2TrueProbability).toFixed(2),
          hasModifiedProbability: row.player2HasModifiedProbability,
          athlete: {
            id: row.eventParticipant2.athlete.id,
            firstName: row.eventParticipant2.athlete.firstName,
            middleName: row.eventParticipant2.athlete.middleName,
            lastName: row.eventParticipant2.athlete.lastName,
            nationality: row.eventParticipant2.athlete.nationality,
            stance: row.eventParticipant2.athlete.stance,
            seedNo: row.eventParticipant2.seedNo,
          },
        },
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        winnerParticipantId: row.eventParticipantWinnerId,
      };
    });

    return {
      data: parsedResult,
      total: Math.round(total / pageSize),
      page,
    };
  }

  async getLastUpdatedPlayerHeadToHead(eventId: string): Promise<PlayerHeadToHeads> {
    const playerHeadToHead = await this.playerHeadToHeadsRepository.findOne({
      where: {
        eventId,
        visible: true,
        isActive: true,
        isArchived: false,
      },
      select: {
        updatedAt: true,
      },
      order: {
        updatedAt: "DESC",
      },
    });

    return playerHeadToHead;
  }

  async getLastUpdatedPlayerHeadToHeadPage(
    eventId: string,
    athleteQuery?: string,
  ): Promise<PlayerHeadToHeads> {
    let whereQuery: any = {
      eventId,
      visible: true,
      isActive: true,
      isArchived: false,
    };

    if (athleteQuery)
      whereQuery = [
        {
          ...whereQuery,
          eventParticipant1: {
            athlete: {
              firstName: ILike(`%${athleteQuery}%`),
            },
          },
        },
        {
          ...whereQuery,
          eventParticipant1: {
            athlete: {
              lastName: ILike(`%${athleteQuery}%`),
            },
          },
        },
        {
          ...whereQuery,
          eventParticipant2: {
            athlete: {
              firstName: ILike(`%${athleteQuery}%`),
            },
          },
        },
        {
          ...whereQuery,
          eventParticipant2: {
            athlete: {
              lastName: ILike(`%${athleteQuery}%`),
            },
          },
        },
      ];

    const query: any = {
      where: whereQuery,
      select: {
        id: true,
        updatedAt: true,
      },
      order: {
        updatedAt: "DESC",
      },
    };

    const result = await this.playerHeadToHeadsRepository.findOne(query);
    return result;
  }

  async fetchClientPlayerHeadToHead(eventId: string): Promise<ClientPlayerHeadToHeads> {
    const playerHeadToHeads = await this.clientPlayerHeadToHeadsRepository.findOne({
      where: {
        eventId,
        visible: true,
        isActive: true,
        isArchived: false,
      },
      select: {
        updatedAt: true,
      },
      order: {
        updatedAt: "DESC",
      },
    });

    return playerHeadToHeads;
  }

  async fetchClientPlayerHeadToHeadPage(
    eventId: string,
    athleteQuery?: string,
  ): Promise<ClientPlayerHeadToHeads> {
    let whereQuery: any = {
      eventId,
      visible: true,
      isActive: true,
      isArchived: false,
    };

    if (athleteQuery)
      whereQuery = [
        {
          ...whereQuery,
          eventParticipant1: {
            athlete: {
              firstName: ILike(`%${athleteQuery}%`),
            },
          },
        },
        {
          ...whereQuery,
          eventParticipant1: {
            athlete: {
              lastName: ILike(`%${athleteQuery}%`),
            },
          },
        },
        {
          ...whereQuery,
          eventParticipant2: {
            athlete: {
              firstName: ILike(`%${athleteQuery}%`),
            },
          },
        },
        {
          ...whereQuery,
          eventParticipant2: {
            athlete: {
              lastName: ILike(`%${athleteQuery}%`),
            },
          },
        },
      ];

    const query: any = {
      where: whereQuery,
      select: {
        id: true,
        updatedAt: true,
      },
      order: {
        updatedAt: "DESC",
      },
    };

    const result = await this.clientPlayerHeadToHeadsRepository.findOne(query);
    return result;
  }

  async fetchHeadToHead(id: string): Promise<PlayerHeadToHeads> {
    const playerHeadToHead = await this.playerHeadToHeadsRepository.findOne({
      where: {
        id,
        visible: true,
        isActive: true,
        isArchived: false,
      },
      select: {
        id: true,
        eventId: true,
        eventParticipant1Id: true,
        eventParticipant2Id: true,
        eventParticipantWinnerId: true,
      },
    });

    return playerHeadToHead;
  }

  async createPlayerHeadToHeads(
    eventId: string,
    payload: createPlayerHeadToHeadsDto,
  ): Promise<PlayerHeadToHeads> {
    try {
      if (payload.eventParticipant1Id === payload.eventParticipant2Id)
        throw playerHeadToHeadsExceptions.sameEventParticipantIds;

      const eventParticipants = await this.eventParticipantRepository.find({
        where: {
          id: In([payload.eventParticipant1Id, payload.eventParticipant2Id]),
          eventId,
          isActive: true,
          isArchived: false,
        },
        select: {
          id: true,
        },
      });
      if (eventParticipants.length !== 2) throw eventParticipantExceptions.eventParticipantNotFound;

      // check if an existing matchup already exists
      const matchup = await this.playerHeadToHeadsRepository.findOne({
        where: [
          {
            eventParticipant1Id: payload.eventParticipant1Id,
            eventParticipant2Id: payload.eventParticipant2Id,
          },
          {
            eventParticipant1Id: payload.eventParticipant2Id,
            eventParticipant2Id: payload.eventParticipant1Id,
          },
        ],
        select: {
          id: true,
        },
      });

      const insertPlayerHeadToHeads = this.playerHeadToHeadsRepository.create({
        id: matchup?.id,
        eventId,
        eventParticipant1Id: payload.eventParticipant1Id,
        eventParticipant2Id: payload.eventParticipant2Id,
        holdingPercentage: 100,
        visible: true,
      });
      const result = await this.playerHeadToHeadsRepository.save(insertPlayerHeadToHeads);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async updatePlayerHeadToHeadsPayout(eventId: string, payload: updatePlayerHeadToHeadsPayoutDto) {
    try {
      return await this.playerHeadToHeadsRepository.manager.transaction(
        async (transactionalEntityManager: EntityManager) => {
          const transactionResult = await Promise.allSettled(
            payload.items.map(async (item) => {
              try {
                const row = await transactionalEntityManager.findOne(PlayerHeadToHeads, {
                  where: {
                    id: item.id,
                    eventId,
                    isActive: true,
                    isArchived: false,
                  },
                  select: {
                    id: true,
                    eventParticipantWinnerId: true,
                  },
                });
                if (!row) throw playerHeadToHeadsExceptions.playerHeadToHeadsNotFound;

                if (row.eventParticipantWinnerId)
                  throw playerHeadToHeadsExceptions.cannotUpdateheadToHeadPaidOut;

                const updateObj: Partial<PlayerHeadToHeads> = {};

                if (item.eventParticipantWinnerId)
                  updateObj.eventParticipantWinnerId = item.eventParticipantWinnerId;

                if (item.voided === true || item.voided === false) updateObj.voided = item.voided;

                if (item.draw === true || item.draw === false) updateObj.draw = item.draw;

                if (!Object.keys(updateObj).length) return false;

                await transactionalEntityManager.update(
                  PlayerHeadToHeads,
                  {
                    id: item.id,
                  },
                  updateObj,
                );

                return true;
              } catch (promiseError) {
                throw promiseError;
              }
            }),
          );

          const errorItem = transactionResult.find(
            (resultItem) => resultItem.status === "rejected",
          ) as PromiseRejectedResult;
          if (errorItem) {
            // get the first error that was thrown in the loop and throw that error
            throw errorItem?.reason;
          }
          return true;
        },
      );
    } catch (error) {
      throw error;
    }
  }

  async updatePlayerHeadToHeads(eventId: string, payload: updatePlayerHeadToHeadsDto) {
    try {
      return await this.playerHeadToHeadsRepository.manager.transaction(
        async (transactionalEntityManager: EntityManager) => {
          const transactionResult = await Promise.allSettled(
            payload.items.map(async (item) => {
              try {
                const row = await transactionalEntityManager.findOne(PlayerHeadToHeads, {
                  where: {
                    id: item.id,
                    eventId,
                    isActive: true,
                    isArchived: false,
                  },
                  select: {
                    id: true,
                  },
                });
                if (!row) throw playerHeadToHeadsExceptions.playerHeadToHeadsNotFound;

                const updateObj: Partial<PlayerHeadToHeads> = {};

                if (item.player1Position) updateObj.player1Position = item.player1Position;
                if (item.player2Position) updateObj.player2Position = item.player2Position;
                if (
                  item.player1HasModifiedProbability === true ||
                  item.player1HasModifiedProbability === false
                )
                  updateObj.player1HasModifiedProbability = item.player1HasModifiedProbability;
                if (
                  item.player2HasModifiedProbability === true ||
                  item.player2HasModifiedProbability === false
                )
                  updateObj.player2HasModifiedProbability = item.player2HasModifiedProbability;

                if (item.player1Odds) updateObj.player1Odds = item.player1Odds;

                if (item.player2Odds) updateObj.player2Odds = item.player2Odds;

                if (item.player1Probability) updateObj.player1Probability = item.player1Probability;

                if (item.player2Probability) updateObj.player2Probability = item.player2Probability;

                if (item.holdingPercentage) updateObj.holdingPercentage = item.holdingPercentage;

                if (!Object.keys(updateObj).length) return true;

                await transactionalEntityManager.update(
                  PlayerHeadToHeads,
                  {
                    id: item.id,
                  },
                  updateObj,
                );
              } catch (promiseError) {
                throw promiseError;
              }
            }),
          );

          const errorItem = transactionResult.find(
            (resultItem) => resultItem.status === "rejected",
          ) as PromiseRejectedResult;
          if (errorItem) {
            // get the first error that was thrown in the loop and throw that error
            throw errorItem?.reason;
          }

          return true;
        },
      );
    } catch (error) {
      throw error;
    }
  }
}

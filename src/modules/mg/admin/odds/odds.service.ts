import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository, In } from "typeorm";

import EventParticipant from "../../../../entities/mg/eventParticipants.entity";
import PlayerHeadToHeads from "../../../../entities/mg/playerHeadToHeads.entity";

import ClientPlayerHeadToHeads from "../../../../entities/mg/clientPlayerHeadToHeads.entity";

import {
  createPlayerHeadToHeadsDto,
  updatePlayerHeadToHeadsDto,
  updatePlayerHeadToHeadsPayoutDto,
} from "../odds/dto/playerHeadToHeads.dto";

import * as eventParticipantExceptions from "../../../../exceptions/eventParticipants";
import * as playerHeadToHeadsExceptions from "../../../../exceptions/playerHeadToHeads";

@Injectable()
export class OddsService {
  constructor(
    @InjectRepository(EventParticipant)
    private readonly eventParticipantRepository: Repository<EventParticipant>,
    @InjectRepository(PlayerHeadToHeads)
    private readonly playerHeadToHeadsRepository: Repository<PlayerHeadToHeads>,
    @InjectRepository(ClientPlayerHeadToHeads)
    private readonly clientPlayerHeadToHeadsRepository: Repository<ClientPlayerHeadToHeads>,
  ) {}

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

                if (item.player1TrueProbability)
                  updateObj.player1TrueProbability = item.player1TrueProbability;
                if (item.player2TrueProbability)
                  updateObj.player2TrueProbability = item.player2TrueProbability;

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

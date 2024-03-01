import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository, In } from "typeorm";

import PropBets from "../../../../entities/motocrs/propBets.entity";
import EventParticipant from "../../../../entities/motocrs/eventParticipants.entity";
import ProjectionEventHeatOutcome from "../../../../entities/motocrs/projectionEventHeatOutcome.entity";
import ProjectionEventOutcome from "../../../../entities/motocrs/projectionEventOutcome.entity";
import PlayerHeadToHeads from "../../../../entities/motocrs/playerHeadToHeads.entity";
import RoundHeats from "../../../../entities/motocrs/roundHeats.entity";
import ProjectionEventPodiums from "../../../../entities/motocrs/projectionEventPodiums.entity";

import ClientProjectionEventHeatOutcome from "../../../../entities/motocrs/clientProjectionEventHeatOutcome.entity";
import ClientProjectionEventOutcome from "../../../../entities/motocrs/clientProjectionEventOutcome.entity";
import ClientPlayerHeadToHeads from "../../../../entities/motocrs/clientPlayerHeadToHeads.entity";
import ClientPropBets from "../../../../entities/motocrs/clientPropBets.entity";
import ClientProjectionEventPodiums from "../../../../entities/motocrs/clientProjectionEventPodiums.entity";

import { UpdateEventPodiumsDto } from "./dto/podiums.dto";
import { UpdateEventOddDto, UpdateEventHeatOddDto } from "./dto/odds.dto";
import { createPropBetDto, updatePropBetDto, updatePropBetPayoutDto } from "./dto/propBet.dto";
import {
  createPlayerHeadToHeadsDto,
  updatePlayerHeadToHeadsDto,
  updatePlayerHeadToHeadsPayoutDto,
} from "../odds/dto/playerHeadToHeads.dto";

import * as propBetsExceptions from "../../../../exceptions/propBets";
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
    @InjectRepository(PropBets) private readonly propBetsRepository: Repository<PropBets>,
    @InjectRepository(EventParticipant)
    private readonly eventParticipantRepository: Repository<EventParticipant>,
    @InjectRepository(PlayerHeadToHeads)
    private readonly playerHeadToHeadsRepository: Repository<PlayerHeadToHeads>,
    @InjectRepository(RoundHeats)
    private readonly roundHeatsRepository: Repository<RoundHeats>,
    @InjectRepository(ProjectionEventPodiums)
    private readonly projectionEventPodiumsRepository: Repository<ProjectionEventPodiums>,

    @InjectRepository(ClientProjectionEventOutcome)
    private readonly clientProjectionEventOutcomeRepository: Repository<ClientProjectionEventOutcome>,
    @InjectRepository(ClientProjectionEventHeatOutcome)
    private readonly clientProjectionEventHeatOutcomeRepository: Repository<ClientProjectionEventHeatOutcome>,
    @InjectRepository(ClientPropBets)
    private readonly clientPropBetsRepository: Repository<ClientPropBets>,
    @InjectRepository(ClientPlayerHeadToHeads)
    private readonly clientPlayerHeadToHeadsRepository: Repository<ClientPlayerHeadToHeads>,
    @InjectRepository(ClientProjectionEventPodiums)
    private readonly clientProjectionEventPodiumsRepository: Repository<ClientProjectionEventPodiums>,
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

  async createPropBet(payload: createPropBetDto, eventId: string) {
    try {
      const insertData = this.propBetsRepository.create({
        eventId,
        odds: payload.odds,
        proposition: payload.proposition,
      });

      if (payload.eventParticipantId) {
        const eventParticipant = await this.eventParticipantRepository.findOne({
          where: {
            id: payload.eventParticipantId,
            eventId,
            isActive: true,
            isArchived: false,
          },
          select: {
            id: true,
          },
        });
        if (!eventParticipant) throw eventParticipantExceptions.eventParticipantNotFound;

        insertData.eventParticipantId = payload.eventParticipantId;
      }

      await this.propBetsRepository.save(insertData);
      return true;
    } catch (error) {
      throw error;
    }
  }

  async updatePropBetPayout(payload: updatePropBetPayoutDto, eventId: string) {
    try {
      const result = await this.propBetsRepository.manager.transaction(
        async (transactionalEntityManager: EntityManager) => {
          const transactionResult = await Promise.allSettled(
            payload.items.map(async (item) => {
              try {
                const row = await transactionalEntityManager.findOne(PropBets, {
                  where: {
                    id: item.id,
                    eventId,
                    isActive: true,
                    isArchived: false,
                  },
                  select: {
                    id: true,
                    payout: true,
                    voided: true,
                  },
                });
                if (!row) throw propBetsExceptions.propBetNotFound;
                if (row.payout && (item.payout === true || item.voided === true))
                  throw propBetsExceptions.propBetPayoutAlreadyPaid;
                if (row.voided && item.payout === true) throw propBetsExceptions.propBetVoided;

                const updateObj: Partial<PropBets> = {};

                if (item.voided === false || item.voided === true) updateObj.voided = item.voided;
                if (item.payout === false || item.payout === true) updateObj.payout = item.payout;

                await transactionalEntityManager.update(
                  PropBets,
                  {
                    id: item.id,
                  },
                  updateObj,
                );
              } catch (error) {
                throw error;
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

      return result;
    } catch (error) {
      throw error;
    }
  }

  async updatePropBet(payload: updatePropBetDto, eventId: string) {
    try {
      return await this.propBetsRepository.manager.transaction(
        async (transactionalEntityManager: EntityManager) => {
          const transactionResult = await Promise.allSettled(
            payload.items.map(async (item) => {
              try {
                const propBet = await transactionalEntityManager.findOne(PropBets, {
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
                if (!propBet) throw propBetsExceptions.propBetNotFound;

                if (item.eventParticipantId) {
                  const eventParticipant = await transactionalEntityManager.findOne(
                    EventParticipant,
                    {
                      where: {
                        id: item.eventParticipantId,
                        eventId,
                        isActive: true,
                        isArchived: false,
                      },
                      select: {
                        id: true,
                      },
                    },
                  );
                  if (!eventParticipant) throw eventParticipantExceptions.eventParticipantNotFound;
                }

                const updateObj: Partial<PropBets> = {};

                if (item.eventParticipantId) updateObj.eventParticipantId = item.eventParticipantId;
                if (item.odds || item.odds === 0) updateObj.odds = item.odds;
                if (item.proposition) updateObj.proposition = item.proposition;

                if (!Object.keys(updateObj).length) return true;

                await transactionalEntityManager.update(
                  PropBets,
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

  async fetchPropBets(eventId: string): Promise<PropBets[]> {
    const data = await this.propBetsRepository.find({
      where: {
        eventId,
        isActive: true,
        isArchived: false,
        // eventParticipant: {
        //   isActive: true,
        //   isArchived: false,
        // },
      },
      relations: ["eventParticipant.athlete"],
      select: {
        id: true,
        eventParticipantId: true,
        odds: true,
        eventId: true,
        proposition: true,
        payout: true,
        voided: true,
        createdAt: true,
        updatedAt: true,
        eventParticipant: {
          athleteId: true,
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
        payout: "ASC",
        voided: "ASC",
      },
    });

    return data;
  }

  async getLastUpdatedPropBet(eventId: string): Promise<PropBets> {
    const data = await this.propBetsRepository.findOne({
      where: {
        eventId,
        isActive: true,
        isArchived: false,
        // eventParticipant: {
        //   isActive: true,
        //   isArchived: false,
        // },
      },
      // relations: ["eventParticipant"],
      select: {
        id: true,
        updatedAt: true,
      },
      order: {
        updatedAt: "DESC",
      },
    });

    return data;
  }

  async fetchClientPropBet(eventId: string): Promise<ClientPropBets> {
    const data = await this.clientPropBetsRepository.findOne({
      where: {
        eventId,
        isActive: true,
        isArchived: false,
        // eventParticipant: {
        //   isActive: true,
        //   isArchived: false,
        // },
      },
      // relations: ["eventParticipant"],
      select: {
        id: true,
        updatedAt: true,
      },
      order: {
        updatedAt: "DESC",
      },
    });

    return data;
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

  async updateEventPodiums(payload: UpdateEventPodiumsDto, eventId: string) {
    try {
      await this.projectionEventPodiumsRepository.manager.transaction(
        async (transactionalEntityManager: EntityManager) => {
          const transactionResult = await Promise.allSettled(
            payload.items.map((item) =>
              transactionalEntityManager.update(
                ProjectionEventPodiums,
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
        },
      );

      return true;
    } catch (error) {
      throw error;
    }
  }

  public async fetchEventPodiums(eventId: string): Promise<ProjectionEventPodiums[]> {
    const data = await this.projectionEventPodiumsRepository.find({
      where: {
        eventId,
      },
      select: {
        id: true,
        eventParticipantId: true,
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

  public async fetchClientEventPodium(eventId: string): Promise<ClientProjectionEventPodiums> {
    const data = await this.clientProjectionEventPodiumsRepository.findOne({
      where: {
        eventId,
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
}

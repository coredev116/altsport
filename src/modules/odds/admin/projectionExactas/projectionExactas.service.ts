import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository, EntityTarget, ObjectLiteral, IsNull, Not } from "typeorm";

import { SportsTypes, ExactasType, OddMarkets } from "../../../../constants/system";

import * as systemExceptions from "../../../../exceptions/system";
import * as exactasExceptions from "../../../../exceptions/exactas";
import * as eventsExceptions from "../../../../exceptions/events";
import * as heatsExceptions from "../../../../exceptions/heats";

import { CreateExactasDto } from "./dto/createExactas.dto";
import { UpdateExactasDto } from "./dto/updateExactas.dto";
import { UpdateExactasPayoutDto } from "./dto/updateExactasPayout.dto";

import MOTOCRSClientProjectionExactas from "../../../../entities/motocrs/clientProjectionExactas.entity";
import MOTOCRSProjectionExactas from "../../../../entities/motocrs/projectionExactas.entity";
import MOTOCRSEvents from "../../../../entities/motocrs/events.entity";
import MOTOCRSRoundHeats from "../../../../entities/motocrs/roundHeats.entity";
import MOTOCRSRounds from "../../../../entities/motocrs/rounds.entity";

import QueueService from "../../../system/queue/queue.service";

@Injectable()
export class ExactasService {
  constructor(
    @InjectRepository(MOTOCRSRounds)
    private readonly motocrsRoundsRepository: Repository<MOTOCRSRounds>,
    @InjectRepository(MOTOCRSProjectionExactas)
    private readonly motocrsProjectionExactasRepository: Repository<MOTOCRSProjectionExactas>,
    @InjectRepository(MOTOCRSClientProjectionExactas)
    private readonly motocrsClientProjectionExactasRepository: Repository<MOTOCRSClientProjectionExactas>,

    private queueService: QueueService,
  ) {}

  async fetchProjectionExactas(
    sportType: SportsTypes,
    eventId: string,
    exactasType: ExactasType,
    isHeatExacta: boolean,
  ): Promise<ObjectLiteral[]> {
    let repository: Repository<ObjectLiteral>;
    switch (sportType) {
      case SportsTypes.MOTOCROSS: {
        repository = this.motocrsProjectionExactasRepository;
        break;
      }
      default: {
        throw systemExceptions.incorrectSportType();
      }
    }

    const projectionExactas = await repository.find({
      where: {
        eventId,
        roundHeatId: isHeatExacta ? Not(IsNull()) : IsNull(),
        position: exactasType,
        visible: true,
        isActive: true,
        isArchived: false,
      },
      relations: ["heat"],
      select: {
        id: true,
        eventId: true,
        roundHeatId: true,
        position: true,
        voided: true,
        draw: true,
        visible: true,
        holdingPercentage: true,
        probability: true,
        odds: true,
        trueProbability: true,
        hasModifiedProbability: true,
        participants: {},
        createdAt: true,
        updatedAt: true,
        heat: {
          id: true,
          heatName: true,
          heatNo: true,
          heatStatus: true,
          roundId: true,
        },
      },
    });

    return projectionExactas;
  }

  async fetchRoundHeats(sportType: SportsTypes, eventId: string): Promise<ObjectLiteral[]> {
    let roundsRespository: Repository<ObjectLiteral>;
    switch (sportType) {
      case SportsTypes.MOTOCROSS: {
        roundsRespository = this.motocrsRoundsRepository;
        break;
      }
      default: {
        throw systemExceptions.incorrectSportType();
      }
    }

    const rounds = await roundsRespository.find({
      where: {
        eventRounds: {
          eventId,
          isActive: true,
          isArchived: false,
        },
        heats: {
          eventId,
          isActive: true,
          isArchived: false,
        },
        isActive: true,
        isArchived: false,
      },
      relations: ["eventRounds", "heats"],
      select: {
        id: true,
        name: true,
        roundNo: true,
        eventRounds: {
          id: true,
          roundId: true,
          roundStatus: true,
        },
        heats: {
          id: true,
          heatName: true,
          heatNo: true,
          heatStatus: true,
          winnerAthleteId: true,
          isHeatWinnerMarketVoided: true,
          isHeatWinnerMarketOpen: true,
        },
      },
    });

    return rounds;
  }

  async fetchProjectionExactasHeat(
    sportType: SportsTypes,
    eventId: string,
    exactasType: ExactasType,
    isHeatExacta: boolean,
  ): Promise<ObjectLiteral[]> {
    let respository: Repository<ObjectLiteral>;
    switch (sportType) {
      case SportsTypes.MOTOCROSS: {
        respository = this.motocrsProjectionExactasRepository;
        break;
      }
      default: {
        throw systemExceptions.incorrectSportType();
      }
    }

    const exactas = await respository.find({
      where: {
        eventId,
        roundHeatId: isHeatExacta ? Not(IsNull()) : IsNull(),
        position: exactasType,
        visible: true,
        isActive: true,
        isArchived: false,
      },
      select: {
        id: true,
        eventId: true,
        roundHeatId: true,
        position: true,
        voided: true,
        draw: true,
        visible: true,
        holdingPercentage: true,
        probability: true,
        odds: true,
        trueProbability: true,
        hasModifiedProbability: true,
        participants: {},
        createdAt: true,
        updatedAt: true,
      },
    });

    return exactas.map((exacta) => ({
      id: exacta.id,
      eventId: exacta.eventId,
      roundHeatId: exacta.roundHeatId,
      voided: exacta.voided,
      draw: exacta.draw,
      holdingPercentage: +Number(exacta.holdingPercentage).toFixed(2),
      odds: +Number(exacta.odds).toFixed(2),
      probability: +Number(exacta.probability).toFixed(2),
      trueProbability: +Number(exacta.trueProbability).toFixed(2),
      hasModifiedProbability: exacta.hasModifiedProbability,
      participants: exacta.participants,
      createdAt: exacta.createdAt,
      updatedAt: exacta.updatedAt,
    }));
  }

  async getLastUpdatedProjectionExactas(
    sportType: SportsTypes,
    eventId: string,
    isHeatExacta: boolean,
  ): Promise<ObjectLiteral> {
    let repository: Repository<ObjectLiteral>;
    switch (sportType) {
      case SportsTypes.MOTOCROSS: {
        repository = this.motocrsProjectionExactasRepository;
        break;
      }
      default: {
        throw systemExceptions.incorrectSportType();
      }
    }
    const projectionExactas = await repository.findOne({
      where: {
        eventId,
        roundHeatId: isHeatExacta ? Not(IsNull()) : IsNull(),
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

    return projectionExactas;
  }

  async getLastUpdatedClientProjectionExactas(
    sportType: string,
    eventId: string,
    isHeatExacta: boolean,
  ): Promise<ObjectLiteral> {
    let repository: Repository<ObjectLiteral>;
    switch (sportType) {
      case SportsTypes.MOTOCROSS: {
        repository = this.motocrsClientProjectionExactasRepository;
        break;
      }
      default: {
        throw systemExceptions.incorrectSportType();
      }
    }

    const projectionExactas = await repository.findOne({
      where: {
        eventId,
        roundHeatId: isHeatExacta ? Not(IsNull()) : IsNull(),
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

    return projectionExactas;
  }

  async fetchClientProjectionExactas(
    sportType: string,
    eventId: string,
    exactasType: ExactasType,
    isHeatExacta: boolean,
  ): Promise<ObjectLiteral> {
    let repository: Repository<ObjectLiteral>;
    switch (sportType) {
      case SportsTypes.MOTOCROSS: {
        repository = this.motocrsClientProjectionExactasRepository;
        break;
      }
      default: {
        throw systemExceptions.incorrectSportType();
      }
    }

    const projectionExactas = await repository.find({
      where: {
        eventId,
        roundHeatId: isHeatExacta ? Not(IsNull()) : IsNull(),
        position: exactasType,
        visible: true,
        isActive: true,
        isArchived: false,
      },
      select: {
        id: true,
        updatedAt: true,
        createdAt: true,
        roundHeatId: true,
      },
      order: {
        updatedAt: "DESC",
      },
    });

    return projectionExactas;
  }

  async updateExactasProjections(sportType: SportsTypes, payload: UpdateExactasDto) {
    try {
      let repository: Repository<ObjectLiteral>;

      switch (sportType) {
        case SportsTypes.MOTOCROSS: {
          repository = this.motocrsProjectionExactasRepository;
          break;
        }
        default: {
          throw systemExceptions.incorrectSportType();
        }
      }
      return await repository.manager.transaction(
        async (transactionalEntityManager: EntityManager) => {
          await transactionalEntityManager.save(
            payload.items.map((row) =>
              repository.create({
                ...row,
                updatedAt: new Date().toISOString(),
              }),
            ),
          );

          return true;
        },
      );
    } catch (error) {
      throw error;
    }
  }

  async updateRoundHeatVoid(sportType: SportsTypes, eventId: string, heatId: string) {
    try {
      let repository: Repository<ObjectLiteral>;
      let tableName: EntityTarget<ObjectLiteral>;

      switch (sportType) {
        case SportsTypes.MOTOCROSS: {
          repository = this.motocrsProjectionExactasRepository;
          tableName = MOTOCRSProjectionExactas;
          break;
        }
        default: {
          throw systemExceptions.incorrectSportType();
        }
      }

      return await repository.manager.transaction(
        async (transactionalEntityManager: EntityManager) => {
          await transactionalEntityManager.update(
            tableName,
            {
              eventId,
              roundHeatId: heatId,
            },
            {
              voided: true,
            },
          );

          return true;
        },
      );
    } catch (error) {
      throw error;
    }
  }

  async exactasOddsGoLive(
    sportType: SportsTypes,
    eventId: string,
    roundHeatId: string,
    projectionType: OddMarkets,
  ): Promise<boolean> {
    let repository: Repository<ObjectLiteral>;
    let tableName: EntityTarget<ObjectLiteral>;
    let clientTable: EntityTarget<ObjectLiteral>;
    // let clientTableParticipants: EntityTarget<ObjectLiteral>;
    switch (sportType) {
      case SportsTypes.MOTOCROSS: {
        repository = this.motocrsProjectionExactasRepository;
        tableName = MOTOCRSProjectionExactas;
        clientTable = MOTOCRSClientProjectionExactas;
        break;
      }
      default: {
        throw systemExceptions.incorrectSportType();
      }
    }

    await repository.manager.transaction(async (transactionalEntityManager: EntityManager) => {
      switch (projectionType) {
        case OddMarkets.EXACTAS: {
          const exactasRow = await transactionalEntityManager.findOne(tableName, {
            where: {
              eventId,
              // skipping position because a publish implies publish all
              // position: ExactasType.EXACTAS,
              visible: true,
              isActive: true,
            },
            select: {
              eventId: true,
              roundHeatId: true,
              participants: true,
              position: true,
              voided: true,
              draw: true,
              visible: true,
              holdingPercentage: true,
              odds: true,
              probability: true,
              trueProbability: true,
              hasModifiedProbability: true,
            },
          });
          if (!exactasRow) return;

          await transactionalEntityManager.update(
            clientTable,
            {
              eventId,
              // skipping position because a publish implies publish all
              // position: ExactasType.EXACTAS,
              roundHeatId: IsNull(),
            },
            {
              isActive: false,
              isArchived: true,
            },
          );

          await transactionalEntityManager.query(`
            INSERT INTO ${sportType}."clientProjectionExactas"("eventId", "roundHeatId", "participants", "position", "odds", "probability", "trueProbability", "hasModifiedProbability", "voided", "draw", "visible", "holdingPercentage")
            SELECT "eventId", "roundHeatId", "participants", "position", "odds", "probability", "trueProbability", "hasModifiedProbability", "voided", "draw", "visible", "holdingPercentage" FROM ${sportType}."projectionExactas"
            WHERE ${sportType}."projectionExactas"."eventId" = '${eventId}' AND visible = true AND "roundHeatId" IS NULL;
          `);

          break;
        }

        case OddMarkets.HEAT_EXACTAS: {
          if (!roundHeatId) {
            throw exactasExceptions.heatIdMissing;
          }
          const exactasRow = await transactionalEntityManager.findOne(tableName, {
            where: {
              eventId,
              roundHeatId,
              // skipping position because a publish implies publish all
              // position: ExactasType.EXACTAS,
              visible: true,
              isActive: true,
            },
            select: {
              eventId: true,
              roundHeatId: true,
              participants: true,
              position: true,
              voided: true,
              draw: true,
              visible: true,
              holdingPercentage: true,
              odds: true,
              probability: true,
              trueProbability: true,
              hasModifiedProbability: true,
            },
          });
          if (!exactasRow) return;

          await transactionalEntityManager.update(
            clientTable,
            {
              eventId,
              // skipping position because a publish implies publish all
              // position: ExactasType.EXACTAS,
              roundHeatId,
            },
            {
              isActive: false,
              isArchived: true,
            },
          );

          await transactionalEntityManager.query(`
          INSERT INTO ${sportType}."clientProjectionExactas"("eventId", "roundHeatId", "participants", "position", "odds", "probability", "trueProbability", "hasModifiedProbability", "voided", "draw", "visible", "holdingPercentage")
          SELECT "eventId", "roundHeatId", "participants", "position", "odds", "probability", "trueProbability", "hasModifiedProbability", "voided", "draw", "visible", "holdingPercentage" FROM ${sportType}."projectionExactas"
          WHERE ${sportType}."projectionExactas"."eventId" = '${eventId}' AND visible = true AND "roundHeatId" = '${roundHeatId}';
        `);
          break;
        }

        default:
          break;
      }

      if (projectionType !== OddMarkets.HEAT_PROJECTIONS)
        await this.queueService.notifyMarketPublishNotification({
          eventId,
          sportType,
          market: projectionType,
        });
    });

    return true;
  }

  async updateExactasPayout(
    sportType: SportsTypes,
    eventId: string,
    payload: UpdateExactasPayoutDto,
  ) {
    try {
      let repository: Repository<ObjectLiteral>;
      let tableName: EntityTarget<ObjectLiteral>;
      switch (sportType) {
        case SportsTypes.MOTOCROSS: {
          repository = this.motocrsProjectionExactasRepository;
          tableName = MOTOCRSProjectionExactas;
          break;
        }
        default: {
          throw systemExceptions.incorrectSportType();
        }
      }
      return await repository.manager.transaction(
        async (transactionalEntityManager: EntityManager) => {
          const transactionResult = await Promise.allSettled(
            payload.items.map(async (item) => {
              try {
                const row = await transactionalEntityManager.findOne(tableName, {
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
                if (!row) throw exactasExceptions.exactasNotFound;

                const updateObj: Partial<MOTOCRSProjectionExactas> = {};

                if (item.voided === true || item.voided === false) updateObj.voided = item.voided;

                if (item.draw === true || item.draw === false) updateObj.draw = item.draw;

                if (!Object.keys(updateObj).length) return false;

                await transactionalEntityManager.update(
                  tableName,
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

  async createProjectionExactas(
    sportType: SportsTypes,
    exactasType: ExactasType,
    eventId: string,
    payload: CreateExactasDto,
  ): Promise<boolean> {
    try {
      let repository: Repository<ObjectLiteral>;
      let tableName: EntityTarget<ObjectLiteral>;
      switch (sportType) {
        case SportsTypes.MOTOCROSS: {
          repository = this.motocrsProjectionExactasRepository;
          tableName = MOTOCRSProjectionExactas;
          break;
        }
        default: {
          throw systemExceptions.incorrectSportType();
        }
      }
      return await repository.manager.transaction(
        async (transactionalEntityManager: EntityManager) => {
          const event = await transactionalEntityManager.findOne(MOTOCRSEvents, {
            where: {
              id: eventId,
              isActive: true,
              isArchived: false,
            },
            select: {
              id: true,
            },
          });
          if (!event) throw eventsExceptions.eventNotFound();

          if (payload.roundHeatId) {
            const roundHeat = await transactionalEntityManager.findOne(MOTOCRSRoundHeats, {
              where: {
                id: payload.roundHeatId,
                isActive: true,
                isArchived: false,
              },
              select: {
                id: true,
              },
            });
            if (!roundHeat) throw heatsExceptions.heatNotFound();
          }

          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const participants = payload.participants.map(({ middleName, ...row }) => row);

          // eslint-disable-next-line unicorn/prefer-ternary
          if (!payload.roundHeatId) {
            const affectedResult = await transactionalEntityManager
              .createQueryBuilder()
              .update(tableName)
              // removing middle name and doing an exact match since the order matters
              .where(`participants ::text = :participants`, {
                participants: JSON.stringify(participants),
              })
              .andWhere({
                position: exactasType,
              })
              .set({ visible: true })
              .execute();

            if (!affectedResult.affected) {
              // need to create it
              await transactionalEntityManager.save(
                repository.create({
                  eventId,
                  participants,
                  hasModifiedProbability: false,
                  odds: 100,
                  probability: 1,
                  trueProbability: 1,
                  position: exactasType,
                  visible: true,
                  holdingPercentage: 100,
                }),
              );
            }
          } else {
            const affectedResult = await transactionalEntityManager
              .createQueryBuilder()
              .update(tableName)
              // removing middle name and doing an exact match since the order matters
              .where(`participants ::text = :participants`, {
                participants: JSON.stringify(participants),
              })
              .andWhere({
                position: exactasType,
                roundHeatId: payload.roundHeatId,
              })
              .set({ visible: true })
              .execute();

            if (!affectedResult.affected) {
              // need to create it
              await transactionalEntityManager.save(
                repository.create({
                  eventId,
                  roundHeatId: payload.roundHeatId,
                  position: exactasType,
                  participants,
                  hasModifiedProbability: false,
                  odds: 100,
                  probability: 1,
                  trueProbability: 1,
                  visible: true,
                  holdingPercentage: 100,
                }),
              );
            }
          }

          return true;
          // const insertExacta = repository.create({
          //   eventId,
          //   participants: payload.participants,
          //   roundHeatId: payload.roundHeatId,
          //   position: exactasType,
          //   visible: true,
          // });
          // return transactionalEntityManager.save(insertExacta);
        },
      );
    } catch (error) {
      throw error;
    }
  }
}

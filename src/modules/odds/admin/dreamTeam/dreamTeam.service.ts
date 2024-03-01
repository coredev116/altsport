import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository, EntityTarget, ObjectLiteral } from "typeorm";
import { v4 } from "uuid";

import { SportsTypes, OddMarkets } from "../../../../constants/system";

import * as systemExceptions from "../../../../exceptions/system";

import { UpdateDreamTeamPayoutDto } from "./dto/updateDreamTeamPayout.dto";
import { UpdateDreamTeamDto } from "./dto/updateDreamTeam.dto";

import F1ProjectionDreamTeam from "../../../../entities/f1/projectionDreamTeam.entity";
import F1ClientProjectionDreamTeam from "../../../../entities/f1/clientProjectionDreamTeam.entity";
import MGProjectionDreamTeam from "../../../../entities/mg/projectionDreamTeam.entity";
import MGClientProjectionDreamTeam from "../../../../entities/mg/clientProjectionDreamTeam.entity";
import MXGPProjectionDreamTeam from "../../../../entities/mxgp/projectionDreamTeam.entity";
import MXGPClientProjectionDreamTeam from "../../../../entities/mxgp/clientProjectionDreamTeam.entity";

import F1ProjectionDreamTeamParticipants from "../../../../entities/f1/projectionDreamTeamParticipants.entity";
import ClientF1ProjectionDreamTeamParticipants from "../../../../entities/f1/clientProjectionDreamTeamParticipants.entity";
import MGProjectionDreamTeamParticipants from "../../../../entities/mg/projectionDreamTeamParticipants.entity";
import ClientMGProjectionDreamTeamParticipants from "../../../../entities/mg/clientProjectionDreamTeamParticipants.entity";
import MXGPProjectionDreamTeamParticipants from "../../../../entities/mxgp/projectionDreamTeamParticipants.entity";
import ClientMXGPProjectionDreamTeamParticipants from "../../../../entities/mxgp/clientProjectionDreamTeamParticipants.entity";

import QueueService from "../../../system/queue/queue.service";

@Injectable()
export class DreamTeamService {
  constructor(
    @InjectRepository(F1ProjectionDreamTeam)
    private readonly f1ProjectionDreamTeamRepository: Repository<F1ProjectionDreamTeam>,
    @InjectRepository(F1ClientProjectionDreamTeam)
    private readonly f1ClientProjectionDreamTeamRepository: Repository<F1ClientProjectionDreamTeam>,
    @InjectRepository(F1ProjectionDreamTeamParticipants)
    private readonly f1ProjectionDreamTeamParticipantsRepository: Repository<F1ProjectionDreamTeamParticipants>,

    @InjectRepository(MGProjectionDreamTeam)
    private readonly mgProjectionDreamTeamRepository: Repository<MGProjectionDreamTeam>,
    @InjectRepository(MGClientProjectionDreamTeam)
    private readonly mgClientProjectionDreamTeamRepository: Repository<MGClientProjectionDreamTeam>,
    @InjectRepository(MGProjectionDreamTeamParticipants)
    private readonly mgProjectionDreamTeamRepositoryParticipantsRepository: Repository<MGProjectionDreamTeamParticipants>,

    @InjectRepository(MXGPProjectionDreamTeam)
    private readonly mxgpProjectionDreamTeamRepository: Repository<MXGPProjectionDreamTeam>,
    @InjectRepository(MXGPClientProjectionDreamTeam)
    private readonly mxgpClientProjectionDreamTeamRepository: Repository<MXGPClientProjectionDreamTeam>,
    @InjectRepository(MXGPProjectionDreamTeamParticipants)
    private readonly mxgpProjectionDreamTeamRepositoryParticipantsRepository: Repository<MXGPProjectionDreamTeamParticipants>,
    private queueService: QueueService,
  ) {}

  async fetchProjectionDreamTeam(
    sportType: SportsTypes,
    eventId: string,
  ): Promise<ObjectLiteral[]> {
    let repository: Repository<ObjectLiteral>;
    switch (sportType) {
      case SportsTypes.F1: {
        repository = this.f1ProjectionDreamTeamRepository;
        break;
      }
      case SportsTypes.MotoGP: {
        repository = this.mgProjectionDreamTeamRepository;
        break;
      }
      case SportsTypes.MXGP: {
        repository = this.mxgpProjectionDreamTeamRepository;
        break;
      }
      default: {
        throw systemExceptions.incorrectSportType();
      }
    }
    const projectionDreamTeam = await repository.find({
      where: {
        eventId,
        isActive: true,
        isArchived: false,
      },
      relations: ["participants"],
      select: {
        id: true,
        eventId: true,
        voided: true,
        draw: true,
        createdAt: true,
        updatedAt: true,
        participants: {
          id: true,
          team: true,
          probability: true,
          odds: true,
          trueProbability: true,
          hasModifiedProbability: true,
          participants: {},
        },
      },
      order: {
        voided: "ASC",
      },
    });

    return projectionDreamTeam;
  }

  async getLastUpdatedProjectionDreamTeam(
    sportType: SportsTypes,
    eventId: string,
  ): Promise<ObjectLiteral> {
    let repository: Repository<ObjectLiteral>;
    switch (sportType) {
      case SportsTypes.F1: {
        repository = this.f1ProjectionDreamTeamRepository;
        break;
      }
      case SportsTypes.MotoGP: {
        repository = this.mgProjectionDreamTeamRepository;
        break;
      }
      case SportsTypes.MXGP: {
        repository = this.mxgpProjectionDreamTeamRepository;
        break;
      }
      default: {
        throw systemExceptions.incorrectSportType();
      }
    }
    const projectionDreamTeam = await repository.findOne({
      where: {
        eventId,
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

    return projectionDreamTeam;
  }

  async fetchClientProjectionDreamTeam(sportType: string, eventId: string): Promise<ObjectLiteral> {
    let repository: Repository<ObjectLiteral>;
    switch (sportType) {
      case SportsTypes.F1: {
        repository = this.f1ClientProjectionDreamTeamRepository;
        break;
      }
      case SportsTypes.MotoGP: {
        repository = this.mgClientProjectionDreamTeamRepository;
        break;
      }
      case SportsTypes.MXGP: {
        repository = this.mxgpClientProjectionDreamTeamRepository;
        break;
      }
      default: {
        throw systemExceptions.incorrectSportType();
      }
    }

    const projectionDreamTeam = await repository.findOne({
      where: {
        eventId,
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

    return projectionDreamTeam;
  }

  async updateProjectionDreamTeamPayout(
    sportType: SportsTypes,
    eventId: string,
    payload: UpdateDreamTeamPayoutDto,
  ) {
    try {
      let repository: Repository<ObjectLiteral>;
      let tableName: EntityTarget<ObjectLiteral>;
      switch (sportType) {
        case SportsTypes.F1: {
          repository = this.f1ProjectionDreamTeamRepository;
          tableName = F1ProjectionDreamTeam;
          break;
        }
        case SportsTypes.MotoGP: {
          repository = this.mgProjectionDreamTeamRepository;
          tableName = MGProjectionDreamTeam;
          break;
        }
        case SportsTypes.MXGP: {
          repository = this.mxgpProjectionDreamTeamRepository;
          tableName = MXGPProjectionDreamTeam;
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
                const updateObj: Partial<ObjectLiteral> = {};

                if (item.voided === true || item.voided === false) updateObj.voided = item.voided;

                if (item.draw === true || item.draw === false) updateObj.draw = item.draw;

                if (!Object.keys(updateObj).length) return false;

                await transactionalEntityManager.update(
                  tableName,
                  {
                    id: item.id,
                    eventId,
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

  async updateDreamTeamProjections(
    sportType: SportsTypes,
    dreamTeamId: string,
    payload: UpdateDreamTeamDto,
  ) {
    try {
      let repository: Repository<ObjectLiteral>;
      let participantsRepository: Repository<ObjectLiteral>;
      switch (sportType) {
        case SportsTypes.F1: {
          repository = this.f1ProjectionDreamTeamRepository;
          participantsRepository = this.f1ProjectionDreamTeamParticipantsRepository;
          break;
        }
        case SportsTypes.MotoGP: {
          repository = this.mgProjectionDreamTeamRepository;
          participantsRepository = this.mgProjectionDreamTeamRepositoryParticipantsRepository;
          break;
        }
        case SportsTypes.MXGP: {
          repository = this.mxgpProjectionDreamTeamRepository;
          participantsRepository = this.mxgpProjectionDreamTeamRepositoryParticipantsRepository;
          break;
        }
        default: {
          throw systemExceptions.incorrectSportType();
        }
      }
      return await repository.manager.transaction(
        async (transactionalEntityManager: EntityManager) => {
          await transactionalEntityManager.save(
            payload.teams.map((row) => participantsRepository.create(row)),
          );

          // also update the dream team object so a change in detected in what is synced and what is not
          await transactionalEntityManager.save(
            repository.create({
              id: dreamTeamId,
              updatedAt: new Date().toISOString(),
            }),
          );

          return true;
        },
      );
    } catch (error) {
      throw error;
    }
  }

  async dreamTeamOddsGoLive(
    sportType: SportsTypes,
    eventId: string,
    projectionType: OddMarkets,
  ): Promise<boolean> {
    let repository: Repository<ObjectLiteral>;
    let tableName: EntityTarget<ObjectLiteral>;
    let clientTable: EntityTarget<ObjectLiteral>;
    let clientTableParticipants: EntityTarget<ObjectLiteral>;
    switch (sportType) {
      case SportsTypes.F1: {
        repository = this.f1ProjectionDreamTeamRepository;
        tableName = F1ProjectionDreamTeam;
        clientTable = F1ClientProjectionDreamTeam;
        clientTableParticipants = ClientF1ProjectionDreamTeamParticipants;
        break;
      }
      case SportsTypes.MotoGP: {
        repository = this.mgProjectionDreamTeamRepository;
        tableName = MGProjectionDreamTeam;
        clientTable = MGClientProjectionDreamTeam;
        clientTableParticipants = MGClientProjectionDreamTeam;
        clientTableParticipants = ClientMGProjectionDreamTeamParticipants;
        break;
      }
      case SportsTypes.MXGP: {
        repository = this.mxgpProjectionDreamTeamRepository;
        tableName = MXGPProjectionDreamTeam;
        clientTable = MXGPClientProjectionDreamTeam;
        clientTableParticipants = MXGPClientProjectionDreamTeam;
        clientTableParticipants = ClientMXGPProjectionDreamTeamParticipants;
        break;
      }
      default: {
        throw systemExceptions.incorrectSportType();
      }
    }

    await repository.manager.transaction(async (transactionalEntityManager: EntityManager) => {
      switch (projectionType) {
        case OddMarkets.DREAM_TEAM: {
          const dreamTeamRows = await transactionalEntityManager.find(tableName, {
            where: {
              eventId,
              isActive: true,
            },
            relations: ["participants"],
            select: {
              eventId: true,
              providerId: true,
              voided: true,
              draw: true,
              participants: {
                dreamTeamId: true,
                participants: true,
                team: true,
                odds: true,
                probability: true,
                trueProbability: true,
                hasModifiedProbability: true,
              },
            },
          });
          if (!dreamTeamRows.length) return;

          await transactionalEntityManager.update(
            clientTable,
            {
              eventId,
            },
            {
              isActive: false,
              isArchived: true,
            },
          );

          const clientDreamTeamRows = [];
          const clientDreamTeamParticipantRows = [];
          dreamTeamRows.forEach(({ participants = [], ...row }) => {
            const dreamTeamId: string = v4();

            clientDreamTeamRows.push({
              ...row,
              id: dreamTeamId,
            });

            clientDreamTeamParticipantRows.push(
              ...participants.map((participant) => ({
                ...participant,
                dreamTeamId,
              })),
            );
          });

          if (clientDreamTeamRows.length)
            await transactionalEntityManager.insert(clientTable, clientDreamTeamRows);
          if (clientDreamTeamParticipantRows.length)
            await transactionalEntityManager.insert(
              clientTableParticipants,
              clientDreamTeamParticipantRows,
            );

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
}

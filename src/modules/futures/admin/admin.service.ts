import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository, ObjectLiteral, EntityTarget } from "typeorm";

import { SportsTypes, SportsDbSchema, FutureMarkets, OddMarkets } from "../../../constants/system";

import { UpdateFutureOddsDto } from "./dto/updateFutureOdds.dto";

import * as systemExceptions from "../../../exceptions/system";
import * as toursExceptions from "../../../exceptions/tours";

import QueueService from "../../system/queue/queue.service";

import WSLTourYears from "../../../entities/wsl/tourYears.entity";
import SLSTourYears from "../../../entities/sls/leagueYears.entity";
import NRXTourYears from "../../../entities/nrx/tourYears.entity";
import SPRTourYears from "../../../entities/spr/tourYears.entity";
import MASLTourYears from "../../../entities/masl/leagueYears.entity";
import FdriftTourYears from "../../../entities/fdrift/tourYears.entity";
import MOTOCRSTourYears from "../../../entities/motocrs/tourYears.entity";
import F1TourYears from "../../../entities/f1/tourYears.entity";
import MGTourYears from "../../../entities/mg/tourYears.entity";
import MXGPTourYears from "../../../entities/mxgp/tourYears.entity";
import JATourYears from "../../../entities/ja/tourYears.entity";

import WSLFutures from "../../../entities/wsl/futures.entity";
import SLSFutures from "../../../entities/sls/futures.entity";
import NRXFutures from "../../../entities/nrx/futures.entity";
import SPRFutures from "../../../entities/spr/futures.entity";
import MASLFutures from "../../../entities/masl/futures.entity";
import FdriftFutures from "../../../entities/fdrift/futures.entity";
import MOTOCRSFutures from "../../../entities/motocrs/futures.entity";
import F1Futures from "../../../entities/f1/futures.entity";
import MGFutures from "../../../entities/mg/futures.entity";
import MXGPFutures from "../../../entities/mxgp/futures.entity";
import JAFutures from "../../../entities/ja/futures.entity";

import WSLFutureOdds from "../../../entities/wsl/futureOdds.entity";
import SLSFutureOdds from "../../../entities/sls/futureOdds.entity";
import NRXFutureOdds from "../../../entities/nrx/futureOdds.entity";
import SPRFutureOdds from "../../../entities/spr/futureOdds.entity";
import MASLFutureOdds from "../../../entities/masl/futureOdds.entity";
import FdriftFutureOdds from "../../../entities/fdrift/futureOdds.entity";
import MOTOCRSFutureOdds from "../../../entities/motocrs/futureOdds.entity";
import F1FutureOdds from "../../../entities/f1/futureOdds.entity";
import MGFutureOdds from "../../../entities/mg/futureOdds.entity";
import MXGPFutureOdds from "../../../entities/mxgp/futureOdds.entity";
import JAFutureOdds from "../../../entities/ja/futureOdds.entity";

import WSLClientFutureOdds from "../../../entities/wsl/clientFutureOdds.entity";
import SLSClientFutureOdds from "../../../entities/sls/clientFutureOdds.entity";
import NRXClientFutureOdds from "../../../entities/nrx/clientFutureOdds.entity";
import SPRClientFutureOdds from "../../../entities/spr/clientFutureOdds.entity";
import MASLClientFutureOdds from "../../../entities/masl/clientFutureOdds.entity";
import FdriftClientFutureOdds from "../../../entities/fdrift/clientFutureOdds.entity";
import MOTOCRSClientFutureOdds from "../../../entities/motocrs/clientFutureOdds.entity";
import F1ClientFutureOdds from "../../../entities/f1/clientFutureOdds.entity";
import MGClientFutureOdds from "../../../entities/mg/clientFutureOdds.entity";
import MXGPClientFutureOdds from "../../../entities/mxgp/clientFutureOdds.entity";
import JAClientFutureOdds from "../../../entities/ja/clientFutureOdds.entity";

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(WSLTourYears)
    private readonly wslTourYearsRepository: Repository<WSLTourYears>,
    @InjectRepository(SLSTourYears)
    private readonly slsTourYearsRepository: Repository<SLSTourYears>,
    @InjectRepository(NRXTourYears)
    private readonly nrxTourYearsRepository: Repository<NRXTourYears>,
    @InjectRepository(SPRTourYears)
    private readonly sprTourYearsRepository: Repository<SPRTourYears>,
    @InjectRepository(MASLTourYears)
    private readonly maslTourYearsRepository: Repository<MASLTourYears>,
    @InjectRepository(FdriftTourYears)
    private readonly fdriftTourYearsRepository: Repository<FdriftTourYears>,
    @InjectRepository(MOTOCRSTourYears)
    private readonly motocrsTourYearsRepository: Repository<MOTOCRSTourYears>,
    @InjectRepository(F1TourYears)
    private readonly f1TourYearsRepository: Repository<F1TourYears>,
    @InjectRepository(MGTourYears)
    private readonly mgTourYearsRepository: Repository<MGTourYears>,
    @InjectRepository(MXGPTourYears)
    private readonly mxgpTourYearsRepository: Repository<MXGPTourYears>,
    @InjectRepository(JATourYears)
    private readonly jaTourYearsRepository: Repository<JATourYears>,

    @InjectRepository(WSLFutureOdds)
    private readonly wslFutureOddsRepository: Repository<WSLFutureOdds>,
    @InjectRepository(SLSFutureOdds)
    private readonly slsFutureOddsRepository: Repository<SLSFutureOdds>,
    @InjectRepository(NRXFutureOdds)
    private readonly nrxFutureOddsRepository: Repository<NRXFutureOdds>,
    @InjectRepository(SPRFutureOdds)
    private readonly sprFutureOddsRepository: Repository<SPRFutureOdds>,
    @InjectRepository(MASLFutureOdds)
    private readonly maslFutureOddsRepository: Repository<MASLFutureOdds>,
    @InjectRepository(FdriftFutureOdds)
    private readonly fdriftFutureOddsRepository: Repository<FdriftFutureOdds>,
    @InjectRepository(MOTOCRSFutureOdds)
    private readonly motocrsFutureOddsRepository: Repository<MOTOCRSFutureOdds>,
    @InjectRepository(F1FutureOdds)
    private readonly f1FutureOddsRepository: Repository<F1FutureOdds>,
    @InjectRepository(MGFutureOdds)
    private readonly mgFutureOddsRepository: Repository<MGFutureOdds>,
    @InjectRepository(MXGPFutureOdds)
    private readonly mxgpFutureOddsRepository: Repository<MXGPFutureOdds>,
    @InjectRepository(JAFutureOdds)
    private readonly jaFutureOddsRepository: Repository<JAFutureOdds>,

    @InjectRepository(WSLClientFutureOdds)
    private readonly wslClientFutureOddsRepository: Repository<WSLClientFutureOdds>,
    @InjectRepository(SLSClientFutureOdds)
    private readonly slsClientFutureOddsRepository: Repository<SLSClientFutureOdds>,
    @InjectRepository(NRXClientFutureOdds)
    private readonly nrxClientFutureOddsRepository: Repository<NRXClientFutureOdds>,
    @InjectRepository(SPRClientFutureOdds)
    private readonly sprClientFutureOddsRepository: Repository<SPRClientFutureOdds>,
    @InjectRepository(MASLClientFutureOdds)
    private readonly maslClientFutureOddsRepository: Repository<MASLClientFutureOdds>,
    @InjectRepository(FdriftClientFutureOdds)
    private readonly fdriftClientFutureOddsRepository: Repository<FdriftClientFutureOdds>,
    @InjectRepository(MOTOCRSClientFutureOdds)
    private readonly motocrsClientFutureOddsRepository: Repository<MOTOCRSClientFutureOdds>,
    @InjectRepository(F1ClientFutureOdds)
    private readonly f1ClientFutureOddsRepository: Repository<F1ClientFutureOdds>,
    @InjectRepository(MGClientFutureOdds)
    private readonly mgClientFutureOddsRepository: Repository<MGClientFutureOdds>,
    @InjectRepository(MXGPClientFutureOdds)
    private readonly mxgpClientFutureOddsRepository: Repository<MXGPClientFutureOdds>,
    @InjectRepository(JAClientFutureOdds)
    private readonly jaClientFutureOddsRepository: Repository<JAClientFutureOdds>,

    // @InjectRepository(WSLFutures)
    // private readonly wslFutureRepository: Repository<WSLFutures>,
    // @InjectRepository(SLSFutures)
    // private readonly slsFutureRepository: Repository<SLSFutures>,
    // @InjectRepository(NRXFutures)
    // private readonly nrxFutureRepository: Repository<NRXFutures>,
    // @InjectRepository(SPRFutures)
    // private readonly sprFutureRepository: Repository<SPRFutures>,
    // @InjectRepository(MASLFutures)
    // private readonly maslFutureRepository: Repository<MASLFutures>,
    // @InjectRepository(FdriftFutures)
    // private readonly fdriftFutureRepository: Repository<FdriftFutures>,
    // @InjectRepository(MOTOCRSFutures)
    // private readonly motocrsFutureRepository: Repository<MOTOCRSFutures>,
    // @InjectRepository(F1Futures)
    // private readonly f1FutureRepository: Repository<F1Futures>,
    // @InjectRepository(MGFutures)
    // private readonly mgFutureRepository: Repository<MGFutures>,
    // @InjectRepository(MXGPFutures)
    // private readonly mxgpFutureRepository: Repository<MXGPFutures>,
    // @InjectRepository(JAFutures)
    // private readonly jaFutureRepository: Repository<JAFutures>,

    private queueService: QueueService,
  ) {}

  async fetchFutures(sportType: SportsTypes, tourYearId: string): Promise<ObjectLiteral> {
    let repository: Repository<ObjectLiteral>;
    switch (sportType) {
      case SportsTypes.SURFING: {
        repository = this.wslTourYearsRepository;
        break;
      }
      case SportsTypes.SKATEBOARDING: {
        repository = this.slsTourYearsRepository;
        break;
      }
      case SportsTypes.RALLYCROSS: {
        repository = this.nrxTourYearsRepository;
        break;
      }
      case SportsTypes.SUPERCROSS: {
        repository = this.sprTourYearsRepository;
        break;
      }
      case SportsTypes.MASL: {
        repository = this.maslTourYearsRepository;
        break;
      }
      case SportsTypes.FDRIFT: {
        repository = this.fdriftTourYearsRepository;
        break;
      }
      case SportsTypes.MOTOCROSS: {
        repository = this.motocrsTourYearsRepository;
        break;
      }
      case SportsTypes.F1: {
        repository = this.f1TourYearsRepository;
        break;
      }
      case SportsTypes.MotoGP: {
        repository = this.mgTourYearsRepository;
        break;
      }
      case SportsTypes.MXGP: {
        repository = this.mxgpTourYearsRepository;
        break;
      }
      case SportsTypes.JA: {
        repository = this.jaTourYearsRepository;
        break;
      }
      default: {
        throw systemExceptions.incorrectSportType();
      }
    }

    let tours = null;
    tours = await (sportType === SportsTypes.SKATEBOARDING || sportType === SportsTypes.MASL
      ? repository.findOne({
          where: {
            id: tourYearId,
            isActive: true,
            isArchived: false,
            futures: {
              isActive: true,
              isArchived: false,
            },
          },
          relations: ["league", "event", "futures"],
          select: {
            id: true,
            year: true,
            league: {
              name: true,
              gender: true,
            },
            event: {
              id: true,
              startDate: true,
            },
            futures: {
              id: true,
              eventDate: true,
              startDate: true,
              endDate: true,
              type: true,
              status: true,
              isMarketOpen: true,
            },
          },
        })
      : repository.findOne({
          where: {
            id: tourYearId,
            isActive: true,
            isArchived: false,
            futures: {
              isActive: true,
              isArchived: false,
            },
          },
          relations: ["tour", "event", "futures"],
          select: {
            id: true,
            year: true,
            tour: {
              name: true,
              gender: true,
            },
            event: {
              id: true,
              startDate: true,
            },
            futures: {
              id: true,
              eventDate: true,
              startDate: true,
              endDate: true,
              type: true,
              status: true,
              isMarketOpen: true,
            },
          },
        }));

    if (!tours) throw toursExceptions.tourNotFound();

    return tours;
  }

  async fetchFutureOdds(
    sportType: SportsTypes,
    tourYearId: string,
    futureType: string,
  ): Promise<ObjectLiteral[]> {
    let repository: Repository<ObjectLiteral>;
    let tourRepository: Repository<ObjectLiteral>;

    switch (sportType) {
      case SportsTypes.SURFING: {
        repository = this.wslFutureOddsRepository;
        tourRepository = this.wslTourYearsRepository;
        break;
      }
      case SportsTypes.SKATEBOARDING: {
        repository = this.slsFutureOddsRepository;
        tourRepository = this.slsTourYearsRepository;
        break;
      }
      case SportsTypes.RALLYCROSS: {
        repository = this.nrxFutureOddsRepository;
        tourRepository = this.nrxTourYearsRepository;
        break;
      }
      case SportsTypes.SUPERCROSS: {
        repository = this.sprFutureOddsRepository;
        tourRepository = this.sprTourYearsRepository;
        break;
      }
      case SportsTypes.MASL: {
        repository = this.maslFutureOddsRepository;
        tourRepository = this.maslTourYearsRepository;
        break;
      }
      case SportsTypes.FDRIFT: {
        repository = this.fdriftFutureOddsRepository;
        tourRepository = this.fdriftTourYearsRepository;
        break;
      }
      case SportsTypes.MOTOCROSS: {
        repository = this.motocrsFutureOddsRepository;
        tourRepository = this.motocrsTourYearsRepository;
        break;
      }
      case SportsTypes.F1: {
        repository = this.f1FutureOddsRepository;
        tourRepository = this.f1TourYearsRepository;
        break;
      }
      case SportsTypes.MotoGP: {
        repository = this.mgFutureOddsRepository;
        tourRepository = this.mgTourYearsRepository;
        break;
      }
      case SportsTypes.MXGP: {
        repository = this.mxgpFutureOddsRepository;
        tourRepository = this.mxgpTourYearsRepository;
        break;
      }
      case SportsTypes.JA: {
        repository = this.jaFutureOddsRepository;
        tourRepository = this.jaTourYearsRepository;
        break;
      }
      default: {
        throw systemExceptions.incorrectSportType();
      }
    }

    const tour = await tourRepository.findOne({
      where: {
        id: tourYearId,
        isActive: true,
        isArchived: false,
        futures: {
          type: futureType,
          isActive: true,
          isArchived: false,
        },
      },
      relations: ["futures"],
      select: {
        id: true,
        futures: {
          id: true,
        },
      },
    });
    if (!tour || !tour.futures) {
      return [];
    }

    const odds = await repository.find({
      where: {
        futureId: tour.futures[0].id,
        isActive: true,
        isArchived: false,
      },
      relations: ![SportsTypes.MASL, SportsTypes.JA].includes(sportType) ? ["athlete"] : ["team"],
      order: {
        updatedAt: "DESC",
      },
      select: ![SportsTypes.MASL, SportsTypes.JA].includes(sportType)
        ? {
            id: true,
            odds: true,
            probability: true,
            trueProbability: true,
            hasModifiedProbability: true,
            updatedAt: true,
            athlete: {
              id: true,
              firstName: true,
              middleName: true,
              lastName: true,
              gender: true,
              nationality: true,
              stance: true,
            },
          }
        : {
            id: true,
            odds: true,
            probability: true,
            trueProbability: true,
            hasModifiedProbability: true,
            updatedAt: true,
            team: {
              id: true,
              name: true,
            },
          },
    });

    return odds;
  }

  async updateFutureOdds(sportType: SportsTypes, payload: UpdateFutureOddsDto) {
    try {
      let repository: Repository<ObjectLiteral>;

      switch (sportType) {
        case SportsTypes.SURFING: {
          repository = this.wslFutureOddsRepository;
          break;
        }
        case SportsTypes.SKATEBOARDING: {
          repository = this.slsFutureOddsRepository;
          break;
        }
        case SportsTypes.RALLYCROSS: {
          repository = this.nrxFutureOddsRepository;
          break;
        }
        case SportsTypes.SUPERCROSS: {
          repository = this.sprFutureOddsRepository;
          break;
        }
        case SportsTypes.MASL: {
          repository = this.maslFutureOddsRepository;
          break;
        }
        case SportsTypes.FDRIFT: {
          repository = this.fdriftFutureOddsRepository;
          break;
        }
        case SportsTypes.MOTOCROSS: {
          repository = this.motocrsFutureOddsRepository;
          break;
        }
        case SportsTypes.F1: {
          repository = this.f1FutureOddsRepository;
          break;
        }
        case SportsTypes.MotoGP: {
          repository = this.mgFutureOddsRepository;
          break;
        }
        case SportsTypes.MXGP: {
          repository = this.mxgpFutureOddsRepository;
          break;
        }
        case SportsTypes.JA: {
          repository = this.jaFutureOddsRepository;
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

  public async fetchClientFutureOdd(
    sportType: SportsTypes,
    tourYearId: string,
    futureType: string,
  ): Promise<ObjectLiteral> {
    let repository: Repository<ObjectLiteral>;
    let tourRepository: Repository<ObjectLiteral>;
    switch (sportType) {
      case SportsTypes.SURFING: {
        repository = this.wslClientFutureOddsRepository;
        tourRepository = this.wslTourYearsRepository;
        break;
      }
      case SportsTypes.SKATEBOARDING: {
        repository = this.slsClientFutureOddsRepository;
        tourRepository = this.slsTourYearsRepository;
        break;
      }
      case SportsTypes.RALLYCROSS: {
        repository = this.nrxClientFutureOddsRepository;
        tourRepository = this.nrxTourYearsRepository;
        break;
      }
      case SportsTypes.SUPERCROSS: {
        repository = this.sprClientFutureOddsRepository;
        tourRepository = this.sprTourYearsRepository;
        break;
      }
      case SportsTypes.MASL: {
        repository = this.maslClientFutureOddsRepository;
        tourRepository = this.maslTourYearsRepository;
        break;
      }
      case SportsTypes.FDRIFT: {
        repository = this.fdriftClientFutureOddsRepository;
        tourRepository = this.fdriftTourYearsRepository;
        break;
      }
      case SportsTypes.MOTOCROSS: {
        repository = this.motocrsClientFutureOddsRepository;
        tourRepository = this.motocrsTourYearsRepository;
        break;
      }
      case SportsTypes.F1: {
        repository = this.f1ClientFutureOddsRepository;
        tourRepository = this.f1TourYearsRepository;
        break;
      }
      case SportsTypes.MotoGP: {
        repository = this.mgClientFutureOddsRepository;
        tourRepository = this.mgTourYearsRepository;
        break;
      }
      case SportsTypes.MXGP: {
        repository = this.mxgpClientFutureOddsRepository;
        tourRepository = this.mxgpTourYearsRepository;
        break;
      }
      case SportsTypes.JA: {
        repository = this.jaClientFutureOddsRepository;
        tourRepository = this.jaTourYearsRepository;
        break;
      }
      default: {
        throw systemExceptions.incorrectSportType();
      }
    }
    const tour = await tourRepository.findOne({
      where: {
        id: tourYearId,
        isActive: true,
        isArchived: false,
        futures: {
          type: futureType,
          isActive: true,
          isArchived: false,
        },
      },
      relations: ["futures"],
      select: {
        id: true,
        futures: {
          id: true,
        },
      },
    });

    if (!tour || !tour.futures) {
      return null;
    }

    const data = await repository.findOne({
      where: {
        futureId: tour.futures[0].id,
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

    return data;
  }

  async oddsGoLive(
    sportType: SportsTypes,
    futureType: FutureMarkets,
    tourYearId: string,
  ): Promise<boolean> {
    let futureOddRepository: Repository<ObjectLiteral>;
    let clientFutureOddsEntity: EntityTarget<ObjectLiteral>;
    let futuresEntity: EntityTarget<ObjectLiteral>;
    let clientFutureOddsTable: string;
    let futureOddsTable: string;

    switch (sportType) {
      case SportsTypes.SURFING: {
        futureOddRepository = this.wslFutureOddsRepository;
        clientFutureOddsEntity = WSLClientFutureOdds;
        futuresEntity = WSLFutures;
        clientFutureOddsTable = `${SportsDbSchema.WSL}."clientFutureOdds"`;
        futureOddsTable = `${SportsDbSchema.WSL}."futureOdds"`;
        break;
      }
      case SportsTypes.SKATEBOARDING: {
        futureOddRepository = this.slsFutureOddsRepository;
        clientFutureOddsEntity = SLSClientFutureOdds;
        futuresEntity = SLSFutures;
        clientFutureOddsTable = `${SportsDbSchema.SLS}."clientFutureOdds"`;
        futureOddsTable = `${SportsDbSchema.SLS}."futureOdds"`;
        break;
      }
      case SportsTypes.RALLYCROSS: {
        futureOddRepository = this.nrxFutureOddsRepository;
        clientFutureOddsEntity = NRXClientFutureOdds;
        futuresEntity = NRXFutures;
        clientFutureOddsTable = `${SportsDbSchema.NRX}."clientFutureOdds"`;
        futureOddsTable = `${SportsDbSchema.NRX}."futureOdds"`;
        break;
      }
      case SportsTypes.SUPERCROSS: {
        futureOddRepository = this.sprFutureOddsRepository;
        clientFutureOddsEntity = SPRClientFutureOdds;
        futuresEntity = SPRFutures;
        clientFutureOddsTable = `${SportsDbSchema.SPR}."clientFutureOdds"`;
        futureOddsTable = `${SportsDbSchema.SPR}."futureOdds"`;
        break;
      }
      case SportsTypes.MASL: {
        futureOddRepository = this.maslFutureOddsRepository;
        clientFutureOddsEntity = MASLClientFutureOdds;
        futuresEntity = MASLFutures;
        clientFutureOddsTable = `${SportsDbSchema.MASL}."clientFutureOdds"`;
        futureOddsTable = `${SportsDbSchema.MASL}."futureOdds"`;
        break;
      }
      case SportsTypes.FDRIFT: {
        futureOddRepository = this.fdriftFutureOddsRepository;
        clientFutureOddsEntity = FdriftClientFutureOdds;
        futuresEntity = FdriftFutures;
        clientFutureOddsTable = `${SportsDbSchema.FDRIFT}."clientFutureOdds"`;
        futureOddsTable = `${SportsDbSchema.FDRIFT}."futureOdds"`;
        break;
      }
      case SportsTypes.MOTOCROSS: {
        futureOddRepository = this.motocrsFutureOddsRepository;
        clientFutureOddsEntity = MOTOCRSClientFutureOdds;
        futuresEntity = MOTOCRSFutures;
        clientFutureOddsTable = `${SportsDbSchema.MOTOCRS}."clientFutureOdds"`;
        futureOddsTable = `${SportsDbSchema.MOTOCRS}."futureOdds"`;
        break;
      }
      case SportsTypes.F1: {
        futureOddRepository = this.f1FutureOddsRepository;
        clientFutureOddsEntity = F1ClientFutureOdds;
        futuresEntity = F1Futures;
        clientFutureOddsTable = `${SportsDbSchema.F1}."clientFutureOdds"`;
        futureOddsTable = `${SportsDbSchema.F1}."futureOdds"`;
        break;
      }
      case SportsTypes.MotoGP: {
        futureOddRepository = this.mgFutureOddsRepository;
        clientFutureOddsEntity = MGClientFutureOdds;
        futuresEntity = MGFutures;
        clientFutureOddsTable = `${SportsDbSchema.MotoGP}."clientFutureOdds"`;
        futureOddsTable = `${SportsDbSchema.MotoGP}."futureOdds"`;
        break;
      }
      case SportsTypes.MXGP: {
        futureOddRepository = this.mxgpFutureOddsRepository;
        clientFutureOddsEntity = MXGPClientFutureOdds;
        futuresEntity = MXGPFutures;
        clientFutureOddsTable = `${SportsDbSchema.MXGP}."clientFutureOdds"`;
        futureOddsTable = `${SportsDbSchema.MXGP}."futureOdds"`;
        break;
      }
      case SportsTypes.JA: {
        futureOddRepository = this.jaFutureOddsRepository;
        clientFutureOddsEntity = JAClientFutureOdds;
        futuresEntity = JAFutures;
        clientFutureOddsTable = `${SportsDbSchema.JA}."clientFutureOdds"`;
        futureOddsTable = `${SportsDbSchema.JA}."futureOdds"`;
        break;
      }
      default: {
        throw systemExceptions.incorrectSportType();
      }
    }

    await futureOddRepository.manager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        const futureDb = await transactionalEntityManager.findOne(futuresEntity, {
          where: {
            tourYearId,
            type: futureType,
            isActive: true,
            isArchived: false,
          },
          select: {
            id: true,
          },
        });
        if (!futureDb) return;

        await transactionalEntityManager.update(
          clientFutureOddsEntity,
          {
            futureId: futureDb.id,
          },
          {
            isActive: false,
            isArchived: true,
          },
        );

        await transactionalEntityManager.query(`
              INSERT INTO ${clientFutureOddsTable}("futureId", ${
          ![SportsTypes.MASL, SportsTypes.JA].includes(sportType) ? '"athleteId"' : '"teamId"'
        }, "odds", "trueProbability", "hasModifiedProbability", "probability")
              SELECT '${futureDb.id}' as futureId, ${
          ![SportsTypes.MASL, SportsTypes.JA].includes(sportType) ? '"athleteId"' : '"teamId"'
        }, "odds", "trueProbability", "hasModifiedProbability", "probability" FROM ${futureOddsTable}
              WHERE ${futureOddsTable}."futureId" = '${futureDb.id}';
            `);

        let market: OddMarkets;
        switch (futureType) {
          case FutureMarkets.WINNER:
            market = OddMarkets.FUTURES_WINNER;
            break;

          case FutureMarkets.TOP_2:
            market = OddMarkets.FUTURES_TOP_2;
            break;

          case FutureMarkets.TOP_3:
            market = OddMarkets.FUTURES_TOP_3;
            break;

          case FutureMarkets.TOP_5:
            market = OddMarkets.FUTURES_TOP_5;
            break;

          case FutureMarkets.TOP_10:
            market = OddMarkets.FUTURES_TOP_10;
            break;

          case FutureMarkets.MAKE_CUT:
            market = OddMarkets.FUTURES_MAKE_CUT;
            break;

          case FutureMarkets.MAKE_PLAYOFFS:
            market = OddMarkets.FUTURES_MAKE_PLAYOFFS;
            break;
        }

        if (market)
          await this.queueService.notifyMarketPublishNotification({
            futureId: futureDb.id,
            sportType,
            market,
          });
      },
    );

    return true;
  }

  async updateMarketStatus(
    sportType: SportsTypes,
    tourYearId: string,
    isMarketOpen: boolean,
  ): Promise<boolean> {
    let repository: Repository<ObjectLiteral>;
    let futuresEntity: EntityTarget<ObjectLiteral>;

    switch (sportType) {
      case SportsTypes.SURFING: {
        repository = this.wslFutureOddsRepository;
        futuresEntity = WSLFutures;
        break;
      }
      case SportsTypes.SKATEBOARDING: {
        repository = this.slsFutureOddsRepository;
        futuresEntity = SLSFutures;
        break;
      }
      case SportsTypes.RALLYCROSS: {
        repository = this.nrxFutureOddsRepository;
        futuresEntity = NRXFutures;
        break;
      }
      case SportsTypes.SUPERCROSS: {
        repository = this.sprFutureOddsRepository;
        futuresEntity = SPRFutures;
        break;
      }
      case SportsTypes.MASL: {
        repository = this.maslFutureOddsRepository;
        futuresEntity = MASLFutures;
        break;
      }
      case SportsTypes.FDRIFT: {
        repository = this.fdriftFutureOddsRepository;
        futuresEntity = FdriftFutures;
        break;
      }
      case SportsTypes.MOTOCROSS: {
        repository = this.motocrsFutureOddsRepository;
        futuresEntity = MOTOCRSFutures;
        break;
      }
      case SportsTypes.F1: {
        repository = this.f1FutureOddsRepository;
        futuresEntity = F1Futures;
        break;
      }
      case SportsTypes.MotoGP: {
        repository = this.mgFutureOddsRepository;
        futuresEntity = MGFutures;
        break;
      }
      case SportsTypes.MXGP: {
        repository = this.mxgpFutureOddsRepository;
        futuresEntity = MXGPFutures;
        break;
      }
      case SportsTypes.JA: {
        repository = this.jaFutureOddsRepository;
        futuresEntity = JAFutures;
        break;
      }
      default: {
        throw systemExceptions.incorrectSportType();
      }
    }

    await repository.manager.transaction(async (transactionalEntityManager: EntityManager) => {
      await transactionalEntityManager.update(
        futuresEntity,
        {
          tourYearId,
        },
        {
          isMarketOpen,
        },
      );
    });

    return true;
  }

  async updateEventDate(
    sportType: SportsTypes,
    tourYearId: string,
    eventDate: string,
  ): Promise<boolean> {
    let repository: Repository<ObjectLiteral>;
    let futuresEntity: EntityTarget<ObjectLiteral>;

    switch (sportType) {
      case SportsTypes.SURFING: {
        repository = this.wslFutureOddsRepository;
        futuresEntity = WSLFutures;
        break;
      }
      case SportsTypes.SKATEBOARDING: {
        repository = this.slsFutureOddsRepository;
        futuresEntity = SLSFutures;
        break;
      }
      case SportsTypes.RALLYCROSS: {
        repository = this.nrxFutureOddsRepository;
        futuresEntity = NRXFutures;
        break;
      }
      case SportsTypes.SUPERCROSS: {
        repository = this.sprFutureOddsRepository;
        futuresEntity = SPRFutures;
        break;
      }
      case SportsTypes.MASL: {
        repository = this.maslFutureOddsRepository;
        futuresEntity = MASLFutures;
        break;
      }
      case SportsTypes.FDRIFT: {
        repository = this.fdriftFutureOddsRepository;
        futuresEntity = FdriftFutures;
        break;
      }
      case SportsTypes.MOTOCROSS: {
        repository = this.motocrsFutureOddsRepository;
        futuresEntity = MOTOCRSFutures;
        break;
      }
      case SportsTypes.F1: {
        repository = this.f1FutureOddsRepository;
        futuresEntity = F1Futures;
        break;
      }
      case SportsTypes.MotoGP: {
        repository = this.mgFutureOddsRepository;
        futuresEntity = MGFutures;
        break;
      }
      case SportsTypes.MXGP: {
        repository = this.mxgpFutureOddsRepository;
        futuresEntity = MXGPFutures;
        break;
      }
      case SportsTypes.JA: {
        repository = this.jaFutureOddsRepository;
        futuresEntity = JAFutures;
        break;
      }
      default: {
        throw systemExceptions.incorrectSportType();
      }
    }

    await repository.manager.transaction(async (transactionalEntityManager: EntityManager) => {
      await transactionalEntityManager.update(
        futuresEntity,
        {
          tourYearId,
        },
        {
          eventDate,
        },
      );
    });

    return true;
  }
}

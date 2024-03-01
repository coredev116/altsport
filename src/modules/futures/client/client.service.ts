import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, ObjectLiteral } from "typeorm";
import groupBy from "lodash.groupby";

import { SportsTypes, SportNames } from "../../../constants/system";

import FutureOddsDownload, {
  ClientFutureOdds,
} from "./schemas/response/downloadFutureOdds.reponse";

import * as systemExceptions from "../../../exceptions/system";
import * as toursExceptions from "../../../exceptions/tours";
import * as futuresExceptions from "../../../exceptions/futures";

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
import FDriftFutures from "../../../entities/fdrift/futures.entity";
import MOTOCRSFutures from "../../../entities/motocrs/futures.entity";
import F1Futures from "../../../entities/f1/futures.entity";
import MGFutures from "../../../entities/mg/futures.entity";
import MXGPFutures from "../../../entities/mxgp/futures.entity";
import JAFutures from "../../../entities/ja/futures.entity";

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
export class ClientService {
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

    @InjectRepository(WSLFutures)
    private readonly wslFuturesRepository: Repository<WSLFutures>,
    @InjectRepository(SLSFutures)
    private readonly slsFuturesRepository: Repository<SLSFutures>,
    @InjectRepository(NRXFutures)
    private readonly nrxFuturesRepository: Repository<NRXFutures>,
    @InjectRepository(SPRFutures)
    private readonly sprFuturesRepository: Repository<SPRFutures>,
    @InjectRepository(MASLFutures)
    private readonly maslFuturesRepository: Repository<MASLFutures>,
    @InjectRepository(FDriftFutures)
    private readonly fdriftFuturesRepository: Repository<FDriftFutures>,
    @InjectRepository(MOTOCRSFutures)
    private readonly motocrsFuturesRepository: Repository<MOTOCRSFutures>,
    @InjectRepository(F1Futures)
    private readonly f1FuturesRepository: Repository<F1Futures>,
    @InjectRepository(MGFutures)
    private readonly mgFuturesRepository: Repository<MGFutures>,
    @InjectRepository(MXGPFutures)
    private readonly mxgpFuturesRepository: Repository<MXGPFutures>,
    @InjectRepository(JAFutures)
    private readonly jaFuturesRepository: Repository<JAFutures>,
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
              startDate: true,
              endDate: true,
              eventDate: true,
              type: true,
              status: true,
              isMarketOpen: true,
            },
          },
          order: {
            event: {
              startDate: "DESC",
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
            event: {
              id: true,
              startDate: true,
            },
            id: true,
            year: true,
            tour: {
              name: true,
              gender: true,
            },
            futures: {
              id: true,
              startDate: true,
              endDate: true,
              eventDate: true,
              type: true,
              status: true,
              isMarketOpen: true,
            },
          },
          order: {
            event: {
              startDate: "DESC",
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
              playerStatus: true,
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

  async futureOddsDownload(
    sportType: SportsTypes,
    futureId: string,
    futureType: string,
  ): Promise<FutureOddsDownload> {
    let repository: Repository<ObjectLiteral>;
    let futureRepository: Repository<ObjectLiteral>;
    let sportName: string;

    switch (sportType) {
      case SportsTypes.SURFING: {
        repository = this.wslClientFutureOddsRepository;
        futureRepository = this.wslFuturesRepository;
        sportName = SportNames[SportsTypes.SURFING];
        break;
      }
      case SportsTypes.SKATEBOARDING: {
        repository = this.slsClientFutureOddsRepository;
        futureRepository = this.slsFuturesRepository;
        sportName = SportNames[SportsTypes.SKATEBOARDING];
        break;
      }
      case SportsTypes.RALLYCROSS: {
        repository = this.nrxClientFutureOddsRepository;
        futureRepository = this.nrxFuturesRepository;
        sportName = SportNames[SportsTypes.RALLYCROSS];
        break;
      }
      case SportsTypes.SUPERCROSS: {
        repository = this.sprClientFutureOddsRepository;
        futureRepository = this.sprFuturesRepository;
        sportName = SportNames[SportsTypes.SUPERCROSS];
        break;
      }
      case SportsTypes.MASL: {
        repository = this.maslClientFutureOddsRepository;
        futureRepository = this.maslFuturesRepository;
        sportName = SportNames[SportsTypes.MASL];
        break;
      }
      case SportsTypes.FDRIFT: {
        repository = this.fdriftClientFutureOddsRepository;
        futureRepository = this.fdriftFuturesRepository;
        sportName = SportNames[SportsTypes.FDRIFT];
        break;
      }
      case SportsTypes.MOTOCROSS: {
        repository = this.motocrsClientFutureOddsRepository;
        futureRepository = this.motocrsFuturesRepository;
        sportName = SportNames[SportsTypes.MOTOCROSS];
        break;
      }
      case SportsTypes.F1: {
        repository = this.f1ClientFutureOddsRepository;
        futureRepository = this.f1FuturesRepository;
        sportName = SportNames[SportsTypes.F1];
        break;
      }
      case SportsTypes.MotoGP: {
        repository = this.mgClientFutureOddsRepository;
        futureRepository = this.mgFuturesRepository;
        sportName = SportNames[SportsTypes.MotoGP];
        break;
      }
      case SportsTypes.MXGP: {
        repository = this.mxgpClientFutureOddsRepository;
        futureRepository = this.mxgpFuturesRepository;
        sportName = SportNames[SportsTypes.MXGP];
        break;
      }
      case SportsTypes.JA: {
        repository = this.jaClientFutureOddsRepository;
        futureRepository = this.jaFuturesRepository;
        sportName = SportNames[SportsTypes.JA];
        break;
      }
      default: {
        throw systemExceptions.incorrectSportType();
      }
    }

    const futureDb = await futureRepository.findOne({
      where: {
        id: futureId,
        type: futureType,
        isActive: true,
        isArchived: false,
      },
      select: {
        id: true,
      },
    });

    if (!futureDb) throw futuresExceptions.futuresNotFound();

    const result = await repository.find({
      where: {
        futureId,
        isActive: true,
        isArchived: false,
      },
      relations: [SportsTypes.MASL, SportsTypes.JA].includes(sportType) ? ["team"] : ["athlete"],
      order: {
        updatedAt: "DESC",
      },
      select: [SportsTypes.MASL, SportsTypes.JA].includes(sportType)
        ? {
            id: true,
            odds: true,
            probability: true,
            trueProbability: true,
            hasModifiedProbability: true,
            updatedAt: true,
            createdAt: true,
            team: {
              id: true,
              name: true,
            },
          }
        : {
            id: true,
            odds: true,
            probability: true,
            trueProbability: true,
            hasModifiedProbability: true,
            updatedAt: true,
            createdAt: true,
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
    });

    const odds: ClientFutureOdds[] = result.map((future) => ({
      id: future.id,
      odds: +Number(future.odds).toFixed(2),
      probability: +Number(future.probability).toFixed(2),
      trueProbability: +Number(future.trueProbability).toFixed(2),
      hasModifiedProbability: future.hasModifiedProbability,
      athlete: [SportsTypes.MASL, SportsTypes.JA].includes(sportType)
        ? {
            id: future.team.id,
            firstName: future.team.name,
            middleName: "",
            lastName: "",
            gender: "",
            nationality: "",
            stance: "",
          }
        : {
            id: future.athlete.id,
            firstName: future.athlete.firstName,
            middleName: future.athlete.middleName,
            lastName: future.athlete.lastName,
            gender: future.athlete.gender,
            nationality: future.athlete.nationality,
            stance: future.athlete.stance,
          },
      createdAt: future.createdAt,
    }));

    return {
      sport: sportName,
      publishes: groupBy(odds, (d) => new Date(d.createdAt).toISOString()),
    };
  }
}

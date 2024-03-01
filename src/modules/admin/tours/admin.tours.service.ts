import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, FindManyOptions } from "typeorm";

import { SportsTypes } from "../../../constants/system";

import SLSTours from "../../../entities/sls/leagues.entity";
import WSLTours from "../../../entities/wsl/tours.entity";
import NRXTours from "../../../entities/nrx/tours.entity";
import SPRTours from "../../../entities/spr/tours.entity";
import MASLTours from "../../../entities/masl/leagues.entity";
import MotocrossTours from "../../../entities/motocrs/tours.entity";
import FormulaDriftTours from "../../../entities/fdrift/tours.entity";
import F1Tours from "../../../entities/f1/tours.entity";
import MGTours from "../../../entities/mg/tours.entity";
import MXGPTours from "../../../entities/mxgp/tours.entity";
import JATours from "../../../entities/ja/tours.entity";

import AdminToursResponse from "./schemas/response/admin.tours.response";

@Injectable()
export class AdminToursService {
  constructor(
    @InjectRepository(SLSTours)
    private readonly slsToursRepository: Repository<SLSTours>,

    @InjectRepository(WSLTours)
    private readonly wslToursRepository: Repository<WSLTours>,

    @InjectRepository(NRXTours)
    private readonly nrxToursRepository: Repository<NRXTours>,

    @InjectRepository(SPRTours)
    private readonly sprToursRepository: Repository<SPRTours>,

    @InjectRepository(MASLTours)
    private readonly maslToursRepository: Repository<MASLTours>,

    @InjectRepository(MotocrossTours)
    private readonly motocrsToursRepository: Repository<MotocrossTours>,

    @InjectRepository(FormulaDriftTours)
    private readonly fdriftToursRepository: Repository<FormulaDriftTours>,

    @InjectRepository(F1Tours)
    private readonly f1ToursRepository: Repository<F1Tours>,

    @InjectRepository(MGTours)
    private readonly mgToursRepository: Repository<MGTours>,

    @InjectRepository(MXGPTours)
    private readonly mxgpToursRepository: Repository<MXGPTours>,

    @InjectRepository(JATours)
    private readonly jaToursRepository: Repository<JATours>,
  ) {}

  public async fetchTours(sportType: SportsTypes): Promise<AdminToursResponse[]> {
    let results: AdminToursResponse[] = [];

    const options: FindManyOptions = {
      where: {
        isActive: true,
        isArchived: false,
      },
      select: {
        id: true,
        name: true,
        gender: true,
        years: {
          id: true,
          year: true,
        },
      },
      relations: ["years"],
    };

    switch (sportType) {
      case SportsTypes.SURFING:
        results = await this.wslToursRepository.find(options);
        break;

      case SportsTypes.SKATEBOARDING:
        results = await this.slsToursRepository.find(options);
        break;

      case SportsTypes.RALLYCROSS:
        results = await this.nrxToursRepository.find(options);
        break;

      case SportsTypes.SUPERCROSS:
        results = await this.sprToursRepository.find(options);
        break;

      case SportsTypes.MASL:
        results = await this.maslToursRepository.find(options);
        break;

      case SportsTypes.MOTOCROSS:
        results = await this.motocrsToursRepository.find(options);
        break;

      case SportsTypes.FDRIFT:
        results = await this.fdriftToursRepository.find(options);
        break;

      case SportsTypes.F1:
        results = await this.f1ToursRepository.find(options);
        break;

      case SportsTypes.MotoGP:
        results = await this.mgToursRepository.find(options);
        break;

      case SportsTypes.MXGP:
        results = await this.mxgpToursRepository.find(options);
        break;

      case SportsTypes.JA:
        results = await this.jaToursRepository.find(options);
        break;

      default:
        break;
    }

    return results;
  }
}

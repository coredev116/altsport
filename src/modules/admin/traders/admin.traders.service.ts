import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, IsNull, Not } from "typeorm";

import { SportsTypes } from "../../../constants/system";

import SLSEvents from "../../../entities/sls/events.entity";
import WSLEvents from "../../../entities/wsl/events.entity";
import NRXEvents from "../../../entities/nrx/events.entity";
import SPREvents from "../../../entities/spr/events.entity";
import PBREvents from "../../../entities/pbr/events.entity";
import MASLEvents from "../../../entities/masl/events.entity";
import F1Events from "../../../entities/f1/events.entity";
import FDriftEvents from "../../../entities/fdrift/events.entity";
import MotocrossEvents from "../../../entities/motocrs/events.entity";
import MGEvents from "../../../entities/mg/events.entity";
import MXGPEvents from "../../../entities/mxgp/events.entity";
import JAEvents from "../../../entities/ja/events.entity";

import EventLocationGroupResponse from "./schemas/response/eventLocationGroup.response";

@Injectable()
export class AdminTradersService {
  constructor(
    @InjectRepository(SLSEvents)
    private readonly slsEventsRepository: Repository<SLSEvents>,

    @InjectRepository(WSLEvents)
    private readonly wslEventsRepository: Repository<WSLEvents>,

    @InjectRepository(NRXEvents)
    private readonly nrxEventsRepository: Repository<NRXEvents>,

    @InjectRepository(SPREvents)
    private readonly sprEventsRepository: Repository<SPREvents>,

    @InjectRepository(PBREvents)
    private readonly pbrEventsRepository: Repository<PBREvents>,

    @InjectRepository(MASLEvents)
    private readonly maslEventsRepository: Repository<MASLEvents>,

    @InjectRepository(F1Events)
    private readonly f1EventsRepository: Repository<F1Events>,

    @InjectRepository(FDriftEvents)
    private readonly fdriftEventsRepository: Repository<FDriftEvents>,

    @InjectRepository(MotocrossEvents)
    private readonly motocrsEventsRepository: Repository<MotocrossEvents>,

    @InjectRepository(MGEvents)
    private readonly mgEventsRepository: Repository<MGEvents>,

    @InjectRepository(MXGPEvents)
    private readonly mxgpEventsRepository: Repository<MXGPEvents>,

    @InjectRepository(JAEvents)
    private readonly jaEventsRepository: Repository<JAEvents>,
  ) {}

  public async fetchEventLocationGroups(
    sportType: SportsTypes,
  ): Promise<EventLocationGroupResponse[]> {
    let eventRepository;

    switch (sportType) {
      case SportsTypes.SURFING:
        eventRepository = this.wslEventsRepository;
        break;

      case SportsTypes.SKATEBOARDING:
        eventRepository = this.slsEventsRepository;
        break;

      case SportsTypes.RALLYCROSS:
        eventRepository = this.nrxEventsRepository;
        break;

      case SportsTypes.SUPERCROSS:
        eventRepository = this.sprEventsRepository;
        break;

      case SportsTypes.PBR:
        eventRepository = this.pbrEventsRepository;
        break;

      case SportsTypes.MASL:
        eventRepository = this.maslEventsRepository;
        break;

      case SportsTypes.F1:
        eventRepository = this.f1EventsRepository;
        break;

      case SportsTypes.FDRIFT:
        eventRepository = this.fdriftEventsRepository;
        break;

      case SportsTypes.MOTOCROSS:
        eventRepository = this.motocrsEventsRepository;
        break;

      case SportsTypes.MotoGP:
        eventRepository = this.mgEventsRepository;
        break;

      case SportsTypes.MXGP:
        eventRepository = this.mxgpEventsRepository;
        break;

      case SportsTypes.JA:
        eventRepository = this.jaEventsRepository;
        break;

      default:
        break;
    }

    let events = await eventRepository
      .createQueryBuilder("events")
      .select(["events.id", "events.eventLocationGroup"])
      .distinctOn(["events.eventLocationGroup"])
      .where({
        isActive: true,
        isArchived: false,
        eventLocationGroup: Not(IsNull()),
      })
      .getMany();

    events = events.map((e) => {
      return {
        id: e.id,
        eventLocationGroup: e.eventLocationGroup,
      };
    });

    return events;
  }
}

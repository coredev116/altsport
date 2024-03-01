import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, MoreThanOrEqual } from "typeorm";
import { parse, isBefore } from "date-fns";

import WSLTours from "../../../entities/wsl/tours.entity";
import SLSLeagues from "../../../entities/sls/leagues.entity";
import NRXTours from "../../../entities/nrx/tours.entity";
import SPRTours from "../../../entities/spr/tours.entity";
import FDriftTours from "../../../entities/fdrift/tours.entity";
import MotocrossTours from "../../../entities/motocrs/tours.entity";
import F1Tours from "../../../entities/f1/tours.entity";
import MGTours from "../../../entities/mg/tours.entity";
import MXGPTours from "../../../entities/mxgp/tours.entity";
import JATours from "../../../entities/ja/tours.entity";
import MASLLeagueYears from "../../../entities/masl/leagueYears.entity";
import MASLLeagues from "../../../entities/masl/leagues.entity";
import MASLEvents from "../../../entities/masl/events.entity";

import { SportsTypes, EventStatus } from "../../../constants/system";

@Injectable()
export default class SportsService {
  constructor(
    @InjectRepository(WSLTours) private readonly wslToursRepository: Repository<WSLTours>,
    @InjectRepository(SLSLeagues) private readonly slsLeaguesRepository: Repository<SLSLeagues>,
    @InjectRepository(MASLLeagues) private readonly maslLeaguesRepository: Repository<MASLLeagues>,
    @InjectRepository(NRXTours) private readonly nrxToursRepository: Repository<NRXTours>,
    @InjectRepository(SPRTours) private readonly sprToursRepository: Repository<SPRTours>,
    @InjectRepository(FDriftTours) private readonly fdriftToursRepository: Repository<FDriftTours>,
    @InjectRepository(MotocrossTours)
    private readonly motocrossToursRepository: Repository<MotocrossTours>,
    @InjectRepository(F1Tours) private readonly f1ToursRepository: Repository<F1Tours>,
    @InjectRepository(MGTours) private readonly mgToursRepository: Repository<MGTours>,
    @InjectRepository(MXGPTours) private readonly mxgpToursRepository: Repository<MXGPTours>,
    @InjectRepository(JATours) private readonly jaToursRepository: Repository<JATours>,
    @InjectRepository(MASLEvents) private readonly maslEventsRepository: Repository<MASLEvents>,
  ) {}

  async fetchSportsFutures() {
    const [
      wslFutures,
      slsFutures,
      maslFutures,
      nrxFutures,
      sprFutures,
      fdriftFutures,
      motocrossFutures,
      f1Futures,
      mgFutures,
      mxgpFutures,
      jaFutures,
    ] = await Promise.all([
      this.wslToursRepository.find({
        relations: ["years.futures"],
        where: {
          isActive: true,
          isArchived: false,
          years: {
            futures: {
              isActive: true,
              isArchived: false,
            },
          },
        },
        select: {
          id: true,
          gender: true,
          name: true,
          years: {
            id: true,
            year: true,
            tourId: true,
            tour: {
              id: true,
              gender: true,
              name: true,
            },
            futures: {
              id: true,
              type: true,
              status: true,
              isMarketOpen: true,
            },
          },
        },
        order: {
          years: {
            year: "DESC",
          },
        },
      }),
      this.slsLeaguesRepository.find({
        relations: ["years.futures"],
        where: {
          isActive: true,
          isArchived: false,
          years: {
            futures: {
              isActive: true,
              isArchived: false,
            },
          },
        },
        select: {
          id: true,
          gender: true,
          name: true,
          years: {
            id: true,
            year: true,
            leagueId: true,
            league: {
              id: true,
              gender: true,
              name: true,
            },
            futures: {
              id: true,
              type: true,
              status: true,
              isMarketOpen: true,
            },
          },
        },
        order: {
          years: {
            year: "DESC",
          },
        },
      }),
      this.maslLeaguesRepository.find({
        relations: ["years.futures"],
        where: {
          isActive: true,
          isArchived: false,
          years: {
            futures: {
              isActive: true,
              isArchived: false,
            },
          },
        },
        select: {
          id: true,
          gender: true,
          name: true,
          years: {
            id: true,
            year: true,
            leagueId: true,
            league: {
              id: true,
              gender: true,
              name: true,
            },
            futures: {
              id: true,
              type: true,
              status: true,
              isMarketOpen: true,
            },
          },
        },
        order: {
          years: {
            year: "DESC",
          },
        },
      }),
      this.nrxToursRepository.find({
        relations: ["years.futures"],
        where: {
          isActive: true,
          isArchived: false,
          years: {
            futures: {
              isActive: true,
              isArchived: false,
            },
          },
        },
        select: {
          id: true,
          gender: true,
          name: true,
          years: {
            id: true,
            year: true,
            tourId: true,
            tour: {
              id: true,
              gender: true,
              name: true,
            },
            futures: {
              id: true,
              type: true,
              status: true,
              isMarketOpen: true,
            },
          },
        },
        order: {
          years: {
            year: "DESC",
          },
        },
      }),
      this.sprToursRepository.find({
        relations: ["years.futures"],
        where: {
          isActive: true,
          isArchived: false,
          years: {
            futures: {
              isActive: true,
              isArchived: false,
            },
          },
        },
        select: {
          id: true,
          gender: true,
          name: true,
          years: {
            id: true,
            year: true,
            tourId: true,
            tour: {
              id: true,
              gender: true,
              name: true,
            },
            futures: {
              id: true,
              type: true,
              status: true,
              isMarketOpen: true,
            },
          },
        },
        order: {
          years: {
            year: "DESC",
          },
        },
      }),

      this.fdriftToursRepository.find({
        relations: ["years.futures"],
        where: {
          isActive: true,
          isArchived: false,
          years: {
            futures: {
              isActive: true,
              isArchived: false,
            },
          },
        },
        select: {
          id: true,
          gender: true,
          name: true,
          years: {
            id: true,
            year: true,
            tourId: true,
            tour: {
              id: true,
              gender: true,
              name: true,
            },
            futures: {
              id: true,
              type: true,
              status: true,
              isMarketOpen: true,
            },
          },
        },
        order: {
          years: {
            year: "DESC",
          },
        },
      }),
      this.motocrossToursRepository.find({
        relations: ["years.futures"],
        where: {
          isActive: true,
          isArchived: false,
          years: {
            futures: {
              isActive: true,
              isArchived: false,
            },
          },
        },
        select: {
          id: true,
          gender: true,
          name: true,
          years: {
            id: true,
            year: true,
            tourId: true,
            tour: {
              id: true,
              gender: true,
              name: true,
            },
            futures: {
              id: true,
              type: true,
              status: true,
              isMarketOpen: true,
            },
          },
        },
        order: {
          years: {
            year: "DESC",
          },
        },
      }),

      this.f1ToursRepository.find({
        relations: ["years.futures"],
        where: {
          isActive: true,
          isArchived: false,
          years: {
            futures: {
              isActive: true,
              isArchived: false,
            },
          },
        },
        select: {
          id: true,
          gender: true,
          name: true,
          years: {
            id: true,
            year: true,
            tourId: true,
            tour: {
              id: true,
              gender: true,
              name: true,
            },
            futures: {
              id: true,
              type: true,
              status: true,
              isMarketOpen: true,
            },
          },
        },
        order: {
          years: {
            year: "DESC",
          },
        },
      }),

      this.mgToursRepository.find({
        relations: ["years.futures"],
        where: {
          isActive: true,
          isArchived: false,
          years: {
            futures: {
              isActive: true,
              isArchived: false,
            },
          },
        },
        select: {
          id: true,
          gender: true,
          name: true,
          years: {
            id: true,
            year: true,
            tourId: true,
            tour: {
              id: true,
              gender: true,
              name: true,
            },
            futures: {
              id: true,
              type: true,
              status: true,
              isMarketOpen: true,
            },
          },
        },
        order: {
          years: {
            year: "DESC",
          },
        },
      }),

      this.mxgpToursRepository.find({
        relations: ["years.futures"],
        where: {
          isActive: true,
          isArchived: false,
          years: {
            futures: {
              isActive: true,
              isArchived: false,
            },
          },
        },
        select: {
          id: true,
          gender: true,
          name: true,
          years: {
            id: true,
            year: true,
            tourId: true,
            tour: {
              id: true,
              gender: true,
              name: true,
            },
            futures: {
              id: true,
              type: true,
              status: true,
              isMarketOpen: true,
            },
          },
        },
        order: {
          years: {
            year: "DESC",
          },
        },
      }),

      this.jaToursRepository.find({
        relations: ["years.futures"],
        where: {
          isActive: true,
          isArchived: false,
          years: {
            futures: {
              isActive: true,
              isArchived: false,
            },
          },
        },
        select: {
          id: true,
          gender: true,
          name: true,
          years: {
            id: true,
            year: true,
            tourId: true,
            tour: {
              id: true,
              gender: true,
              name: true,
            },
            futures: {
              id: true,
              type: true,
              status: true,
              isMarketOpen: true,
            },
          },
        },
        order: {
          years: {
            year: "DESC",
          },
        },
      }),
    ]);

    return {
      [SportsTypes.SURFING]: wslFutures,
      [SportsTypes.SKATEBOARDING]: slsFutures,
      [SportsTypes.MASL]: maslFutures,
      [SportsTypes.RALLYCROSS]: nrxFutures,
      [SportsTypes.SUPERCROSS]: sprFutures,
      [SportsTypes.FDRIFT]: fdriftFutures,
      [SportsTypes.MOTOCROSS]: motocrossFutures,
      [SportsTypes.F1]: f1Futures,
      [SportsTypes.MotoGP]: mgFutures,
      [SportsTypes.MXGP]: mxgpFutures,
      [SportsTypes.JA]: jaFutures,
    };
  }

  async fetchSports() {
    const minYear: number = +new Date().getFullYear() - 1;

    const [
      wslEvents,
      slsEvents,
      nrxEvents,
      sprEvents,
      jaEvents,
      maslEvents,
      maslLiveEventDates,
      fdriftEvents,
      motocrossEvents,
      f1Events,
      mgEvents,
      mxgpEvents,
    ] = await Promise.all([
      this.wslToursRepository.find({
        relations: ["years.events"],
        where: {
          isActive: true,
          isArchived: false,
          years: {
            year: MoreThanOrEqual(minYear),
            events: {
              isActive: true,
              isArchived: false,
            },
          },
        },
        select: {
          id: true,
          gender: true,
          name: true,
          years: {
            id: true,
            year: true,
            tourId: true,
            tour: {
              id: true,
              gender: true,
              name: true,
            },
            event: {
              id: true,
              name: true,
              eventLocation: true,
              eventLocationGroup: true,
              eventStatus: true,
              eventNumber: true,
              startDate: true,
              endDate: true,
            },
          },
        },
        order: {
          years: {
            year: "DESC",
          },
        },
      }),
      this.slsLeaguesRepository.find({
        relations: ["years.events"],
        where: {
          isActive: true,
          isArchived: false,
          years: {
            year: MoreThanOrEqual(minYear),
            events: {
              isActive: true,
              isArchived: false,
            },
          },
        },
        select: {
          id: true,
          gender: true,
          name: true,
          years: {
            id: true,
            year: true,
            leagueId: true,
            league: {
              id: true,
              gender: true,
              name: true,
            },
            event: {
              id: true,
              name: true,
              eventLocation: true,
              eventLocationGroup: true,
              eventStatus: true,
              startDate: true,
              endDate: true,
            },
          },
        },
        order: {
          years: {
            year: "DESC",
          },
        },
      }),
      this.nrxToursRepository.find({
        relations: ["years.events"],
        where: {
          isActive: true,
          isArchived: false,
          years: {
            year: MoreThanOrEqual(minYear),
            events: {
              isActive: true,
              isArchived: false,
            },
          },
        },
        select: {
          id: true,
          gender: true,
          name: true,
          years: {
            id: true,
            year: true,
            tourId: true,
            tour: {
              id: true,
              gender: true,
              name: true,
            },
            event: {
              id: true,
              name: true,
              eventLocation: true,
              eventLocationGroup: true,
              eventStatus: true,
              eventNumber: true,
              startDate: true,
              endDate: true,
            },
          },
        },
        order: {
          years: {
            year: "DESC",
          },
        },
      }),
      this.sprToursRepository.find({
        relations: ["years.events"],
        where: {
          isActive: true,
          isArchived: false,
          years: {
            year: MoreThanOrEqual(minYear),
            events: {
              isActive: true,
              isArchived: false,
            },
          },
        },
        select: {
          id: true,
          gender: true,
          name: true,
          years: {
            id: true,
            year: true,
            tourId: true,
            tour: {
              id: true,
              gender: true,
              name: true,
            },
            event: {
              id: true,
              name: true,
              eventLocation: true,
              eventLocationGroup: true,
              eventStatus: true,
              eventNumber: true,
              startDate: true,
              endDate: true,
            },
          },
        },
        order: {
          years: {
            year: "DESC",
          },
        },
      }),
      this.jaToursRepository.find({
        relations: ["years", "years.events", "years.events.teams", "years.events.teams.team"],
        where: {
          isActive: true,
          isArchived: false,
          years: {
            year: MoreThanOrEqual(minYear),
            events: {
              isActive: true,
              isArchived: false,
            },
          },
        },
        select: {
          id: true,
          gender: true,
          name: true,
          years: {
            id: true,
            year: true,
            tourId: true,
            tour: {
              id: true,
              gender: true,
              name: true,
            },
            event: {
              id: true,
              name: true,
              eventStatus: true,
              eventNumber: true,
              startDate: true,
              endDate: true,
              teams: {
                isHomeTeam: true,
                team: {
                  name: true,
                },
              },
            },
          },
        },
        order: {
          years: {
            year: "DESC",
          },
        },
      }),
      this.maslEventsRepository
        .createQueryBuilder("events")
        .select([
          `to_char(events."startDate", 'DD_Month') as "month"`,
          `to_char(events."startDate", 'MM-DD-YYYY') as "date"`,
          'count(*) as "matches"',
          'years."year" as year',
          'leagues."name"',
        ])
        .leftJoin(MASLLeagueYears, "years", "events.leagueYearId = years.id")
        .leftJoin(MASLLeagues, "leagues", "years.leagueId = leagues.id")
        .groupBy(
          `to_char(events."startDate", 'DD_Month'), to_char(events."startDate", 'MM-DD-YYYY'), years."year", leagues."name"`,
        )
        // TODO: update me when the season changes
        .where(`years."year" >= ${2024}`)
        .andWhere(`events."startDate" <= CURRENT_DATE + INTERVAL '1 month'`)
        .getRawMany(),
      // in order to determine live events for MASL
      this.maslEventsRepository
        .createQueryBuilder("events")
        .select([`to_char(events."startDate", 'MM-DD-YYYY') as "date"`])
        .groupBy(`to_char(events."startDate", 'MM-DD-YYYY')`)
        .where(`events."eventStatus" = ${EventStatus.LIVE}`)
        .getRawMany(),
      this.fdriftToursRepository.find({
        relations: ["years.events"],
        where: {
          isActive: true,
          isArchived: false,
          years: {
            year: MoreThanOrEqual(minYear),
            events: {
              isActive: true,
              isArchived: false,
            },
          },
        },
        select: {
          id: true,
          gender: true,
          name: true,
          years: {
            id: true,
            year: true,
            tourId: true,
            tour: {
              id: true,
              gender: true,
              name: true,
            },
            event: {
              id: true,
              name: true,
              eventLocation: true,
              eventLocationGroup: true,
              eventStatus: true,
              eventNumber: true,
              startDate: true,
              endDate: true,
            },
          },
        },
        order: {
          years: {
            year: "DESC",
          },
        },
      }),
      this.motocrossToursRepository.find({
        relations: ["years.events"],
        where: {
          isActive: true,
          isArchived: false,
          years: {
            year: MoreThanOrEqual(minYear),
            events: {
              isActive: true,
              isArchived: false,
            },
          },
        },
        select: {
          id: true,
          gender: true,
          name: true,
          years: {
            id: true,
            year: true,
            tourId: true,
            tour: {
              id: true,
              gender: true,
              name: true,
            },
            event: {
              id: true,
              name: true,
              eventLocation: true,
              eventLocationGroup: true,
              eventStatus: true,
              eventNumber: true,
              startDate: true,
              endDate: true,
            },
          },
        },
        order: {
          years: {
            year: "DESC",
          },
        },
      }),
      this.f1ToursRepository.find({
        relations: ["years.events"],
        where: {
          isActive: true,
          isArchived: false,
          years: {
            year: MoreThanOrEqual(minYear),
            events: {
              isActive: true,
              isArchived: false,
            },
          },
        },
        select: {
          id: true,
          gender: true,
          name: true,
          years: {
            id: true,
            year: true,
            tourId: true,
            tour: {
              id: true,
              gender: true,
              name: true,
            },
            event: {
              id: true,
              name: true,
              eventLocation: true,
              eventLocationGroup: true,
              eventStatus: true,
              eventNumber: true,
              startDate: true,
              endDate: true,
            },
          },
        },
        order: {
          years: {
            year: "DESC",
          },
        },
      }),
      this.mgToursRepository.find({
        relations: ["years.events"],
        where: {
          isActive: true,
          isArchived: false,
          years: {
            year: MoreThanOrEqual(minYear),
            events: {
              isActive: true,
              isArchived: false,
            },
          },
        },
        select: {
          id: true,
          gender: true,
          name: true,
          years: {
            id: true,
            year: true,
            tourId: true,
            tour: {
              id: true,
              gender: true,
              name: true,
            },
            event: {
              id: true,
              name: true,
              eventLocation: true,
              eventLocationGroup: true,
              eventStatus: true,
              eventNumber: true,
              startDate: true,
              endDate: true,
            },
          },
        },
        order: {
          years: {
            year: "DESC",
          },
        },
      }),
      this.mxgpToursRepository.find({
        relations: ["years.events"],
        where: {
          isActive: true,
          isArchived: false,
          years: {
            year: MoreThanOrEqual(minYear),
            events: {
              isActive: true,
              isArchived: false,
            },
          },
        },
        select: {
          id: true,
          gender: true,
          name: true,
          years: {
            id: true,
            year: true,
            tourId: true,
            tour: {
              id: true,
              gender: true,
              name: true,
            },
            event: {
              id: true,
              name: true,
              eventLocation: true,
              eventLocationGroup: true,
              eventStatus: true,
              eventNumber: true,
              startDate: true,
              endDate: true,
            },
          },
        },
        order: {
          years: {
            year: "DESC",
          },
        },
      }),
    ]);

    const now: Date = new Date();

    return {
      [SportsTypes.SURFING]: wslEvents,
      [SportsTypes.SKATEBOARDING]: slsEvents,
      nrx: nrxEvents,
      [SportsTypes.SUPERCROSS]: sprEvents,
      [SportsTypes.FDRIFT]: fdriftEvents,
      [SportsTypes.MOTOCROSS]: motocrossEvents,
      [SportsTypes.F1]: f1Events,
      [SportsTypes.MotoGP]: mgEvents,
      [SportsTypes.MXGP]: mxgpEvents,
      ja: jaEvents,
      masl: maslEvents.map((row) => {
        const eventArr: string[] = row.month.trim().split("_");
        const eventName: string = `${eventArr[1]} ${+eventArr[0]} (${row.matches} matches)`;

        const parsedDate: Date = parse(row.date, "MM-dd-yyyy", new Date());

        const isLive = maslLiveEventDates.some((eventRow) => {
          return eventRow.date === row.date;
        });

        let eventStatus: EventStatus;

        if (isLive) eventStatus = EventStatus.LIVE;
        else {
          const isDateBefore = isBefore(parsedDate, now);
          eventStatus = isDateBefore ? EventStatus.COMPLETED : EventStatus.UPCOMING;
        }

        return {
          eventName,
          eventStatus,
          date: row.date,
          year: row.year,
          tourName: row.name,
        };
      }) as {
        eventName: string;
        eventStatus: EventStatus;
        date: string;
        year: number;
        tourName: string;
      }[],
    };
  }
}

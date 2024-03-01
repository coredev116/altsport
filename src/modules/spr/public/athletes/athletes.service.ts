import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";

// import Athletes from "../../../../entities/spr/athletes.entity";
// import Scores from "../../../../entities/spr/scores.entity";
// import RoundHeats from "../../../../entities/spr/roundHeats.entity";
// import Rounds from "../../../../entities/spr/rounds.entity";
// import Events from "../../../../entities/spr/events.entity";
// import TourYears from "../../../../entities/spr/tourYears.entity";
import AthletesStats from "../../../../entities/spr/athletesStats.entity";
import Tours from "../../../../entities/spr/tours.entity";

import { API_SORT_ORDER } from "../../../../constants/system";
import { SPRPublicStatsSortColumns } from "../../../../constants/spr";

import {
  TourIdItemDto,
  YearItemDto,
  EventLocationItemDto,
  EventNameItemDto,
  RaceCategoryItemDto,
} from "./dto";

@Injectable()
export default class AthleteService {
  constructor(
    // @InjectRepository(Scores)
    // private readonly scoresRepository: Repository<Scores>,
    // @InjectRepository(Events)
    // private readonly eventsRepository: Repository<Events>,
    @InjectRepository(AthletesStats)
    private readonly athleteStatsRepository: Repository<AthletesStats>,
    @InjectRepository(Tours)
    private readonly toursRepository: Repository<Tours>,
  ) {}

  // public async fetchAthletes(
  //   page: number = 1,
  //   tourIds?: TourIdItemDto[],
  //   eventNames?: EventNameItemDto[],
  //   years?: YearItemDto[],
  //   eventLocations?: EventLocationItemDto[],
  //   athleteQuery?: string,
  //   raceCategories?: RaceCategoryItemDto[],
  //   sortColumn?: SPRPublicStatsSortColumns,
  //   sortOrder?: API_SORT_ORDER,
  // ) {
  //   const pageSize: number = 10;
  //   const skip: number = (page - 1) * pageSize;
  //   const limit: number = pageSize;

  //   let eventIds = [];
  //   let eventFilters = false;
  //   let tourIdExists = tourIds && tourIds.length ? true : false;
  //   let eventNameExists = eventNames && eventNames.length ? true : false;
  //   let yearsExists = years && years.length ? true : false;
  //   let eventLocationsExists = eventLocations && eventLocations.length ? true : false;
  //   let raceCategoriesExists = raceCategories && raceCategories.length ? true : false;

  //   if (
  //     raceCategoriesExists ||
  //     tourIdExists ||
  //     yearsExists ||
  //     eventLocationsExists ||
  //     eventNameExists
  //   ) {
  //     eventFilters = true;
  //     const eventQuery = this.eventsRepository.createQueryBuilder("events");

  //     if (raceCategoriesExists) {
  //       eventQuery.andWhere("events.categoryName IN(:...raceCategories)", {
  //         raceCategories,
  //       });
  //     }

  //     if (eventLocationsExists) {
  //       eventQuery.andWhere("events.eventLocationGroup IN(:...eventLocations)", {
  //         eventLocations,
  //       });
  //     }

  //     if (eventNameExists) {
  //       eventQuery.andWhere("events.name IN(:...eventNames)", {
  //         eventNames,
  //       });
  //     }

  //     if (tourIdExists || yearsExists) {
  //       eventQuery.leftJoin(TourYears, "tourYears", "tourYears.id = events.tourYear");

  //       if (tourIdExists) eventQuery.andWhere("tourYears.tourId IN(:...tourIds)", { tourIds });
  //       if (yearsExists) eventQuery.andWhere("tourYears.year IN(:...years)", { years });
  //     }

  //     eventQuery.select("events.id");

  //     const result = await eventQuery.getRawMany();
  //     eventIds = result.map((e) => e.events_id);
  //   }

  //   const query = this.scoresRepository.createQueryBuilder("scores");

  //   query.leftJoin(Athletes, "athletes", "athletes.id = scores.athleteId");

  //   query.where("athletes.isActive = :isActive", { isActive: true });
  //   query.andWhere("athletes.isArchived = :isArchived", { isArchived: false });

  //   if (athleteQuery) {
  //     query.andWhere(
  //       new Brackets((qb) => {
  //         qb.where("athletes.firstName ilike :athleteQuery", { athleteQuery: `%${athleteQuery}%` })
  //           .orWhere("athletes.lastName ilike :athleteQuery", { athleteQuery: `%${athleteQuery}%` })
  //           .orWhere("athletes.nationality ilike :athleteQuery", {
  //             athleteQuery: `%${athleteQuery}%`,
  //           });

  //         const nameSplit = athleteQuery.trim().split(" ");
  //         if (nameSplit.length > 1) {
  //           const athleteFirstName = nameSplit?.[0]?.trim();
  //           const athleteLastName = nameSplit?.[nameSplit.length - 1].trim();

  //           qb.where("athletes.firstName ilike :athleteFirstName", {
  //             athleteFirstName: `%${athleteFirstName}%`,
  //           });
  //           qb.andWhere("athletes.lastName ilike :athleteLastName", {
  //             athleteLastName: `%${athleteLastName}%`,
  //           });
  //         }
  //       }),
  //     );
  //   }

  //   if (eventFilters) {
  //     if (eventIds && eventIds.length) {
  //       query.andWhere("scores.eventId IN(:...eventIds)", {
  //         eventIds,
  //       });
  //     } else {
  //       return [];
  //     }
  //   }

  //   query
  //     .select([
  //       "athletes.id",
  //       "athletes.firstName",
  //       "athletes.middleName",
  //       "athletes.lastName",
  //       "athletes.gender",
  //       "avg(scores.lapTime) as avg_lap_time",
  //     ])
  //     // event raced
  //     .addSelect((subQuery) => {
  //       subQuery
  //         .select("COUNT(DISTINCT (ers.eventId))")
  //         .from(Scores, "ers")
  //         .andWhere("ers.athleteId = athletes.id");

  //       if (eventIds.length)
  //         subQuery.andWhere("ers.eventId IN(:...eventIds)", {
  //           eventIds,
  //         });

  //       return subQuery;
  //     }, "events_raced")
  //     // event raced
  //     // event wins
  //     .addSelect((subQuery) => {
  //       subQuery
  //         .select("COUNT(DISTINCT (ews.eventId))")
  //         .from(Scores, "ews")
  //         .leftJoin(RoundHeats, "ewrh", "ewrh.id = ews.roundHeatId")
  //         .leftJoin(Rounds, "ewrb", "ewrb.id = ewrh.roundId")
  //         .andWhere("ewrb.name ilike :final_round_name", { final_round_name: `Mai%` })
  //         .andWhere("ews.athleteId = athletes.id")
  //         .andWhere("ews.heatPosition = 1");

  //       if (eventIds.length)
  //         subQuery.andWhere("ews.eventId IN(:...eventIds)", {
  //           eventIds,
  //         });

  //       return subQuery;
  //     }, "event_wins")
  //     // event wins
  //     // average event place
  //     .addSelect((subQuery) => {
  //       subQuery
  //         .select("AVG(aeps.heatPosition)")
  //         .from(Scores, "aeps")
  //         .leftJoin(RoundHeats, "aeprh", "aeprh.id = aeps.roundHeatId")
  //         .leftJoin(Rounds, "aeprb", "aeprb.id = aeprh.roundId")
  //         .andWhere("aeprb.name ilike :main_round_name", { main_round_name: `Mai%` })
  //         .andWhere("aeps.athleteId = athletes.id");

  //       if (eventIds.length)
  //         subQuery.andWhere("aeps.eventId IN(:...eventIds)", {
  //           eventIds,
  //         });

  //       return subQuery;
  //     }, "avg_event_place");
  //   // average event place
  //   // main event appearences
  //   /* .addSelect((subQuery) => {
  //       subQuery
  //         .select("COUNT(DISTINCT (meas.eventId))")
  //         .from(Scores, "meas")
  //         .leftJoin(RoundHeats, "mearh", "mearh.id = meas.roundHeatId")
  //         .leftJoin(Rounds, "mearb", "mearb.id = mearh.roundId")
  //         .andWhere("mearb.name ilike :main_event_round_name", { main_event_round_name: `Mai%` })
  //         .andWhere("meas.athleteId = athletes.id");

  //       if (eventIds.length)
  //         subQuery.andWhere("meas.eventId IN(:...eventIds)", {
  //           eventIds,
  //         });

  //       return subQuery;
  //     }, "main_event_app") */
  //   // main event appearences
  //   // prelim appearences
  //   /* .addSelect((subQuery) => {
  //       subQuery
  //         .select("COUNT(DISTINCT (meas.eventId))")
  //         .from(Scores, "meas")
  //         .leftJoin(RoundHeats, "mearh", "mearh.id = meas.roundHeatId")
  //         .leftJoin(Rounds, "mearb", "mearb.id = mearh.roundId")
  //         .andWhere("mearb.name ilike :prelim_round_name", { prelim_round_name: `Pre%` })
  //         .andWhere("meas.athleteId = athletes.id");

  //       if (eventIds.length)
  //         subQuery.andWhere("meas.eventId IN(:...eventIds)", {
  //           eventIds,
  //         });

  //       return subQuery;
  //     }, "prelim_event_app") */
  //   // prelim appearences
  //   // LCQ appearences
  //   /* .addSelect((subQuery) => {
  //       subQuery
  //         .select("COUNT(DISTINCT (lcqs.eventId))")
  //         .from(Scores, "lcqs")
  //         .leftJoin(RoundHeats, "lcqrh", "lcqrh.id = lcqs.roundHeatId")
  //         .leftJoin(Rounds, "lcqrb", "lcqrb.id = lcqrh.roundId")
  //         .andWhere("lcqrb.name ilike :lcq_round_name", { lcq_round_name: `Last%` })
  //         .andWhere("lcqs.athleteId = athletes.id");

  //       if (eventIds.length)
  //         subQuery.andWhere("lcqs.eventId IN(:...eventIds)", {
  //           eventIds,
  //         });

  //       return subQuery;
  //     }, "lcq_event_app") */
  //   // LCQ appearences
  //   // average quali place
  //   /* .addSelect((subQuery) => {
  //       subQuery
  //         .select("AVG(aqps.heatPosition)")
  //         .from(Scores, "aqps")
  //         .leftJoin(RoundHeats, "aqprh", "aqprh.id = aqps.roundHeatId")
  //         .leftJoin(Rounds, "aqpsrb", "aqpsrb.id = aqprh.roundId")
  //         .andWhere("aqpsrb.name ilike :avg_quali_round_name", {
  //           avg_quali_round_name: `Quali%`,
  //         })
  //         .andWhere("aqps.athleteId = athletes.id");

  //       if (eventIds.length)
  //         subQuery.andWhere("aqps.eventId IN(:...eventIds)", {
  //           eventIds,
  //         });

  //       return subQuery;
  //     }, "avg_quali_place") */
  //   // average quali place
  //   // average prelim place
  //   /*  .addSelect((subQuery) => {
  //       subQuery
  //         .select("AVG(apps.heatPosition)")
  //         .from(Scores, "apps")
  //         .leftJoin(RoundHeats, "apprh", "apprh.id = apps.roundHeatId")
  //         .leftJoin(Rounds, "apprb", "apprb.id = apprh.roundId")
  //         .andWhere("apprb.name ilike :avg_prelim_round_name", { avg_prelim_round_name: `Pre%` })
  //         .andWhere("apps.athleteId = athletes.id");

  //       if (eventIds.length)
  //         subQuery.andWhere("apps.eventId IN(:...eventIds)", {
  //           eventIds,
  //         });

  //       return subQuery;
  //     }, "avg_prelim_place") */
  //   // average prelim place
  //   // average LCQ place
  //   /* .addSelect((subQuery) => {
  //       subQuery
  //         .select("AVG(lcqps.heatPosition)")
  //         .from(Scores, "lcqps")
  //         .leftJoin(RoundHeats, "lcqprh", "lcqprh.id = lcqps.roundHeatId")
  //         .leftJoin(Rounds, "lcqpsrb", "lcqpsrb.id = lcqprh.roundId")
  //         .andWhere("lcqpsrb.name ilike :avg_lcq_round_name", { avg_lcq_round_name: `Last%` })
  //         .andWhere("lcqps.athleteId = athletes.id");

  //       if (eventIds.length)
  //         subQuery.andWhere("lcqps.eventId IN(:...eventIds)", {
  //           eventIds,
  //         });

  //       return subQuery;
  //     }, "avg_lcq_place"); */
  //   // average LCQ place

  //   let parsedSortColumn: string;
  //   if (sortColumn && sortOrder) {
  //     switch (sortColumn) {
  //       case SPRPublicStatsSortColumns.ATHLETE:
  //         parsedSortColumn = `"firstName"`;
  //         break;

  //       case SPRPublicStatsSortColumns.EVENTS_RACED:
  //         parsedSortColumn = "events_raced";
  //         break;

  //       case SPRPublicStatsSortColumns.WINS:
  //         parsedSortColumn = "event_wins";
  //         break;

  //       case SPRPublicStatsSortColumns.AVG_EVENT_PLACE:
  //         parsedSortColumn = "avg_event_place";
  //         break;

  //       case SPRPublicStatsSortColumns.MAIN_EVENT_APP:
  //         parsedSortColumn = "main_event_app";
  //         break;

  //       case SPRPublicStatsSortColumns.PRELIM_APP:
  //         parsedSortColumn = "prelim_event_app";
  //         break;

  //       case SPRPublicStatsSortColumns.LCQ_APP:
  //         parsedSortColumn = "lcq_event_app";
  //         break;

  //       case SPRPublicStatsSortColumns.AVG_LCQ_PLACE:
  //         parsedSortColumn = "avg_lcq_place";
  //         break;

  //       case SPRPublicStatsSortColumns.AVG_QUALI_PLACE:
  //         parsedSortColumn = "avg_quali_place";
  //         break;

  //       case SPRPublicStatsSortColumns.AVG_PRELIM_PLACE:
  //         parsedSortColumn = "avg_prelim_place";
  //         break;

  //       case SPRPublicStatsSortColumns.AVG_LAP_TIME:
  //         parsedSortColumn = "avg_lap_time";
  //         break;
  //     }
  //   }

  //   query.groupBy("athletes.id");
  //   query.orderBy(parsedSortColumn, sortOrder);
  //   query.offset(skip).limit(limit);

  //   const athleteResult = await query.getRawMany();

  //   return athleteResult;
  // }

  public async fetchAthleteStats(
    page: number = 1,
    tourIds?: TourIdItemDto[],
    eventNames?: EventNameItemDto[],
    years?: YearItemDto[],
    eventLocations?: EventLocationItemDto[],
    athleteQuery?: string,
    raceCategories?: RaceCategoryItemDto[],
    sortColumn?: SPRPublicStatsSortColumns,
    sortOrder?: API_SORT_ORDER,
  ) {
    const pageSize: number = 10;
    const skip: number = (page - 1) * pageSize;
    const limit: number = pageSize;

    let tourIdExists = tourIds && tourIds.length ? true : false;
    let eventNameExists = eventNames && eventNames.length ? true : false;
    let yearsExists = years && years.length ? true : false;
    let eventLocationsExists = eventLocations && eventLocations.length ? true : false;
    let raceCategoriesExists = raceCategories && raceCategories.length ? true : false;

    const query = this.athleteStatsRepository.createQueryBuilder();

    if (raceCategoriesExists) {
      query.andWhere(`"raceClass" IN(:...raceCategories)`, {
        raceCategories,
      });
    }

    if (eventLocationsExists) {
      query.andWhere(`"raceName" IN(:...eventLocations)`, {
        eventLocations,
      });
    }

    if (eventNameExists) {
      query.andWhere(`"raceName" IN(:...eventNames)`, {
        eventNames,
      });
    }

    if (tourIdExists || yearsExists) {
      if (tourIdExists) {
        const tours = await this.toursRepository.find({
          where: {
            id: In(tourIds),
          },
          select: {
            name: true,
          },
        });

        query.andWhere(`"raceClass" IN(:...tours)`, {
          tours: tours.map((tour) => tour.name),
        });
      }
      if (yearsExists) query.andWhere(`"raceSeason" IN(:...years)`, { years });
    }

    if (athleteQuery)
      query.andWhere("athlete ilike :athlete", {
        athlete: `%${athleteQuery}%`,
      });

    query.select([
      "athlete",
      `count(case when "placePrelim" > 0 then 1 else 0 end) as events_raced`,
      `sum(case when "eventWin" > 0 then 1 else 0 end) as "eventWins"`,
      `avg(case when "placeMain" > 0 then "placeMain" else null end) as "placeMain"`,
      `sum(case when "placeMain" > 0 then 1 else 0 end) as main_event_app`,
      `sum(case when "placePrelim" > 0 then 1 else 0 end) as prelim_event_app`,
      `sum(case when "placeLCQ" > 0 then 1 else 0 end) as lcq_event_app`,
      `avg(case when "placePrelim" > 0 then "placePrelim" else null end) as "placePrelim"`,
      `avg(case when "placeLCQ" > 0 then "placeLCQ" else null end) as "placeLCQ"`,
      `avg("bestLapTime") as "bestLapTime"`,
    ]);

    let parsedSortColumn: string;
    if (sortColumn && sortOrder) {
      switch (sortColumn) {
        case SPRPublicStatsSortColumns.ATHLETE:
          parsedSortColumn = `"athlete"`;
          break;

        case SPRPublicStatsSortColumns.EVENTS_RACED:
          parsedSortColumn = "events_raced";
          break;

        case SPRPublicStatsSortColumns.WINS:
          parsedSortColumn = ` "eventWins"`;
          break;

        case SPRPublicStatsSortColumns.AVG_EVENT_PLACE:
          parsedSortColumn = `"placeMain"`;
          break;

        case SPRPublicStatsSortColumns.MAIN_EVENT_APP:
          parsedSortColumn = `"main_event_app"`;
          break;

        case SPRPublicStatsSortColumns.PRELIM_APP:
          parsedSortColumn = "prelim_event_app";
          break;

        case SPRPublicStatsSortColumns.LCQ_APP:
          parsedSortColumn = "lcq_event_app";
          break;

        case SPRPublicStatsSortColumns.AVG_LCQ_PLACE:
          parsedSortColumn = `"placeLCQ"`;
          break;

        case SPRPublicStatsSortColumns.AVG_QUALI_PLACE:
          parsedSortColumn = `"placeHeats"`;
          break;

        case SPRPublicStatsSortColumns.AVG_PRELIM_PLACE:
          parsedSortColumn = `"placePrelim"`;
          break;

        case SPRPublicStatsSortColumns.AVG_BEST_LAP_TIME:
          parsedSortColumn = `"bestLapTime"`;
          break;
      }
    }

    query.groupBy("athlete");
    query.orderBy(parsedSortColumn, sortOrder);
    query.offset(skip).limit(limit);

    const athleteResult = await query.getRawMany();
    return athleteResult;
  }
}

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";

import AthletesStats from "../../../../entities/motocrs/athletesStats.entity";
import Tours from "../../../../entities/motocrs/tours.entity";

import { API_SORT_ORDER } from "../../../../constants/system";
import { MOTOCRSPublicStatsSortColumns } from "../../../../constants/motocrs";

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
    @InjectRepository(AthletesStats)
    private readonly athleteStatsRepository: Repository<AthletesStats>,
    @InjectRepository(Tours)
    private readonly toursRepository: Repository<Tours>,
  ) {}

  public async fetchAthleteStats(
    page: number = 1,
    tourIds?: TourIdItemDto[],
    eventNames?: EventNameItemDto[],
    years?: YearItemDto[],
    eventLocations?: EventLocationItemDto[],
    athleteQuery?: string,
    raceCategories?: RaceCategoryItemDto[],
    sortColumn?: MOTOCRSPublicStatsSortColumns,
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
      `athlete`,
      `MAX("eventsRaced") as events_raced`,
      `sum(case when "eventWins" > 0 then 1 else 0 end) as event_wins`,
      `MAX("avgEventPlace") as avg_event_place`,
      `MAX("avgLapTime") as avg_lap_time`,
      `avg("avgBestLapTime") as avg_best_lap_time`,
      `MAX("avgQualifyingPlace") as avg_qualifying_place`,
      `MAX("mainEventApp") as main_event_app`,
      `MAX("prelimApp") as prelim_event_app`,
      `avg(case when "avgPrelimPlace" > 0 then "avgPrelimPlace" else null end) as avg_prelim_place`,
      `MAX("lcqApp") as lcq_event_app`,
      `avg(case when "avgLcqPlace" > 0 then "avgLcqPlace" else null end) as avg_lcq_place`,
    ]);

    let parsedSortColumn: string;
    if (sortColumn && sortOrder) {
      switch (sortColumn) {
        case MOTOCRSPublicStatsSortColumns.ATHLETE:
          parsedSortColumn = `"athlete"`;
          break;

        case MOTOCRSPublicStatsSortColumns.EVENTS_RACED:
          parsedSortColumn = "events_raced";
          break;

        case MOTOCRSPublicStatsSortColumns.WINS:
          parsedSortColumn = ` "event_wins"`;
          break;

        case MOTOCRSPublicStatsSortColumns.AVG_EVENT_PLACE:
          parsedSortColumn = `"avg_event_place"`;
          break;

        case MOTOCRSPublicStatsSortColumns.AVG_LAP_TIME:
          parsedSortColumn = `"avg_lap_time"`;
          break;

        case MOTOCRSPublicStatsSortColumns.AVG_BEST_LAP_TIME:
          parsedSortColumn = `"avg_best_lap_time"`;
          break;

        case MOTOCRSPublicStatsSortColumns.AVG_QUALI_PLACE:
          parsedSortColumn = `"avg_qualifying_place"`;
          break;

        case MOTOCRSPublicStatsSortColumns.MAIN_EVENT_APP:
          parsedSortColumn = `"main_event_app"`;
          break;

        case MOTOCRSPublicStatsSortColumns.PRELIM_APP:
          parsedSortColumn = "prelim_event_app";
          break;

        case MOTOCRSPublicStatsSortColumns.LCQ_APP:
          parsedSortColumn = "lcq_event_app";
          break;

        case MOTOCRSPublicStatsSortColumns.AVG_LCQ_PLACE:
          parsedSortColumn = `"avg_lcq_place"`;
          break;

        case MOTOCRSPublicStatsSortColumns.AVG_PRELIM_PLACE:
          parsedSortColumn = `"avg_prelim_place"`;
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

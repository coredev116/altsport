import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Brackets } from "typeorm";

import Athletes from "../../../../entities/wsl/athletes.entity";
import Scores from "../../../../entities/wsl/scores.entity";
import Events from "../../../../entities/wsl/events.entity";
import TourYears from "../../../../entities/wsl/tourYears.entity";

import { TourIdItemDto, YearItemDto, EventLocationItemDto, EventNameItemDto } from "./dto";

import { API_SORT_ORDER } from "../../../../constants/system";
import { WSLPublicStatsSortColumns } from "../../../../constants/wsl";

@Injectable()
export default class AthleteService {
  constructor(
    @InjectRepository(Scores)
    private readonly scoresRepository: Repository<Scores>,
    @InjectRepository(Events)
    private readonly eventsRepository: Repository<Events>,
  ) {}

  public async fetchAthletes(
    page: number = 1,
    tourIds?: TourIdItemDto[],
    eventNames?: EventNameItemDto[],
    years?: YearItemDto[],
    eventLocations?: EventLocationItemDto[],
    athleteQuery?: string,
    sortColumn?: WSLPublicStatsSortColumns,
    sortOrder?: API_SORT_ORDER,
  ) {
    const pageSize: number = 10;
    const skip: number = (page - 1) * pageSize;
    const limit: number = pageSize;

    let eventIds = [];
    let eventFilters = false;
    if (
      (tourIds && tourIds.length) ||
      (years && years.length) ||
      (eventLocations && eventLocations.length) ||
      (eventNames && eventNames.length)
    ) {
      eventFilters = true;
      const eventQuery = this.eventsRepository.createQueryBuilder("events");

      if (eventLocations && eventLocations.length) {
        eventQuery.andWhere("events.eventLocationGroup IN(:...eventLocations)", {
          eventLocations,
        });
      }

      if (eventNames && eventNames.length) {
        eventQuery.andWhere("events.name IN(:...eventNames)", {
          eventNames,
        });
      }

      if ((tourIds && tourIds.length) || (years && years.length)) {
        eventQuery.leftJoin(TourYears, "tourYears", "tourYears.id = events.tourYear");

        if (tourIds && tourIds.length)
          eventQuery.andWhere("tourYears.tourId IN(:...tourIds)", { tourIds });
        if (years && years.length) eventQuery.andWhere("tourYears.year IN(:...years)", { years });
      }

      eventQuery.select("events.id");

      const result = await eventQuery.getRawMany();
      eventIds = result.map((e) => e.events_id);
    }

    const query = this.scoresRepository.createQueryBuilder("scores");

    query.leftJoin(Athletes, "athletes", "athletes.id = scores.athleteId");

    query.where("athletes.isActive = :isActive", { isActive: true });
    query.andWhere("athletes.isArchived = :isArchived", { isArchived: false });

    if (athleteQuery) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where("athletes.firstName ilike :athleteQuery", { athleteQuery: `%${athleteQuery}%` })
            .orWhere("athletes.lastName ilike :athleteQuery", { athleteQuery: `%${athleteQuery}%` })
            .orWhere("athletes.nationality ilike :athleteQuery", {
              athleteQuery: `%${athleteQuery}%`,
            });

          const nameSplit = athleteQuery.trim().split(" ");
          if (nameSplit.length > 1) {
            const athleteFirstName = nameSplit?.[0]?.trim();
            const athleteLastName = nameSplit?.[nameSplit.length - 1].trim();

            qb.where("athletes.firstName ilike :athleteFirstName", {
              athleteFirstName: `%${athleteFirstName}%`,
            });
            qb.andWhere("athletes.lastName ilike :athleteLastName", {
              athleteLastName: `%${athleteLastName}%`,
            });
          }
        }),
      );
    }

    if (eventFilters) {
      if (eventIds && eventIds.length) {
        query.andWhere("scores.eventId IN(:...eventIds)", {
          eventIds,
        });
      } else {
        return [];
      }
    }

    query.select([
      "athletes.id",
      "athletes.firstName",
      "athletes.middleName",
      "athletes.lastName",
      // "athletes.nationality",
      // "athletes.stance",
      "athletes.gender",
      // "athletes.dob",
      // "athletes.isActive",
      // "athletes.isArchived",
      "avg(scores.heatScore) as avg_heat_score",
      "count(scores.id) as heats_surfed",
      "count(CASE WHEN scores.heatPosition = 1 THEN 1 END) as heats_won",
      "CASE WHEN count(scores.id) != 0 THEN count(CASE WHEN scores.heatPosition = 1 THEN 1 END)*100/count(scores.id) END as heat_win_percentage",
      "max(scores.heatScore) as max_heat_score",
      "min(scores.heatScore) as min_heat_score",
    ]);

    if (sortColumn && sortOrder) {
      switch (sortColumn) {
        case WSLPublicStatsSortColumns.ATHLETE:
          query.orderBy(`"firstName"`, sortOrder);
          break;

        case WSLPublicStatsSortColumns.HEAT_SCORE:
          query.orderBy("avg_heat_score", sortOrder);
          break;

        case WSLPublicStatsSortColumns.HEATS_SURFED:
          query.orderBy("heats_surfed", sortOrder);
          break;

        case WSLPublicStatsSortColumns.HEATS_WON:
          query.orderBy("heats_won", sortOrder);
          break;

        case WSLPublicStatsSortColumns.HEAT_WIN_PERCENTAGE:
          query.orderBy("heat_win_percentage", sortOrder);
          break;

        case WSLPublicStatsSortColumns.MAX_HEAT_SCORE:
          query.orderBy("max_heat_score", sortOrder);
          break;

        case WSLPublicStatsSortColumns.MIN_HEAT_SCORE:
          query.orderBy("min_heat_score", sortOrder);
          break;
      }
    }

    query.groupBy("athletes.id");
    query.limit(limit).offset(skip);

    return query.getRawMany();
  }
}

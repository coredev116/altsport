import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Brackets } from "typeorm";

import Athletes from "../../../../entities/nrx/athletes.entity";
import Scores from "../../../../entities/nrx/scores.entity";
import RoundHeats from "../../../../entities/nrx/roundHeats.entity";
import Rounds from "../../../../entities/nrx/rounds.entity";
import Events from "../../../../entities/nrx/events.entity";
import TourYears from "../../../../entities/nrx/tourYears.entity";

import { TourIdItemDto, YearItemDto, EventLocationItemDto, EventNameItemDto } from "./dto";

import { API_SORT_ORDER } from "../../../../constants/system";
import { NRXPublicStatsSortColumns } from "../../../../constants/nrx";

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
    sortColumn?: NRXPublicStatsSortColumns,
    sortOrder?: API_SORT_ORDER,
  ) {
    const pageSize: number = 10;
    const skip: number = (page - 1) * pageSize;
    const limit: number = pageSize;

    let eventIds = [];
    let eventFilters = false;
    let tourIdExists = tourIds && tourIds.length ? true : false;
    let eventNameExists = eventNames && eventNames.length ? true : false;
    let yearsExists = years && years.length ? true : false;
    let eventLocationsExists = eventLocations && eventLocations.length ? true : false;

    if (tourIdExists || yearsExists || eventLocationsExists || eventNameExists) {
      eventFilters = true;
      const eventQuery = this.eventsRepository.createQueryBuilder("events");

      if (eventLocationsExists) {
        eventQuery.andWhere("events.eventLocationGroup IN(:...eventLocations)", {
          eventLocations,
        });
      }

      if (eventNameExists) {
        eventQuery.andWhere("events.name IN(:...eventNames)", {
          eventNames,
        });
      }

      if (tourIdExists || yearsExists) {
        eventQuery.leftJoin(TourYears, "tourYears", "tourYears.id = events.tourYear");

        if (tourIdExists) eventQuery.andWhere("tourYears.tourId IN(:...tourIds)", { tourIds });
        if (yearsExists) eventQuery.andWhere("tourYears.year IN(:...years)", { years });
      }

      eventQuery.select("events.id");

      const result = await eventQuery.getRawMany();
      eventIds = result.map((e) => e.events_id);
    }

    const query = this.scoresRepository.createQueryBuilder("scores");

    query
      .leftJoin(Athletes, "athletes", "athletes.id = scores.athleteId")
      .leftJoin(Events, "events", "scores.eventId = events.id");

    query
      .where("events.categoryName = 'GROUP E'")
      .andWhere("athletes.isActive = :isActive", { isActive: true })
      .andWhere("athletes.isArchived = :isArchived", { isArchived: false });

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

    query
      .select([
        "athletes.id as id",
        "athletes.firstName as first_name",
        "athletes.middleName as middle_name",
        "athletes.lastName as last_name",
        // "athletes.nationality as nationality",
        // "athletes.stance as stance",
        "athletes.gender as gender",
        // "athletes.dob as dob",
        // "athletes.isActive as is_active",
        // "athletes.isArchived",
        "avg(scores.lapTime) as avg_lap_time",
        "avg(CASE WHEN scores.isJoker = true THEN scores.lapTime END) as avg_joker_lap_time",
        "avg(CASE WHEN scores.isJoker = false THEN scores.lapTime END) as avg_non_joker_lap_time",
      ])
      // battle
      .addSelect((subQuery) => {
        subQuery
          .select("COUNT(DISTINCT (tbrh.id))")
          .from(Scores, "tbs")
          .leftJoin(RoundHeats, "tbrh", "tbrh.id = tbs.roundHeatId")
          .leftJoin(Rounds, "tbrb", "tbrb.id = tbrh.roundId")
          .andWhere("tbrb.name ilike :total_battle_round_name", {
            total_battle_round_name: `Battle%`,
          })
          .andWhere("tbs.athleteId = athletes.id");

        if (eventIds.length)
          subQuery.andWhere("tbs.eventId IN(:...eventIds)", {
            eventIds,
          });

        return subQuery;
      }, "total_battle_race")
      .addSelect((subQuery) => {
        subQuery
          .select("COUNT(DISTINCT (wbrh.id))")
          .from(Scores, "wbs")
          .leftJoin(RoundHeats, "wbrh", "wbrh.id = wbs.roundHeatId")
          .leftJoin(Rounds, "wbrb", "wbrb.id = wbrh.roundId")
          .andWhere("wbrb.name ilike :win_battle_round_name", { win_battle_round_name: `Battle%` })
          .andWhere("wbs.athleteId = athletes.id")
          .andWhere("wbs.heatPosition = 1");

        if (eventIds.length)
          subQuery.andWhere("wbs.eventId IN(:...eventIds)", {
            eventIds,
          });

        return subQuery;
      }, "wins_battle_race")
      // battle
      // heat
      .addSelect((subQuery) => {
        subQuery
          .select("COUNT(DISTINCT (ths.roundHeatId))")
          .from(Scores, "ths")
          .leftJoin(RoundHeats, "thrh", "thrh.id = ths.roundHeatId")
          .leftJoin(Rounds, "thrd", "thrd.id = thrh.roundId")
          .andWhere("thrd.name ilike :total_heat_round_name", { total_heat_round_name: `Heat%` })
          .andWhere("ths.athleteId = athletes.id");

        if (eventIds.length)
          subQuery.andWhere("ths.eventId IN(:...eventIds)", {
            eventIds,
          });

        return subQuery;
      }, "total_heat_races")
      .addSelect((subQuery) => {
        subQuery
          .select("COUNT(DISTINCT (whs.roundHeatId))")
          .from(Scores, "whs")
          .leftJoin(RoundHeats, "whrh", "whrh.id = whs.roundHeatId")
          .leftJoin(Rounds, "whrd", "whrd.id = whrh.roundId")
          .andWhere("whrd.name ilike :win_heat_round_name", { win_heat_round_name: `Heat%` })
          .andWhere("whs.athleteId = athletes.id")
          .andWhere("whs.heatPosition = 1");

        if (eventIds.length)
          subQuery.andWhere("whs.eventId IN(:...eventIds)", {
            eventIds,
          });

        return subQuery;
      }, "win_heat_races")
      // heat
      // final
      .addSelect((subQuery) => {
        subQuery
          .select("COUNT(DISTINCT (tfs.roundHeatId))")
          .from(Scores, "tfs")
          .leftJoin(RoundHeats, "tfrh", "tfrh.id = tfs.roundHeatId")
          .leftJoin(Rounds, "tfrf", "tfrf.id = tfrh.roundId")
          .andWhere("tfrf.name = :total_final_round_name", { total_final_round_name: "Final" })
          .andWhere("tfs.athleteId = athletes.id");

        if (eventIds.length)
          subQuery.andWhere("tfs.eventId IN(:...eventIds)", {
            eventIds,
          });

        return subQuery;
      }, "total_final_races")
      .addSelect((subQuery) => {
        subQuery
          .select("COUNT(DISTINCT (wfs.roundHeatId))")
          .from(Scores, "wfs")
          .leftJoin(RoundHeats, "wfrh", "wfrh.id = wfs.roundHeatId")
          .leftJoin(Rounds, "wfrf", "wfrf.id = wfrh.roundId")
          .andWhere("wfrf.name = :win_final_round_name", { win_final_round_name: "Final" })
          .andWhere("wfs.athleteId = athletes.id")
          .andWhere("wfs.heatPosition = 1");

        if (eventIds.length)
          subQuery.andWhere("wfs.eventId IN(:...eventIds)", {
            eventIds,
          });

        return subQuery;
      }, "win_final_races");
    // final
    // .addSelect((subQuery) => {
    //   subQuery
    //     .select("COUNT(DISTINCT (innerBattlescoresTotal.roundHeatId))")
    //     .from(Scores, "innerBattlescoresTotal")
    //     .where("innerBattlescoresTotal.athleteId = athletes.id");

    //   if (eventIds.length)
    //     subQuery.andWhere("innerBattlescoresTotal.eventId IN(:...eventIds)", {
    //       eventIds,
    //     });

    //   return subQuery;
    // }, "total_races");

    query.groupBy("athletes.id");

    let parsedSortColumn: string;
    if (sortColumn && sortOrder) {
      switch (sortColumn) {
        case NRXPublicStatsSortColumns.ATHLETE:
          parsedSortColumn = `derived."first_name"`;
          break;

        case NRXPublicStatsSortColumns.AVG_LAP_TIME:
          parsedSortColumn = `derived."avg_lap_time"`;
          break;

        case NRXPublicStatsSortColumns.AVG_JOKER_LAP_TIME:
          parsedSortColumn = `derived."avg_joker_lap_time"`;
          break;

        case NRXPublicStatsSortColumns.AVG_NON_JOKER_LAP_TIME:
          parsedSortColumn = `derived."avg_non_joker_lap_time"`;
          break;

        case NRXPublicStatsSortColumns.BATTLE_RACES:
          parsedSortColumn = `derived."wins_battle_race"`;
          break;

        case NRXPublicStatsSortColumns.BATTLE_RACES_PERCENT:
          parsedSortColumn = "battle_percent";
          break;

        case NRXPublicStatsSortColumns.HEAT_RACES:
          parsedSortColumn = `derived."win_heat_races"`;
          break;

        case NRXPublicStatsSortColumns.HEAT_RACES_PERCENT:
          parsedSortColumn = "heat_percent";
          break;

        case NRXPublicStatsSortColumns.FINAL_RACES:
          parsedSortColumn = `derived."total_final_races"`;
          break;

        case NRXPublicStatsSortColumns.FINAL_RACES_PERCENT:
          parsedSortColumn = "final_percent";
          break;
      }
    }

    const outerQuery = `
    select
      derived."id",
      derived."first_name",
      derived."middle_name",
      derived."last_name",
      derived."gender",
      derived."avg_lap_time",
      derived."avg_joker_lap_time",
      derived."avg_non_joker_lap_time",

      derived."total_battle_race",
      derived."wins_battle_race",
      case
        when wins_battle_race > 0
        and total_battle_race > 0 then cast(wins_battle_race as decimal)/ cast(total_battle_race as decimal)
        else 0
      end as battle_percent,

      derived."total_heat_races",
      derived."win_heat_races",
      case
        when win_heat_races > 0
        and total_heat_races > 0 then cast(win_heat_races as decimal)/ cast(total_heat_races as decimal)
        else 0
      end as heat_percent,

      derived."total_final_races",
      derived."win_final_races",
      case
        when win_final_races > 0
        and total_final_races > 0 then cast(win_final_races as decimal)/ cast(total_final_races as decimal)
        else 0
      end as final_percent
    from
      (
        ${query.getSql()}
      ) as derived ORDER BY ${parsedSortColumn} ${sortOrder} OFFSET ${skip} LIMIT ${limit}
    `;

    const queryParameters: any[] = eventIds.length
      ? [
          `Battle%`,
          ...eventIds,
          `Battle%`,
          ...eventIds,
          `Heat%`,
          ...eventIds,
          `Heat%`,
          ...eventIds,
          `Final`,
          ...eventIds,
          `Final`,
          ...eventIds,
          true,
          false,
          ...eventIds,
        ]
      : [`Battle%`, `Battle%`, `Heat%`, `Heat%`, `Final`, `Final`, true, false];

    const result = await this.scoresRepository.manager.query(outerQuery, queryParameters);

    return result;
  }
}

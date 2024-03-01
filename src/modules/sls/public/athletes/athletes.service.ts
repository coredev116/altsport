import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Brackets } from "typeorm";

import Athletes from "../../../../entities/sls/athletes.entity";
import Scores from "../../../../entities/sls/scores.entity";
import Events from "../../../../entities/sls/events.entity";
import LeagueYears from "../../../../entities/sls/leagueYears.entity";

import { LeagueIdItemDto, YearItemDto, EventLocationItemDto, EventNameItemDto } from "./dto";

import { API_SORT_ORDER } from "../../../../constants/system";
import { SLSPublicStatsSortColumns } from "../../../../constants/sls";

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
    leagueIds?: LeagueIdItemDto[],
    eventNames?: EventNameItemDto[],
    years?: YearItemDto[],
    eventLocations?: EventLocationItemDto[],
    athleteQuery?: string,
    sortColumn?: SLSPublicStatsSortColumns,
    sortOrder?: API_SORT_ORDER,
  ) {
    const pageSize: number = 10;
    const skip: number = (page - 1) * pageSize;
    const limit: number = pageSize;

    let eventIds = [];
    let eventFilters = false;
    let leagueIdExists = leagueIds && leagueIds.length ? true : false;
    let eventNameExists = eventNames && eventNames.length ? true : false;
    let yearsExists = years && years.length ? true : false;
    let eventLocationsExists = eventLocations && eventLocations.length ? true : false;

    if (leagueIdExists || yearsExists || eventLocationsExists || eventNameExists) {
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

      if (leagueIdExists || yearsExists) {
        eventQuery.leftJoin(LeagueYears, "leagueYears", "leagueYears.id = events.leagueYearId");

        if (leagueIdExists)
          eventQuery.andWhere("leagueYears.leagueId IN(:...leagueIds)", { leagueIds });
        if (yearsExists) eventQuery.andWhere("leagueYears.year IN(:...years)", { years });
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
      "avg(scores.roundScore) as avg_round_score",
      '(avg(scores.lineScore1)+avg(scores.lineScore2))/2 as "avg_run_score"',
      "max(scores.roundScore) as max_round_score",
      "min(scores.roundScore) as min_round_score",
      'coalesce((avg(scores.trick1Score) + avg(scores.trick2Score) + avg(scores.trick3Score) + avg(scores.trick4Score) + avg(scores.trick5Score) + avg(scores.trick6Score))/6, 0) as "avg_trick_score"',

      `
      COUNT("trick1Score") filter (
        where
          "trick1Score" > 0) + COUNT("trick2Score") filter (
        where
          "trick2Score" > 0) + COUNT("trick3Score") filter (
        where
          "trick3Score" > 0) + COUNT("trick4Score") filter (
        where
          "trick4Score" > 0) + COUNT("trick5Score") filter (
        where
          "trick5Score" > 0) + COUNT("trick6Score") filter (
        where
          "trick6Score" > 0) as completed
      `,
      'COUNT("trick1Score") + COUNT("trick2Score") + COUNT("trick3Score") + COUNT("trick4Score")+ COUNT("trick5Score") + COUNT("trick6Score") as total_tricks',

      "count(scores.trick1Score) as count_trick1_score",
      "count(scores.trick2Score) as count_trick2_score",
      "count(scores.trick3Score) as count_trick3_score",
      "count(scores.trick4Score) as count_trick4_score",
      "count(scores.trick5Score) as count_trick5_score",
      "count(scores.trick6Score) as count_trick6_score",

      "count(CASE WHEN scores.trick1Score > 0 THEN 1 END) as count_trick1_score_completed",
      "count(CASE WHEN scores.trick2Score > 0 THEN 1 END) as count_trick2_score_completed",
      "count(CASE WHEN scores.trick3Score > 0 THEN 1 END) as count_trick3_score_completed",
      "count(CASE WHEN scores.trick4Score > 0 THEN 1 END) as count_trick4_score_completed",
      "count(CASE WHEN scores.trick5Score > 0 THEN 1 END) as count_trick5_score_completed",
      "count(CASE WHEN scores.trick6Score > 0 THEN 1 END) as count_trick6_score_completed",
    ]);

    query.groupBy("athletes.id");

    let parsedSortColumn: string;
    if (sortColumn && sortOrder) {
      switch (sortColumn) {
        case SLSPublicStatsSortColumns.ATHLETE:
          parsedSortColumn = `derived."athletes_firstName"`;
          break;

        case SLSPublicStatsSortColumns.ROUND_SCORE:
          parsedSortColumn = `derived."avg_round_score"`;
          break;

        case SLSPublicStatsSortColumns.RUN_SCORE:
          parsedSortColumn = `derived."avg_run_score"`;
          break;

        case SLSPublicStatsSortColumns.TRICK_SCORE:
          parsedSortColumn = `derived."avg_trick_score"`;
          break;

        case SLSPublicStatsSortColumns.COMPLETION_PERCENT:
          parsedSortColumn = "percent";
          break;

        case SLSPublicStatsSortColumns.MAX_ROUND_SCORE:
          parsedSortColumn = `derived."max_round_score"`;
          break;

        case SLSPublicStatsSortColumns.MIN_ROUND_SCORE:
          parsedSortColumn = `derived."min_round_score"`;
          break;
      }
    }

    const outerQuery = `
    select
      derived."athletes_id",
      derived."athletes_firstName",
      derived."athletes_middleName",
      derived."athletes_lastName",
      derived."athletes_gender",
      derived."avg_round_score",
      derived."avg_run_score",
      derived."max_round_score",
      derived."min_round_score",
      derived."avg_trick_score",
      completed,
      case
        when completed > 0
        and total_tricks >0 then cast(completed as decimal)/ cast(total_tricks as decimal)
        else 0
      end as percent
    from
      (
        ${query.getSql()}
      ) as derived ORDER BY ${parsedSortColumn} ${sortOrder} OFFSET ${skip} LIMIT ${limit}
    `;

    const queryParams: any[] = eventIds.length ? [true, false, ...eventIds] : [true, false];

    const result = await this.scoresRepository.manager.query(outerQuery, queryParams);

    return result;
  }
}

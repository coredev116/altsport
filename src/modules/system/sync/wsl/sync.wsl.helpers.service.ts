/* eslint-disable no-console */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import Events from "../../../../entities/wsl/events.entity";
import Tours from "../../../../entities/wsl/tours.entity";
import TourYears from "../../../../entities/wsl/tourYears.entity";
import Scores from "../../../../entities/wsl/scores.entity";
import Weights from "../../../../entities/wsl/simulationWeights.entity";

import { EventStatus, Gender, SimulationWeightTypes } from "../../../../constants/system";

@Injectable()
export default class WSLHelpersService {
  private mensHeatAverage: number = 0;
  private womenHeatAverage: number = 0;

  constructor(
    @InjectRepository(Events) private readonly eventsRepository: Repository<Events>,
    @InjectRepository(Scores) private readonly scoresRepository: Repository<Scores>,
  ) {}

  public fetchAthleteProjection = async (
    athleteId: string,
    gender: string,
    weights: Partial<Weights>[],
  ): Promise<number> => {
    // set the heat averages for the projection calculations
    if (!this.mensHeatAverage && gender === Gender.MALE)
      this.mensHeatAverage = await this.fetchHeatStandardDeviation(Gender.MALE);
    if (!this.womenHeatAverage && gender === Gender.FEMALE)
      this.womenHeatAverage = await this.fetchHeatStandardDeviation(Gender.FEMALE);

    const average: number = gender === Gender.MALE ? this.mensHeatAverage : this.womenHeatAverage;

    const promises = weights.map(async (weightRow) => {
      switch (weightRow.type) {
        case SimulationWeightTypes.YEAR: {
          return this.fetchAthleteHeatDiff(athleteId, null, weightRow.year).then(
            (heatDiff: number) => (weightRow.weight / 100) * heatDiff,
          );
        }

        case SimulationWeightTypes.LOCATION: {
          return this.fetchAthleteHeatDiff(athleteId, weightRow.location).then(
            (heatDiff: number) => (weightRow.weight / 100) * heatDiff,
          );
        }

        default:
          break;
      }
    });

    const result = await Promise.all(promises);

    const sum: number = result.reduce((total, val) => total + val, 0);
    return +Number(sum).toFixed(4) + average;
  };

  public async fetchHeatStandardDeviation(gender: Gender): Promise<number> {
    try {
      const avgResult = await this.eventsRepository
        .createQueryBuilder("events")
        .select([`avg(s."heatScore") as heat_avg`])
        .leftJoin(TourYears, "ty", `events."tourYearId" = ty.id`)
        .leftJoin(Tours, "t", `ty."tourId" = t.id`)
        .leftJoin(Scores, "s", `events.id = s."eventId"`)
        .andWhere(`t.gender = '${gender}'`)
        .getRawOne();

      const val: number = avgResult?.heat_avg || 0;
      return val ? +Number(val).toFixed(4) : 0;
    } catch (error) {
      throw error;
    }
  }

  private async fetchAthleteHeatDiff(
    athleteId: string,
    eventLocationGroup?: string,
    year?: number,
  ): Promise<number> {
    try {
      const query = this.scoresRepository
        .createQueryBuilder("scores")
        .select([`scores."heatScore" as heat_score`])
        .addSelect((subQuery) => {
          subQuery
            .select(`AVG(s."heatScore")`)
            .from(Scores, "s")
            .andWhere("s.roundHeatId = scores.roundHeatId");
          return subQuery;
        }, "avg_heat_score")
        .where(`scores.athleteId = '${athleteId}'`);

      if (eventLocationGroup || year) {
        query.leftJoin(Events, "e", "scores.eventId = e.id");
        if (eventLocationGroup) query.andWhere(`e.eventLocationGroup = '${eventLocationGroup}'`);
        if (year)
          query.leftJoin(TourYears, "ty", "e.tourYearId = ty.id").andWhere(`ty.year = ${year}`);

        query.andWhere(`e.eventStatus = ${EventStatus.COMPLETED}`);
      }

      const outerQuery = `
      SELECT
        avg(derived.heat_score - avg_heat_score) as heat_diff
      FROM
      (
        ${query.getSql()}
      ) as derived
      `;

      const result = await this.scoresRepository.manager.query(outerQuery);
      const row: number = result?.[0]?.heat_diff || 0;

      return row ? +Number(row).toFixed(4) : 0;
    } catch (error) {
      throw error;
    }
  }
}

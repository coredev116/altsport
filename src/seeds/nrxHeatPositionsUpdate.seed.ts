import { Knex } from "knex";
import groupBy from "lodash.groupby";
import orderBy from "lodash.orderby";
import config from "./config";
import * as systemConstants from "../constants/system";

// the seed is to find all heat positions that are null and then update them

const LIMIT = 25;

const updateScoresByRoundHeats = async (knex: Knex, trx: Knex.Transaction, offset: number) => {
  const roundHeats = await knex("roundHeats")
    .transacting(trx)
    .withSchema(systemConstants.SportsDbSchema.NRX)
    .select(["id"])
    .limit(LIMIT)
    .offset(offset);
  if (!roundHeats || !roundHeats.length) return false;

  await Promise.all(
    roundHeats.map(async (roundHeat) => {
      const scores = await knex("scores")
        .transacting(trx)
        .withSchema(systemConstants.SportsDbSchema.NRX)
        .where("roundHeatId", roundHeat.id)
        .select(["id", "roundHeatId", "athleteId", "lapTime", "lapNumber"])
        .whereNotNull("lapTime")
        .whereNull("heatPosition");

      if (!scores.length) return false;

      const scoresWithAthleteGroup = groupBy(scores, "athleteId");

      let result = [];

      Object.keys(scoresWithAthleteGroup).map((athleteId) => {
        let totalLapTime = 0;
        scoresWithAthleteGroup[athleteId].map((score) => {
          totalLapTime = totalLapTime + Number(score.lapTime);
        });

        result.push({ athleteId, totalLapTime });
      });

      result = orderBy(result, ["totalLapTime"], "asc");

      let count = 1;
      result.forEach((score) => {
        score.heatPosition = count;
        count++;
      });

      await Promise.all(
        result.map((row) =>
          knex("scores")
            .transacting(trx)
            .withSchema(systemConstants.SportsDbSchema.NRX)
            .where("athleteId", row.athleteId)
            .andWhere("roundHeatId", roundHeat.id)
            .update({
              heatPosition: row.heatPosition,
            }),
        ),
      );
    }),
  );

  return true;
};

export async function seed(knex: Knex) {
  await knex.transaction(async (trx) => {
    try {
      if (config.isLocal || config.isRelease || config.isStaging || config.isDevelop) return true;

      const roundHeatsCount = await knex("roundHeats")
        .transacting(trx)
        .withSchema(systemConstants.SportsDbSchema.NRX)
        .count("id")
        .first();

      // eslint-disable-next-line no-console
      console.log("+++++NRX Round Heat Counts", roundHeatsCount.count);

      let offset = 0;
      let roundHeatsExists = true;
      while (roundHeatsExists) {
        const result = await updateScoresByRoundHeats(knex, trx, offset);
        if (!result) roundHeatsExists = false;
        offset = offset + LIMIT;
      }
      await trx.commit();

      return true;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      await trx.rollback();
      throw error;
    }
  });
}

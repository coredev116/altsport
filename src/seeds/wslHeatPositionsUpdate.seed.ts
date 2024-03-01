import { Knex } from "knex";

import config from "./config";
import * as systemConstants from "../constants/system";

// the seed is to find all heat positions that are null and then update them

const updateScoresByRoundHeats = async (knex: Knex, trx: Knex.Transaction, offset: number) => {
  const roundHeats = await knex("roundHeats")
    .transacting(trx)
    .withSchema(systemConstants.SportsDbSchema.WSL)
    .select(["id"])
    .limit(10)
    .offset(offset);

  if (!roundHeats || !roundHeats.length) return false;

  await Promise.all(
    roundHeats.map(async (roundHeat) => {
      const scores = await knex("scores")
        .transacting(trx)
        .withSchema(systemConstants.SportsDbSchema.WSL)
        .where("roundHeatId", roundHeat.id)
        .select(["id", "roundHeatId", "athleteId", "heatScore"])
        .whereNotNull("heatScore")
        .whereNull("heatPosition")
        .orderBy("heatScore", "desc");

      if (!scores.length) return false;

      let count = 1;
      scores.forEach((score) => {
        score.heatPosition = count;
        count++;
      });

      await Promise.all(
        scores.map((row) =>
          knex("scores")
            .transacting(trx)
            .withSchema(systemConstants.SportsDbSchema.WSL)
            .where("id", row.id)
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
        .withSchema(systemConstants.SportsDbSchema.WSL)
        .count("id")
        .first();

      // eslint-disable-next-line no-console
      console.log("+++++Round Heat Counts", roundHeatsCount.count);

      let offset = 0;
      let roundHeatsExists = true;
      while (roundHeatsExists) {
        const result = await updateScoresByRoundHeats(knex, trx, offset);

        if (!result) roundHeatsExists = false;
        offset = offset + 10;
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

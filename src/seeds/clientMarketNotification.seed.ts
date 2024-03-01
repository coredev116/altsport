import { Knex } from "knex";

import config from "./config";

import * as systemConstants from "../constants/system";

export async function seed(knex: Knex) {
  if (config.isLocal || config.isRelease || config.isStaging || config.isDevelop) return true;

  const clientsEmails = ["client@gmail.com"];

  await knex.transaction(async (trx) => {
    try {
      // create markets
      const markets = [
        { name: "Event Winner", key: systemConstants.OddMarkets.EVENT_WINNER_PROJECTIONS },
        { name: "Second Place", key: systemConstants.OddMarkets.EVENT_SECOND_PLACE_PROJECTIONS },
        { name: "Heat Winner", key: systemConstants.OddMarkets.HEAT_PROJECTIONS },
        { name: "Prop Bets", key: systemConstants.OddMarkets.PROP_BET_PROJECTIONS },
        { name: "Head To Head", key: systemConstants.OddMarkets.HEAD_TO_HEAD_PROJECTIONS },
        { name: "Podiums", key: systemConstants.OddMarkets.PODIUM_PROJECTIONS },
        { name: "Shows", key: systemConstants.OddMarkets.SHOWS_PROJECTIONS },
      ];

      // insert markets that do not exist
      await Promise.all(
        markets.map(async (marketRow) => {
          const isExists = await knex("oddMarkets")
            .transacting(trx)
            .where("key", marketRow.key)
            .select("id")
            .first();
          if (!isExists) {
            await knex("oddMarkets").transacting(trx).insert(marketRow);
          }
        }),
      );

      const clienRows = await knex("clients")
        .transacting(trx)
        .whereIn("email", clientsEmails)
        .select("id");

      if (!clienRows.length) return false;

      const marketRows = await knex("oddMarkets").transacting(trx).select(["id"]);

      await Promise.all(
        clienRows.map(async (clientRow) => {
          // subscribe the client to all markets
          const rows = marketRows.map((row) => ({
            clientId: clientRow.id,
            oddMarketId: row.id,
          }));

          await knex("clientMarketNotifications").transacting(trx).insert(rows);
        }),
      );

      await trx.commit();

      return true;
    } catch (error) {
      console.error(error);
      await trx.rollback();
      throw error;
    }
  });
}

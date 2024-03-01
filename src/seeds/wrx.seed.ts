import { Knex } from "knex";
import { faker } from "@faker-js/faker";

import Sports from "../entities/sports.entity";
import * as systemConstants from "../constants/system";

import config from "./config";

export async function seed(knex: Knex) {
  await knex.transaction(async (trx) => {
    try {
      if (config.isLocal || config.isRelease || config.isStaging || config.isDevelop) return true;

      await knex("propBets")
        .transacting(trx)
        .withSchema(systemConstants.SportsDbSchema.NRX)
        .delete();
      await knex("playerHeadToHeads")
        .transacting(trx)
        .withSchema(systemConstants.SportsDbSchema.NRX)
        .delete();
      await knex("projectionEventOutcome")
        .transacting(trx)
        .withSchema(systemConstants.SportsDbSchema.NRX)
        .delete();
      await knex("projectionEventHeatOutcome")
        .transacting(trx)
        .withSchema(systemConstants.SportsDbSchema.NRX)
        .delete();
      await knex("scores").transacting(trx).withSchema(systemConstants.SportsDbSchema.NRX).delete();
      await knex("roundHeats")
        .transacting(trx)
        .withSchema(systemConstants.SportsDbSchema.NRX)
        .delete();
      await knex("eventRounds")
        .transacting(trx)
        .withSchema(systemConstants.SportsDbSchema.NRX)
        .delete();
      await knex("eventParticipants")
        .transacting(trx)
        .withSchema(systemConstants.SportsDbSchema.NRX)
        .delete();
      await knex("eventOddDerivatives")
        .transacting(trx)
        .withSchema(systemConstants.SportsDbSchema.NRX)
        .del();
      await knex("oddDerivatives")
        .transacting(trx)
        .withSchema(systemConstants.SportsDbSchema.NRX)
        .del();
      await knex("events").transacting(trx).withSchema(systemConstants.SportsDbSchema.NRX).delete();
      await knex("tourYears")
        .transacting(trx)
        .withSchema(systemConstants.SportsDbSchema.NRX)
        .delete();
      await knex("tours").transacting(trx).withSchema(systemConstants.SportsDbSchema.NRX).delete();
      await knex("athletes")
        .transacting(trx)
        .withSchema(systemConstants.SportsDbSchema.NRX)
        .delete();
      await knex("rounds").transacting(trx).withSchema(systemConstants.SportsDbSchema.NRX).delete();

      const sportName: string = "Nitrocross";
      let sport: Sports = await knex("sports")
        .transacting(trx)
        .where({
          name: sportName,
        })
        .first();

      if (!sport) {
        await knex("sports").transacting(trx).insert({
          id: faker.datatype.uuid(),
          name: sportName,
        });

        sport = await knex("sports")
          .transacting(trx)
          .where({
            name: sportName,
          })
          .first();
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

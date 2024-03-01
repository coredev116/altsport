import { Knex } from "knex";
import { faker } from "@faker-js/faker";

import * as systemConstants from "../constants/system";
import * as oddConstants from "../constants/odds";

import config from "./config";

export async function seed(knex: Knex) {
  await knex.transaction(async (trx) => {
    try {
      if (config.isLocal || config.isRelease || config.isStaging || config.isDevelop) return true;

      const oddDerivatives = [
        {
          id: faker.datatype.uuid(),
          name: "Event Winner",
          type: oddConstants.Derivatives.EVENT_WINNER,
        },
        {
          id: faker.datatype.uuid(),
          name: "Event Second Place",
          type: oddConstants.Derivatives.EVENT_SECOND_PLACE,
        },
        {
          id: faker.datatype.uuid(),
          name: "Heat To Head",
          type: oddConstants.Derivatives.HEAD_TO_HEAD,
        },
        {
          id: faker.datatype.uuid(),
          name: "Heat Winner",
          type: oddConstants.Derivatives.HEAT_WINNER,
        },
      ];

      await knex("eventOddDerivatives")
        .transacting(trx)
        .withSchema(systemConstants.SportsDbSchema.WSL)
        .del();
      await knex("oddDerivatives")
        .transacting(trx)
        .withSchema(systemConstants.SportsDbSchema.WSL)
        .del();

      // fetch existing derivatives in order to determine which ones are missing and yet to be inserted
      const existingDerivatives = await knex("oddDerivatives")
        .transacting(trx)
        .withSchema(systemConstants.SportsDbSchema.WSL)
        .select(["id", "type"])
        .where({ isActive: true, isArchived: false });
      const existingDerivativeTypes = existingDerivatives.map((item) => item.type);

      const missingDerivatives = oddDerivatives.filter(
        (derivative) => !existingDerivativeTypes.includes(derivative.type),
      );

      // insert the missing derivatives
      if (missingDerivatives.length)
        await knex("oddDerivatives")
          .transacting(trx)
          .withSchema(systemConstants.SportsDbSchema.WSL)
          .insert(missingDerivatives);

      const derivatives = await knex("oddDerivatives")
        .transacting(trx)
        .withSchema(systemConstants.SportsDbSchema.WSL)
        .select(["id", "type"])
        .where({ isActive: true, isArchived: false })
        .whereIn("type", [
          oddConstants.Derivatives.EVENT_WINNER,
          oddConstants.Derivatives.EVENT_SECOND_PLACE,
          oddConstants.Derivatives.HEAD_TO_HEAD,
        ]);

      // loop through existing events and check if each one of them has the derivates active
      const events: { id: string }[] = await knex("events")
        .transacting(trx)
        .withSchema(systemConstants.SportsDbSchema.WSL)
        .select("id")
        .where({ isActive: true, isArchived: false });

      const promises = events.map(async (event) => {
        try {
          // fetch all derivates for the event and create the ones that do not exist
          const eventDerivatives = await knex("eventOddDerivatives")
            .transacting(trx)
            .withSchema(systemConstants.SportsDbSchema.WSL)
            .select(["oddDerivatives.type as type"])
            .leftJoin("oddDerivatives", "eventOddDerivatives.oddDerivativeId", "oddDerivatives.id")
            .where({ eventId: event.id });
          const eventDerivativeIds = eventDerivatives.map((item) => item.type);

          const missingEventDerivatives = derivatives
            .filter((derivative) => !eventDerivativeIds.includes(derivative.type))
            .map((derivative) => ({
              eventId: event.id,
              oddDerivativeId: derivative.id,
              holdingPercentage: 100,
            }));

          return missingEventDerivatives;
        } catch (errorEvent) {
          throw errorEvent;
        }
      });

      const pendingEventDerivative = await Promise.all(promises);
      const payload = pendingEventDerivative.flat();

      if (payload.length)
        await knex("eventOddDerivatives")
          .transacting(trx)
          .withSchema(systemConstants.SportsDbSchema.WSL)
          .insert(payload);

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

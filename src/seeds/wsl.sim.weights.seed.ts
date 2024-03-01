import { Knex } from "knex";

import config from "./config";
import { SportsDbSchema, EventStatus, SimulationWeightTypes } from "../constants/system";

export async function seed(knex: Knex) {
  if (config.isLocal || config.isRelease || config.isStaging || config.isDevelop) return true;

  await knex.transaction(async (trx) => {
    try {
      const events: {
        id: string;
        eventLocationGroup: string;
      }[] = await knex("events")
        .withSchema(SportsDbSchema.WSL)
        .transacting(trx)
        .distinct(["events.id as id", "eventLocationGroup"])
        .leftJoin("simulationWeights", "events.id", "simulationWeights.eventId")
        .whereIn("events.eventStatus", [EventStatus.UPCOMING, EventStatus.LIVE, EventStatus.NEXT])
        .whereNull("simulationWeights.id");

      const currentYear: number = new Date().getFullYear();

      const eventWeights = events.map((event) => {
        const weights = [
          {
            eventId: event.id,
            type: SimulationWeightTypes.YEAR,
            year: currentYear - 1,
            weight: 15,
          },
          {
            eventId: event.id,
            type: SimulationWeightTypes.YEAR,
            year: currentYear,
            weight: 65,
          },
          {
            eventId: event.id,
            type: SimulationWeightTypes.LOCATION,
            location: event.eventLocationGroup,
            weight: 20,
          },
        ];

        return weights;
      });

      await knex("simulationWeights")
        .withSchema(SportsDbSchema.WSL)
        .transacting(trx)
        .insert(eventWeights.flat());

      await trx.commit();

      return true;
    } catch (error) {
      console.error(error);
      await trx.rollback();
      throw error;
    }
  });
}

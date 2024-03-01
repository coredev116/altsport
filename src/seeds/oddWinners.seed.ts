import { Knex } from "knex";

import config from "./config";

import * as systemConstants from "../constants/system";

export async function seed(knex: Knex) {
  if (config.isLocal || config.isRelease || config.isStaging || config.isDevelop) return true;

  const schemas = [
    systemConstants.SportsDbSchema.WSL,
    systemConstants.SportsDbSchema.NRX,
    systemConstants.SportsDbSchema.SLS,
    systemConstants.SportsDbSchema.SPR,
  ];

  await knex.transaction(async (trx) => {
    try {
      await Promise.all(
        schemas.map(async (schema) => {
          // find odds and group by event id so this only applies to event that have odds
          const validEventOdds = await knex("projectionEventOutcome")
            .transacting(trx)
            .withSchema(schema)
            .select(["projectionEventOutcome.eventId as id", "events.eventStatus as eventStatus"])
            .groupBy("projectionEventOutcome.eventId", "events.eventStatus")
            .whereIn("events.eventStatus", [
              systemConstants.EventStatus.COMPLETED,
              systemConstants.EventStatus.LIVE,
            ])
            .leftJoin("events", "projectionEventOutcome.eventId", "events.id");

          // return true;
          if (validEventOdds.length <= 0) return false;

          await Promise.all(
            validEventOdds.map(async (event) => {
              // update heat winner
              // for each event fetch the heats in ascending order
              const roundHeats = await knex("roundHeats")
                .transacting(trx)
                .withSchema(schema)
                .where("eventId", event.id)
                .select(["id"]);

              if (roundHeats.length <= 0) return false;

              await Promise.all(
                roundHeats.map(async (row) => {
                  // for each heat, find the winner
                  const scoreRow = await knex("scores")
                    .transacting(trx)
                    .withSchema(schema)
                    .where("roundHeatId", row.id)
                    .where("heatPosition", 1)
                    .first("athleteId");

                  if (scoreRow) {
                    await knex("roundHeats")
                      .transacting(trx)
                      .withSchema(schema)
                      .andWhere("id", row.id)
                      .update({
                        winnerAthleteId: scoreRow.athleteId,
                      });
                  }
                }),
              );

              // update event winners
              if (event.eventStatus === systemConstants.EventStatus.COMPLETED) {
                // fetch event round and then the associated round heat

                const roundHeatRow = await knex("rounds")
                  .transacting(trx)
                  .withSchema(schema)
                  .orderBy("rounds.roundNo", "desc")
                  // .whereIn("rounds.name", ["Final"])
                  .where("roundHeats.eventId", event.id)
                  .leftJoin("roundHeats", "rounds.id", "roundHeats.roundId")
                  .first("roundHeats.id as id");

                if (roundHeatRow) {
                  const scoreRow = await knex("scores")
                    .transacting(trx)
                    .withSchema(schema)
                    .where("roundHeatId", roundHeatRow.id)
                    .where("heatPosition", 1)
                    .first("athleteId");

                  if (scoreRow) {
                    await knex("events")
                      .transacting(trx)
                      .withSchema(schema)
                      .andWhere("id", event.id)
                      .update({
                        winnerAthleteId: scoreRow.athleteId,
                      });
                  }
                }
              }
            }),
          );
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

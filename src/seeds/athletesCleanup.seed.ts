import { Knex } from "knex";

import config from "./config";
import * as systemConstants from "../constants/system";

export async function seed(knex: Knex) {
  await knex.transaction(async (trx) => {
    try {
      if (config.isLocal || config.isRelease || config.isStaging || config.isDevelop) return true;

      //FDRIFT
      const athletes = await knex("athletes")
        .transacting(trx)
        .withSchema(systemConstants.SportsDbSchema.FDRIFT)
        .select([
          knex.raw(`Array_agg(athletes.id) as athletes`),
          knex.raw(
            `CONCAT(lower("athletes"."firstName"), ' ', lower("athletes"."lastName")) as name`,
          ),
        ])
        .having(
          knex.raw(
            `count(CONCAT(lower("athletes"."firstName"), ' ', lower("athletes"."lastName")))`,
          ),
          ">",
          1,
        )
        .groupBy(
          knex.raw(`CONCAT(lower("athletes"."firstName"), ' ', lower("athletes"."lastName"))`),
        );

      await Promise.all(
        athletes.map(async (athlete) => {
          const athleteToKeep = athlete.athletes[0];

          const nameSplit = athlete.name.trim().split(" ");
          const athleteFirstName = nameSplit?.[0]?.trim();
          const athleteLastName = nameSplit?.[1]?.trim();

          await knex("eventParticipants")
            .transacting(trx)
            .withSchema(systemConstants.SportsDbSchema.FDRIFT)
            .whereIn("athleteId", athlete.athletes.slice(1))
            .update({
              athleteId: athleteToKeep,
            });

          await knex("athletes")
            .transacting(trx)
            .withSchema(systemConstants.SportsDbSchema.FDRIFT)
            .andWhere("id", athleteToKeep)
            .update({
              firstName: `${athleteFirstName[0].toUpperCase()}${athleteFirstName.slice(1)}`,
              lastName: `${athleteLastName[0].toUpperCase()}${athleteLastName.slice(1)}`,
            });

          await knex("athletes")
            .transacting(trx)
            .withSchema(systemConstants.SportsDbSchema.FDRIFT)
            .whereIn("id", athlete.athletes.slice(1))
            .delete();
        }),
      );

      //SLS
      const slsAthletes = await knex("athletes")
        .transacting(trx)
        .withSchema(systemConstants.SportsDbSchema.SLS)
        .select([
          knex.raw(`Array_agg(athletes.id) as athletes`),
          knex.raw(
            `CONCAT(lower("athletes"."firstName"), ' ', lower("athletes"."lastName")) as name`,
          ),
        ])
        .having(
          knex.raw(
            `count(CONCAT(lower("athletes"."firstName"), ' ', lower("athletes"."lastName")))`,
          ),
          ">",
          1,
        )
        .groupBy(
          knex.raw(`CONCAT(lower("athletes"."firstName"), ' ', lower("athletes"."lastName"))`),
        );

      await Promise.all(
        slsAthletes.map(async (athlete) => {
          const athleteToKeep = athlete.athletes[0];

          const nameSplit = athlete.name.trim().split(" ");
          const athleteFirstName = nameSplit?.[0]?.trim();
          const athleteLastName = nameSplit?.[1]?.trim();

          await knex("scores")
            .transacting(trx)
            .withSchema(systemConstants.SportsDbSchema.SLS)
            .whereIn("athleteId", athlete.athletes.slice(1))
            .update({
              athleteId: athleteToKeep,
            });

          await knex("eventResults")
            .transacting(trx)
            .withSchema(systemConstants.SportsDbSchema.SLS)
            .whereIn("athleteId", athlete.athletes.slice(1))
            .update({
              athleteId: athleteToKeep,
            });

          await knex("events")
            .transacting(trx)
            .withSchema(systemConstants.SportsDbSchema.SLS)
            .whereIn("winnerAthleteId", athlete.athletes.slice(1))
            .update({
              winnerAthleteId: athleteToKeep,
            });

          await knex("roundHeats")
            .transacting(trx)
            .withSchema(systemConstants.SportsDbSchema.SLS)
            .whereIn("winnerAthleteId", athlete.athletes.slice(1))
            .update({
              winnerAthleteId: athleteToKeep,
            });

          await knex("eventParticipants")
            .transacting(trx)
            .withSchema(systemConstants.SportsDbSchema.SLS)
            .whereIn("athleteId", athlete.athletes.slice(1))
            .update({
              athleteId: athleteToKeep,
            });

          await knex("athletes")
            .transacting(trx)
            .withSchema(systemConstants.SportsDbSchema.SLS)
            .andWhere("id", athleteToKeep)
            .update({
              firstName: `${athleteFirstName[0].toUpperCase()}${athleteFirstName.slice(1)}`,
              lastName: `${athleteLastName[0].toUpperCase()}${athleteLastName.slice(1)}`,
            });

          await knex("athletes")
            .transacting(trx)
            .withSchema(systemConstants.SportsDbSchema.SLS)
            .whereIn("id", athlete.athletes.slice(1))
            .delete();
        }),
      );

      //MOTOCROSS
      const motocrsAthletes = await knex("athletes")
        .transacting(trx)
        .withSchema(systemConstants.SportsDbSchema.MOTOCRS)
        .select([
          knex.raw(`Array_agg(athletes.id) as athletes`),
          knex.raw(
            `CONCAT(lower("athletes"."firstName"), ' ', lower("athletes"."lastName")) as name`,
          ),
        ])
        .having(
          knex.raw(
            `count(CONCAT(lower("athletes"."firstName"), ' ', lower("athletes"."lastName")))`,
          ),
          ">",
          1,
        )
        .groupBy(
          knex.raw(`CONCAT(lower("athletes"."firstName"), ' ', lower("athletes"."lastName"))`),
        );

      await Promise.all(
        motocrsAthletes.map(async (athlete) => {
          const athleteToKeep = athlete.athletes[0];

          const nameSplit = athlete.name.trim().split(" ");
          const athleteFirstName = nameSplit?.[0]?.trim();
          const athleteLastName = nameSplit?.[1]?.trim();

          await knex("eventParticipants")
            .transacting(trx)
            .withSchema(systemConstants.SportsDbSchema.MOTOCRS)
            .whereIn("athleteId", athlete.athletes.slice(1))
            .update({
              athleteId: athleteToKeep,
            });

          await knex("athletes")
            .transacting(trx)
            .withSchema(systemConstants.SportsDbSchema.MOTOCRS)
            .andWhere("id", athleteToKeep)
            .update({
              firstName: `${athleteFirstName[0].toUpperCase()}${athleteFirstName.slice(1)}`,
              lastName: `${athleteLastName[0].toUpperCase()}${athleteLastName.slice(1)}`,
            });

          await knex("athletes")
            .transacting(trx)
            .withSchema(systemConstants.SportsDbSchema.MOTOCRS)
            .whereIn("id", athlete.athletes.slice(1))
            .delete();
        }),
      );

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

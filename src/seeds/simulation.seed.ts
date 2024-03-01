import { Knex } from "knex";
import fs from "fs";

import Events from "../entities/wsl/events.entity";
import EventParticipants from "../entities/wsl/eventParticipants.entity";

import config from "./config";

// import { calc } from "../helpers/simulation";

export async function seed(knex: Knex) {
  try {
    // const res = await calc();
    if (config.isLocal || config.isRelease || config.isStaging || config.isDevelop) return true;

    // 2022 event
    const event: Events = await knex("events")
      .where({
        id: "3d4258e9-fdd8-4161-a2a5-b65bbe67cd00",
      })
      .first();

    // fetch all participants for the 2022 event
    const eventParticipants: EventParticipants[] = await knex("eventParticipants")
      .where({
        eventId: event.id,
      })
      .leftJoin("athletes", "eventParticipants.athleteId", "athletes.id")
      .select([
        "eventParticipants.seedNo",
        knex.raw(`CONCAT("athletes"."firstName", ' ', "athletes"."lastName") as name`),
      ]);
    // eslint-disable-next-line no-console
    console.log(
      "🚀 ~ file: simulation.seed.ts ~ line 18 ~ seed ~ eventParticipants",
      eventParticipants,
    );

    const result: any = await knex("events")
      .select([
        "events.name as eventName",
        "events.eventLocation",
        "rounds.roundNo as roundNumber",
        "rounds.name as roundName",
        "roundHeats.heatName",
        knex.raw(`CONCAT("athletes"."firstName", ' ', "athletes"."lastName") as name`),
        knex.raw(`to_char( events."startDate" , 'YYYY') as year`),
        "scores.heatScore as heatScore",
      ])
      .leftJoin("eventParticipants", "events.id", "eventParticipants.eventId")
      .leftJoin("athletes", "eventParticipants.athleteId", "athletes.id")
      .leftJoin("eventRounds", "events.id", "eventRounds.eventId")
      .leftJoin("rounds", "eventRounds.roundId", "rounds.id")
      .leftJoin("roundHeats", "rounds.id", "roundHeats.roundId")
      .leftJoin("scores", "roundHeats.id", "scores.roundHeatId");
    // .limit(1)
    // .whereNotIn("events.id", [event.id]);

    const parsedResult = result.map((item) => ({
      ...item,
      athleteName: item.name,
      eventYear: +item.year,
      heatScore: +item.heatScore,
    }));

    const json = JSON.stringify(parsedResult);

    await fs.promises.writeFile("myjsonfile.json", json, {
      encoding: "utf8",
    });

    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

import { Knex } from "knex";
import { faker } from "@faker-js/faker";
import { parse, subHours, addHours, getYear, parseISO } from "date-fns";
import chunk from "lodash.chunk";

import Sports from "../entities/sports.entity";
import * as eventConstants from "../constants/events";
import * as systemConstants from "../constants/system";
import { createAthlete } from "./helpers/athlete.helper";

import config from "./config";

export async function seed(knex: Knex) {
  await knex.transaction(async (trx) => {
    try {
      if (config.isLocal || config.isRelease || config.isStaging || config.isDevelop) return true;

      await knex("playerHeadToHeads")
        .transacting(trx)
        .withSchema(systemConstants.SportsDbSchema.SLS)
        .del();
      await knex("propBets").transacting(trx).withSchema(systemConstants.SportsDbSchema.SLS).del();
      await knex("projectionEventOutcome")
        .transacting(trx)
        .withSchema(systemConstants.SportsDbSchema.SLS)
        .del();
      await knex("projectionEventHeatOutcome")
        .transacting(trx)
        .withSchema(systemConstants.SportsDbSchema.SLS)
        .del();
      await knex("scores").transacting(trx).withSchema(systemConstants.SportsDbSchema.SLS).del();
      await knex("roundHeats")
        .transacting(trx)
        .withSchema(systemConstants.SportsDbSchema.SLS)
        .del();
      await knex("eventRounds")
        .transacting(trx)
        .withSchema(systemConstants.SportsDbSchema.SLS)
        .del();
      await knex("eventParticipants")
        .transacting(trx)
        .withSchema(systemConstants.SportsDbSchema.SLS)
        .del();
      await knex("eventOddDerivatives")
        .transacting(trx)
        .withSchema(systemConstants.SportsDbSchema.SLS)
        .del();
      await knex("oddDerivatives")
        .transacting(trx)
        .withSchema(systemConstants.SportsDbSchema.SLS)
        .del();
      await knex("events").transacting(trx).withSchema(systemConstants.SportsDbSchema.SLS).del();
      await knex("leagueYears")
        .transacting(trx)
        .withSchema(systemConstants.SportsDbSchema.SLS)
        .del();
      await knex("leagues").transacting(trx).withSchema(systemConstants.SportsDbSchema.SLS).del();
      await knex("athletes").transacting(trx).withSchema(systemConstants.SportsDbSchema.SLS).del();
      await knex("rounds").transacting(trx).withSchema(systemConstants.SportsDbSchema.SLS).del();

      const sportName: string = "Street Level Skateboarding";

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

      return false;

      const league = {
        id: faker.datatype.uuid(),
        sportId: sport.id,
        name: "SLS",
        gender: "women",
      };
      const leagueYears = [2019, 2020, 2021, 2022].map((year) => ({
        id: faker.datatype.uuid(),
        year,
        leagueId: league.id,
      }));

      await knex("leagues")
        .transacting(trx)
        .withSchema(systemConstants.SportsDbSchema.SLS)
        .insert(league);

      // create years for the league
      await knex("leagueYears")
        .transacting(trx)
        .withSchema(systemConstants.SportsDbSchema.SLS)
        .insert(leagueYears);

      // for each year create the same event at the same location
      const events = leagueYears.map((leagueYear) => ({
        id: faker.datatype.uuid(),
        leagueYearId: leagueYear.id,
        name: "SLS Salt Lake City",
        startDate: parse(`${leagueYear.year}-12-08`, "yyyy-MM-dd", new Date()).toISOString(),
        endDate: parse(`${leagueYear.year}-12-20`, "yyyy-MM-dd", new Date()).toISOString(),
        eventStatus:
          leagueYear.year !== 2022
            ? eventConstants.EventStatus.COMPLETED
            : eventConstants.EventStatus.LIVE,
        eventLocation: "Salt Lake City, Utah, USA",
      }));
      await knex("events")
        .transacting(trx)
        .withSchema(systemConstants.SportsDbSchema.SLS)
        .insert(events);

      const athletes = Array(36)
        .fill(1)
        .map(() => createAthlete());
      await knex("athletes")
        .transacting(trx)
        .withSchema(systemConstants.SportsDbSchema.SLS)
        .insert(athletes);

      // associate each of the 36 athletes with the event for all the years
      const eventParticipants = [];
      events.map((event) => {
        athletes.map((athlete, index) => {
          eventParticipants.push({
            id: faker.datatype.uuid(),
            eventId: event.id,
            athleteId: athlete.id,
            seedNo: index + 1, // this isn't really right but can't think of any way to simulate a valid seed
            status: eventConstants.AthleteStatus.ACTIVE,
            baseRoundScore: +faker.finance.amount(10, 30, 3),
            baseRunScore: +faker.finance.amount(10, 30, 3),
            baseTrickScore: +faker.finance.amount(10, 30, 3),
            trickCompletion: +faker.finance.amount(0, 0.7, 8),
          });
        });
      });
      await knex("eventParticipants")
        .transacting(trx)
        .withSchema(systemConstants.SportsDbSchema.SLS)
        .insert(eventParticipants);

      // create the rounds
      // create the heats
      // create and attach the participants

      const rounds = [
        {
          name: "Semifinal",
        },
        {
          name: "Final",
        },
      ].map((round, index) => ({
        id: faker.datatype.uuid(),
        name: round.name,
        roundNo: index + 1,
      }));

      await knex("rounds")
        .transacting(trx)
        .withSchema(systemConstants.SportsDbSchema.SLS)
        .insert(rounds);

      // associate the rounds with each event
      const eventRounds = [];
      events.map((event) => {
        rounds.map((round, index) => {
          let roundStatus = eventConstants.RoundStatus.COMPLETED;
          const eventYear = getYear(parseISO(event.startDate));

          if (eventYear === 2022) {
            switch (round.name) {
              case "Semifinal":
                roundStatus = eventConstants.RoundStatus.COMPLETED;
                break;

              default:
                roundStatus = eventConstants.RoundStatus.UPCOMING;
                break;
            }
          }

          eventRounds.push({
            id: faker.datatype.uuid(),
            startDate: addHours(new Date(event.startDate), index + 1).toISOString(),
            // endDate: addHours(new Date(event.endDate), index + 2).toISOString(),
            eventId: event.id,
            roundId: round.id,
            roundStatus,
          });
        });
      });
      await knex("eventRounds")
        .transacting(trx)
        .withSchema(systemConstants.SportsDbSchema.SLS)
        .insert(eventRounds);

      const semifinals = rounds.find((round) => round.name === "Semifinal");
      const final = rounds.find((round) => round.name === "Final");

      const roundHeats = [];
      const scores = [];
      events.map((event) => {
        const roundFinalsAthletes = [];

        const semifinalAthleteGroup = chunk(athletes, 16);
        // semiFinals
        semifinalAthleteGroup.map((athleteGroups, index) => {
          const roundHeat = {
            id: faker.datatype.uuid(),
            eventId: event.id,
            roundId: semifinals.id,
            heatName: `Heat ${index + 1}`,
            heatNo: index + 1,
            heatStatus: eventConstants.HeatStatus.COMPLETED,
            startDate: subHours(new Date(), 1).toISOString(),
            endDate: new Date().toISOString(),
          };
          roundHeats.push(roundHeat);

          scores.push(
            ...athleteGroups.map((athlete, athleteIndex) => ({
              id: faker.datatype.uuid(),
              eventId: event.id,
              roundHeatId: roundHeat.id,
              athleteId: athlete.id,
              roundSeed: athleteIndex + 1,
              lineScore1: faker.finance.amount(0, 20, 2),
              lineScore2: faker.finance.amount(0, 20, 2),
              roundScore: faker.finance.amount(0, 20, 2),
              // trickScore: faker.finance.amount(0, 20, 2),
              heatPosition: athleteIndex + 1,
            })),
          );

          // FIXME: not really correct but for the sake of seeding
          roundFinalsAthletes.push(...athleteGroups.slice(0, 4));
        });

        const finalAthleteGroup = chunk(roundFinalsAthletes, 4);
        // semiFinals
        finalAthleteGroup.map((athleteGroups, index) => {
          const roundHeat = {
            id: faker.datatype.uuid(),
            eventId: event.id,
            roundId: final.id,
            heatName: `Heat ${index + 1}`,
            heatNo: index + 1,
            heatStatus: eventConstants.HeatStatus.COMPLETED,
            startDate: subHours(new Date(), 1).toISOString(),
            endDate: new Date().toISOString(),
          };
          roundHeats.push(roundHeat);

          scores.push(
            ...athleteGroups.map((athlete, athleteIndex) => ({
              id: faker.datatype.uuid(),
              eventId: event.id,
              roundHeatId: roundHeat.id,
              athleteId: athlete.id,
              roundSeed: athleteIndex + 1,
              runScore: faker.finance.amount(0, 20, 2),
              roundScore: faker.finance.amount(0, 20, 2),
              // trickScore: faker.finance.amount(0, 20, 2),
              heatPosition: athleteIndex + 1,
            })),
          );
        });
      });

      await knex("roundHeats")
        .transacting(trx)
        .withSchema(systemConstants.SportsDbSchema.SLS)
        .insert(roundHeats);
      await knex("scores")
        .transacting(trx)
        .withSchema(systemConstants.SportsDbSchema.SLS)
        .insert(scores);

      return true;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      await trx.rollback();
      throw error;
    }
  });
}

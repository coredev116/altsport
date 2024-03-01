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

      await knex("propBets")
        .transacting(trx)
        .withSchema(systemConstants.SportsDbSchema.WSL)
        .delete();
      await knex("projectionEventOutcome")
        .transacting(trx)
        .withSchema(systemConstants.SportsDbSchema.WSL)
        .delete();
      await knex("projectionEventHeatOutcome")
        .transacting(trx)
        .withSchema(systemConstants.SportsDbSchema.WSL)
        .delete();
      await knex("scores").transacting(trx).withSchema(systemConstants.SportsDbSchema.WSL).delete();
      await knex("roundHeats")
        .transacting(trx)
        .withSchema(systemConstants.SportsDbSchema.WSL)
        .delete();
      await knex("eventRounds")
        .transacting(trx)
        .withSchema(systemConstants.SportsDbSchema.WSL)
        .delete();
      await knex("eventParticipants")
        .transacting(trx)
        .withSchema(systemConstants.SportsDbSchema.WSL)
        .delete();
      await knex("eventOddDerivatives")
        .transacting(trx)
        .withSchema(systemConstants.SportsDbSchema.WSL)
        .del();
      await knex("oddDerivatives")
        .transacting(trx)
        .withSchema(systemConstants.SportsDbSchema.WSL)
        .del();
      await knex("events").transacting(trx).withSchema(systemConstants.SportsDbSchema.WSL).delete();
      await knex("tourYears")
        .transacting(trx)
        .withSchema(systemConstants.SportsDbSchema.WSL)
        .delete();
      await knex("tours").transacting(trx).withSchema(systemConstants.SportsDbSchema.WSL).delete();
      await knex("athletes")
        .transacting(trx)
        .withSchema(systemConstants.SportsDbSchema.WSL)
        .delete();
      await knex("rounds").transacting(trx).withSchema(systemConstants.SportsDbSchema.WSL).delete();

      // await knex("sports").transacting(trx).delete();

      // await knex("sports").transacting(trx).insert({
      //   id: faker.datatype.uuid(),
      //   name: "World Surf League",
      // });

      const sportName: string = "World Surf League";
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

      /* if (!sport) {
        await knex("sports")  .transacting(trx)
        .withSchema(systemConstants.SportsDbSchema.WSL).insert({
          id: faker.datatype.uuid(),
          name: "World Surf League",
        });

        sport = await knex("sports")
            .transacting(trx)
        .withSchema(systemConstants.SportsDbSchema.WSL)
          .where({
            name: "World Surf League",
          })
          .first();
      } */

      const tour = {
        id: faker.datatype.uuid(),
        sportId: sport.id,
        name: "Men's Championship Tour",
        gender: "men",
      };
      // const tourYears = [2019].map((year) => ({
      const tourYears = [2019, 2020, 2021, 2022].map((year) => ({
        id: faker.datatype.uuid(),
        year,
        tourId: tour.id,
      }));

      await knex("tours")
        .transacting(trx)
        .withSchema(systemConstants.SportsDbSchema.WSL)
        .insert(tour);

      // create years for the tour
      await knex("tourYears")
        .transacting(trx)
        .withSchema(systemConstants.SportsDbSchema.WSL)
        .insert(tourYears);

      // for each year create the same event at the same location
      const events = tourYears.map((tourYear, index) => ({
        id: faker.datatype.uuid(),
        tourYearId: tourYear.id,
        name: "Billabong Pro Pipeline",
        startDate: parse(`${tourYear.year}-12-08`, "yyyy-MM-dd", new Date()).toISOString(),
        endDate: parse(`${tourYear.year}-12-20`, "yyyy-MM-dd", new Date()).toISOString(),
        eventNumber: index + 1,
        eventStatus:
          tourYear.year !== 2022
            ? eventConstants.EventStatus.COMPLETED
            : eventConstants.EventStatus.LIVE,
        eventLocation: "Banzai Pipeline",
      }));
      await knex("events")
        .transacting(trx)
        .withSchema(systemConstants.SportsDbSchema.WSL)
        .insert(events);

      const athletes = Array(36)
        .fill(1)
        .map(() => createAthlete());
      await knex("athletes")
        .transacting(trx)
        .withSchema(systemConstants.SportsDbSchema.WSL)
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
          });
        });
      });
      await knex("eventParticipants")
        .transacting(trx)
        .withSchema(systemConstants.SportsDbSchema.WSL)
        .insert(eventParticipants);

      // create the rounds
      // create the heats
      // create and attach the participants

      const rounds = [
        {
          name: "Seeding Round",
        },
        {
          name: "Elimination Round",
        },
        {
          name: "Round of 32",
        },
        {
          name: "Round of 16",
        },
        {
          name: "Qurterfinals",
        },
        {
          name: "Semifinals",
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
        .withSchema(systemConstants.SportsDbSchema.WSL)
        .insert(rounds);

      // associate the rounds with each event
      const eventRounds = [];
      events.map((event) => {
        rounds.map((round, index) => {
          let roundStatus = eventConstants.RoundStatus.COMPLETED;
          const eventYear = getYear(parseISO(event.startDate));

          if (eventYear === 2022) {
            switch (round.name) {
              case "Round of 32":
                roundStatus = eventConstants.RoundStatus.LIVE;
                break;

              case "Seeding Round":
              case "Elimination Round":
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
            endDate: addHours(new Date(event.endDate), index + 2).toISOString(),
            eventId: event.id,
            roundId: round.id,
            roundStatus,
          });
        });
      });
      await knex("eventRounds")
        .transacting(trx)
        .withSchema(systemConstants.SportsDbSchema.WSL)
        .insert(eventRounds);

      const seedingRound = rounds.find((round) => round.name === "Seeding Round");
      const eliminationRound = rounds.find((round) => round.name === "Elimination Round");
      const roundOf32 = rounds.find((round) => round.name === "Round of 32");
      const roundOf16 = rounds.find((round) => round.name === "Round of 16");
      const qurterfinals = rounds.find((round) => round.name === "Qurterfinals");
      const semifinals = rounds.find((round) => round.name === "Semifinals");
      const final = rounds.find((round) => round.name === "Final");

      const roundHeats = [];
      const scores = [];
      events.map((event) => {
        // no clue how the round logic works so manually setting up the data

        // should return 12 groups with 3 players each
        const seedingRoundAthleteGroups = chunk(athletes, 3);
        const eliminationRoundAthletes = [];
        const roundOf32Athletes = [];
        const roundOf16Athletes = [];
        const roundQurterfinalsAthletes = [];
        const roundSemifinalsAthletes = [];
        const roundFinalsAthletes = [];

        // seeding round
        seedingRoundAthleteGroups.map((athleteGroups, index) => {
          let heatStatus = eventConstants.HeatStatus.COMPLETED;
          const eventYear = getYear(parseISO(event.startDate));

          if (eventYear === 2022) {
            switch (seedingRound.name) {
              case "Round of 32":
                heatStatus = eventConstants.HeatStatus.LIVE;
                break;

              case "Seeding Round":
              case "Elimination Round":
                heatStatus = eventConstants.HeatStatus.COMPLETED;
                break;

              default:
                heatStatus = eventConstants.HeatStatus.UPCOMING;
                break;
            }
          }

          const roundHeat = {
            id: faker.datatype.uuid(),
            eventId: event.id,
            roundId: seedingRound.id,
            heatName: `Heat ${index + 1}`,
            heatNo: index + 1,
            heatStatus,
            // TODO: need better logic
            startDate:
              heatStatus !== eventConstants.HeatStatus.UPCOMING
                ? subHours(new Date(), 1).toISOString()
                : null,
            endDate:
              heatStatus !== eventConstants.HeatStatus.UPCOMING ? new Date().toISOString() : null,
          };
          roundHeats.push(roundHeat);

          scores.push(
            ...athleteGroups.map((athlete, athleteIndex) => ({
              id: faker.datatype.uuid(),
              eventId: event.id,
              roundHeatId: roundHeat.id,
              athleteId: athlete.id,
              roundSeed: athleteIndex + 1,
              heatScore: faker.finance.amount(0, 20, 2),
              heatPosition: athleteIndex + 1,
            })),
          );

          // the first 2 athletes in the group progress to the next round
          // while the third goes to the elimination round
          roundOf32Athletes.push(...athleteGroups.slice(0, 2));
          eliminationRoundAthletes.push(athleteGroups[2]);
        });

        const eliminationRoundAthleteGroup = chunk(eliminationRoundAthletes, 3);
        // elimination round
        eliminationRoundAthleteGroup.map((athleteGroups, index) => {
          const roundHeat = {
            id: faker.datatype.uuid(),
            eventId: event.id,
            roundId: eliminationRound.id,
            heatName: `Heat ${index + 1}`,
            heatNo: index + 1,
            heatStatus: eventConstants.HeatStatus.COMPLETED,
            // TODO: need better logic
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
              heatScore: faker.finance.amount(0, 20, 2),
              heatPosition: athleteIndex + 1,
            })),
          );

          // the first 2 athletes in the group progress to the next round
          // while the third is eliminated
          roundOf32Athletes.push(...athleteGroups.slice(0, 2));
        });

        const roundOf32AthleteGroup = chunk(roundOf32Athletes, 2);
        // round of 32
        roundOf32AthleteGroup.map((athleteGroups, index) => {
          const roundHeat = {
            id: faker.datatype.uuid(),
            eventId: event.id,
            roundId: roundOf32.id,
            heatName: `Heat ${index + 1}`,
            heatNo: index + 1,
            heatStatus: eventConstants.HeatStatus.COMPLETED,
            // TODO: need better logic
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
              heatScore: faker.finance.amount(0, 20, 2),
              heatPosition: athleteIndex + 1,
            })),
          );

          // the first one goes ahead and the others are eliminated
          roundOf16Athletes.push(athleteGroups[0]);
        });

        const roundOf16AthleteGroup = chunk(roundOf16Athletes, 2);
        // round of 16
        roundOf16AthleteGroup.map((athleteGroups, index) => {
          const roundHeat = {
            id: faker.datatype.uuid(),
            eventId: event.id,
            roundId: roundOf16.id,
            heatName: `Heat ${index + 1}`,
            heatNo: index + 1,
            heatStatus: eventConstants.HeatStatus.COMPLETED,
            // TODO: need better logic
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
              heatScore: faker.finance.amount(0, 20, 2),
              heatPosition: athleteIndex + 1,
            })),
          );

          // the first one goes ahead and the others are eliminated
          roundQurterfinalsAthletes.push(athleteGroups[0]);
        });

        const quarterfinalAthleteGroup = chunk(roundQurterfinalsAthletes, 2);
        // round of 16
        quarterfinalAthleteGroup.map((athleteGroups, index) => {
          const roundHeat = {
            id: faker.datatype.uuid(),
            eventId: event.id,
            roundId: qurterfinals.id,
            heatName: `Heat ${index + 1}`,
            heatNo: index + 1,
            heatStatus: eventConstants.HeatStatus.COMPLETED,
            // TODO: need better logic
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
              heatScore: faker.finance.amount(0, 20, 2),
              heatPosition: athleteIndex + 1,
            })),
          );

          // the first one goes ahead and the others are eliminated
          roundSemifinalsAthletes.push(athleteGroups[0]);
        });

        const semifinalAthleteGroup = chunk(roundSemifinalsAthletes, 2);
        // semiFinals
        semifinalAthleteGroup.map((athleteGroups, index) => {
          const roundHeat = {
            id: faker.datatype.uuid(),
            eventId: event.id,
            roundId: semifinals.id,
            heatName: `Heat ${index + 1}`,
            heatNo: index + 1,
            heatStatus: eventConstants.HeatStatus.COMPLETED,
            // TODO: need better logic
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
              heatScore: faker.finance.amount(0, 20, 2),
              heatPosition: athleteIndex + 1,
            })),
          );

          // the first one goes ahead and the others are eliminated
          roundFinalsAthletes.push(athleteGroups[0]);
        });

        const finalAthleteGroup = chunk(roundFinalsAthletes, 2);
        // semiFinals
        finalAthleteGroup.map((athleteGroups, index) => {
          const roundHeat = {
            id: faker.datatype.uuid(),
            eventId: event.id,
            roundId: final.id,
            heatName: `Heat ${index + 1}`,
            heatNo: index + 1,
            heatStatus: eventConstants.HeatStatus.COMPLETED,
            // TODO: need better logic
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
              heatScore: faker.finance.amount(0, 20, 2),
              heatPosition: athleteIndex + 1,
            })),
          );
        });
      });

      await knex("roundHeats")
        .transacting(trx)
        .withSchema(systemConstants.SportsDbSchema.WSL)
        .insert(roundHeats);
      await knex("scores")
        .transacting(trx)
        .withSchema(systemConstants.SportsDbSchema.WSL)
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

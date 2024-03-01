import { Knex } from "knex";
import { v4 } from "uuid";
import axios from "axios";
import { parse } from "date-fns";
import { zonedTimeToUtc } from "date-fns-tz";

import config from "./config";
import { SportsDbSchema, EventStatus, RoundStatus, MASLPeriods } from "../constants/system";
import { TeamStatus } from "../constants/events";

import AuthTicket from "../interfaces/masl/authTicket";
import Leagues from "../interfaces/masl/leagues";
import Seasons from "../interfaces/masl/seasons";
import Teams, { Team } from "../interfaces/masl/teams";
import Games, { Facility } from "../interfaces/masl/games";

const baseUrl = "https://stats.api.digitalshift.ca";
const apiKey = config.maslApiKey;

const apiInstance = axios.create({
  baseURL: baseUrl,
  timeout: 50_000,
});

export async function seed(knex: Knex) {
  if (config.isLocal || config.isRelease || config.isStaging || config.isDevelop) return true;

  await knex.transaction(async (trx) => {
    try {
      await knex("scores").withSchema(SportsDbSchema.MASL).transacting(trx).del();
      await knex("eventRounds").withSchema(SportsDbSchema.MASL).transacting(trx).del();
      await knex("eventTeams").withSchema(SportsDbSchema.MASL).transacting(trx).del();
      await knex("rounds").withSchema(SportsDbSchema.MASL).transacting(trx).del();
      await knex("events").withSchema(SportsDbSchema.MASL).transacting(trx).del();
      await knex("teams").withSchema(SportsDbSchema.MASL).transacting(trx).del();
      await knex("leagueYears").withSchema(SportsDbSchema.MASL).transacting(trx).del();
      await knex("leagues").withSchema(SportsDbSchema.MASL).transacting(trx).del();

      // fetch auth ticket
      const {
        data: {
          ticket: { hash },
        },
      } = await apiInstance.get<AuthTicket>("/login", { params: { key: apiKey } });

      // fetch leagues
      const {
        data: { leagues },
      } = await apiInstance.get<Leagues>("/leagues", {
        params: {
          ticket: hash,
        },
      });

      // for now only limiting to MASL
      const league = leagues.find((item) => item.name === "Major Arena Soccer League");

      let dbLeagueId: string = v4();
      // check if league exists, if not then insert
      const leagueRow = await knex("leagues")
        .transacting(trx)
        .withSchema(SportsDbSchema.MASL)
        .where("name", league.name)
        .where("gender", "men")
        .select("id")
        .first();
      if (!leagueRow) {
        await knex("leagues").transacting(trx).withSchema(SportsDbSchema.MASL).insert({
          id: dbLeagueId,
          name: league.name,
          gender: "men",
          providerLastUpdated: league.updated_at,
        });
      } else {
        dbLeagueId = leagueRow.id;
      }

      // fetch season for the league
      const {
        data: { seasons },
      } = await apiInstance.get<Seasons>(`/league/${league.id}/seasons`, {
        params: {
          ticket: hash,
        },
      });

      const applicableSeasons: string[] = ["2022-2023", "2021-2022", "2021"];
      // const applicableSeasons: string[] = ["2022-2023"];

      // maintain a list of rounds for all seasons and leagues that can
      // be queried at application level so its easier
      const roundsObj: {
        [roundName: string]: {
          id: string;
          name: string;
        };
      } = {};

      for await (const season of seasons.filter((row) => applicableSeasons.includes(row.name))) {
        const nameSplit: string[] = season.name.split("-");
        const year: number = nameSplit.length > 1 ? +nameSplit[1] : +nameSplit[0];

        // if the year already exists, no need to re-insert
        let dbLeagueYearId: string = v4();
        const leagueYearRow = await knex("leagueYears")
          .transacting(trx)
          .withSchema(SportsDbSchema.MASL)
          .where("leagueId", dbLeagueId)
          .where("year", year)
          .select("id")
          .first();
        if (!leagueYearRow) {
          await knex("leagueYears").transacting(trx).withSchema(SportsDbSchema.MASL).insert({
            id: dbLeagueYearId,
            leagueId: dbLeagueId,
            year,
            providerLastUpdated: season.updated_at,
          });
        } else {
          dbLeagueYearId = leagueYearRow.id;
        }

        const [teamResponse, gamesResponse] = await Promise.all([
          apiInstance.get<Teams>(`/season/${season.id}/teams`, {
            params: {
              ticket: hash,
            },
          }),
          apiInstance.get<Games>(`/season/${season.id}/games`, {
            params: {
              ticket: hash,
            },
          }),
        ]);

        const {
          data: { games, references },
        } = gamesResponse;

        const {
          data: { teams },
        } = teamResponse;

        const teamIds: number[] = [];
        const insertTeams = teams.map((team) => {
          teamIds.push(team.id);

          return {
            providerTeamId: team.id,
            name: team.name,
            shortName: team.short_name,
            logo: team.logo_url.full,
            city: team.city,
          };
        });

        // for MASL, every season it looks like the same teams change ids
        // hence there can be multiple instances of the same team with different provider ids
        const existingDbTeamRows: {
          providerTeamId: string;
          name: string;
        }[] = await knex("teams")
          .transacting(trx)
          .withSchema(SportsDbSchema.MASL)
          .whereIn("providerTeamId", teamIds)
          .select("id", "providerTeamId", "name");
        const existingDbTeamProviderIds: string[] = existingDbTeamRows.map(
          (row) => row.providerTeamId,
        );
        const existingDbTeamProviderNames: string[] = existingDbTeamRows.map((row) => row.name);

        const toInsertTeams = insertTeams.filter(
          (row) =>
            !existingDbTeamProviderIds.includes(`${row.providerTeamId}`) &&
            !existingDbTeamProviderNames.includes(row.name),
        );

        if (toInsertTeams.length)
          await knex("teams")
            .transacting(trx)
            .withSchema(SportsDbSchema.MASL)
            .insert(toInsertTeams);

        const dbTeamRows: {
          id: string;
          providerTeamId: string;
        }[] = await knex("teams")
          .transacting(trx)
          .withSchema(SportsDbSchema.MASL)
          .whereIn("providerTeamId", teamIds)
          .select("id", "providerTeamId");

        // maintain a list of quickly accessible object mapping
        const locations: {
          [locationId: string]: Facility;
        } = {};
        references.facility.forEach((facility) => {
          locations[facility.id] = facility;
        });

        // maintain a list of quickly accessible object mapping
        const teamsObj: {
          [teamId: string]: Team;
        } = {};
        teams.forEach((team) => {
          teamsObj[team.id] = team;
        });

        // maintain a list of quickly accessible object mapping
        const dbTeamsObj: {
          [providerTeamId: string]: string;
        } = {};
        dbTeamRows.forEach((row) => {
          dbTeamsObj[row.providerTeamId] = row.id;
        });

        const eventTeams = [];
        const eventRounds = [];
        const scores = [];
        const gamesInsert = [];
        for await (const game of games) {
          const eventId: string = v4();
          const locationName: string =
            locations[game.facility_id]?.name || `Fallback name location - ${game.id}`;
          const homeTeamName: string =
            teamsObj[game.home_team_id]?.name || `Fallback name Home team - ${game.id}`;
          const awayTeamName: string =
            teamsObj[game.away_team_id]?.name || `Fallback name Awa Team - ${game.id}`;

          eventTeams.push(
            {
              eventId,
              teamId: dbTeamsObj[game.home_team_id],
              isHomeTeam: true,
              status: TeamStatus.ACTIVE,
            },
            {
              eventId,
              teamId: dbTeamsObj[game.away_team_id],
              isHomeTeam: false,
              status: TeamStatus.ACTIVE,
            },
          );

          const gameDay: Date = zonedTimeToUtc(game.datetime, game.time_zone);
          const gameStartTime: Date = game.started_at
            ? parse(game.started_at, "HH:mm", gameDay)
            : gameDay;
          const gameEndTime: Date = game.ended_at ? parse(game.ended_at, "HH:mm", gameDay) : null;
          const hasMatchEnded: boolean = game.status === "Final";

          let eventStatus: EventStatus = EventStatus.UPCOMING;
          if (game.status === "In Progress") eventStatus = EventStatus.LIVE;
          else if (hasMatchEnded) eventStatus = EventStatus.COMPLETED;

          const currentRound: string = game.clock.period;
          const currentRoundNo: number = MASLPeriods[currentRound];
          for await (const period of game.stats.periods) {
            // doing this because OT1 is only sent when the game is live and not sent in historical data
            // so to keep it consisten
            let parsedPeriod: string = period;
            if (["OT1", "OT2"].includes(parsedPeriod)) parsedPeriod = "OT";

            let round;
            if (!roundsObj[parsedPeriod]) {
              // create a new period in the db and store
              round = {
                id: v4(),
                name: parsedPeriod,
                roundNo: Object.keys(roundsObj).length + 1,
              };
              await knex("rounds").transacting(trx).withSchema(SportsDbSchema.MASL).insert(round);
              roundsObj[parsedPeriod] = round;
            } else {
              round = roundsObj[parsedPeriod];
            }

            let roundStatus: RoundStatus = RoundStatus.UPCOMING;
            if (round.roundNo === currentRoundNo) roundStatus = RoundStatus.LIVE;
            else if (round.roundNo < currentRoundNo) roundStatus = RoundStatus.COMPLETED;
            eventRounds.push({
              eventId,
              roundId: round.id,
              startDate: gameStartTime,
              endDate: hasMatchEnded ? gameEndTime : null,
              roundStatus,
            });

            scores.push(
              {
                teamId: dbTeamsObj[game.home_team_id],
                eventId,
                roundId: round.id,
                goals: game.stats.home_goals_by_period[parsedPeriod],
                isHomeTeam: true,
              },
              {
                teamId: dbTeamsObj[game.away_team_id],
                eventId,
                roundId: round.id,
                goals: game.stats.away_goals_by_period[parsedPeriod],
                isHomeTeam: false,
              },
            );
          }

          gamesInsert.push({
            id: eventId,
            leagueYearId: dbLeagueYearId,
            name: `${homeTeamName} vs ${awayTeamName}`,
            startDate: gameStartTime,
            endDate: hasMatchEnded ? gameEndTime : null,
            eventStatus,
            eventLocation: locationName,
            eventLocationGroup: locationName,
            isEventWinnerMarketOpen: false,
            providerGameId: game.id,
            providerLastUpdated: game.updated_at,
          });
        }

        await knex("events").transacting(trx).withSchema(SportsDbSchema.MASL).insert(gamesInsert);
        await knex("eventTeams")
          .transacting(trx)
          .withSchema(SportsDbSchema.MASL)
          .insert(eventTeams);
        await knex("eventRounds")
          .transacting(trx)
          .withSchema(SportsDbSchema.MASL)
          .insert(eventRounds);
        // console.log("scores", scores[2]);
        await knex("scores").transacting(trx).withSchema(SportsDbSchema.MASL).insert(scores);
      }

      // throw new Error("asd");

      /* const fetchLeagueUrl = `${baseUrl}/leagues?ticket=${ticket}`;
      const fetchLeagueResponse: any = await got(fetchLeagueUrl).json();
      const roundsDbData = [];
      const eventStatuses = [];
      for (const league of fetchLeagueResponse.leagues) {
        const fetchSeasonUrl = `${baseUrl}/league/${league.id}/seasons?ticket=${ticket}`;
        const fetchSeasonResponse: any = await got(fetchSeasonUrl).json();
        const leagueDb: any = await knex("leagues")
          .transacting(trx)
          .withSchema(SportsDbSchema.MASL)
          .insert(
            {
              name: league.name,
              gender: "men",
            },
            ["id"],
          );

        for (const season of fetchSeasonResponse.seasons) {
          const leagueYearDb: any = await knex("leagueYears")
            .transacting(trx)
            .withSchema(SportsDbSchema.MASL)
            .insert(
              {
                leagueId: leagueDb[0].id,
                year: season.start_date.split("-")[0],
              },
              ["id"],
            );

          const fetchTeamUrl = `${baseUrl}/season/${season.id}/teams?ticket=${ticket}`;
          const fetchGamesUrl = `${baseUrl}/season/${season.id}/games?ticket=${ticket}`;

          const [fetchTeamResponse, fetchGamesResponse]: any = await Promise.all([
            got(fetchTeamUrl).json(),
            got(fetchGamesUrl).json(),
          ]);

          const teamsArray = uniq(fetchTeamResponse.teams, "name");

          const teamsData = teamsArray.map((team) => ({
            name: team.name,
            shortName: team.short_name,
            logo: team.logo_url.full,
            city: team.city,
          }));

          await knex("teams")
            .transacting(trx)
            .withSchema(SportsDbSchema.MASL)
            .insert(teamsData)
            .onConflict("name")
            .ignore();

          for (const game of fetchGamesResponse.games) {
            const facilityArr = fetchGamesResponse.references.facility;

            const facilityName =
              facilityArr[facilityArr.indexOf(facilityArr.find((x) => x.id === game.facility_id))]
                .city;

            const homeTeamName =
              teamsArray[teamsArray.indexOf(teamsArray.find((x) => x.id === game.home_team_id))]
                .name;
            const awayTeamName =
              teamsArray[teamsArray.indexOf(teamsArray.find((x) => x.id === game.away_team_id))]
                .name;

            let eventGameStatus =
              eventStatuses[
                eventStatuses.indexOf(eventStatuses.find((x) => x.status === game.status))
              ]?.value;

            if (!eventGameStatus) {
              eventGameStatus = eventStatuses.length + 1 || 1;

              eventStatuses.push({ value: eventStatuses.length + 1 || 1, status: game.status });
            }

            const eventDb: any = await knex("events")
              .transacting(trx)
              .withSchema(SportsDbSchema.MASL)
              .insert(
                {
                  leagueYearId: leagueYearDb[0].id,
                  name: `${homeTeamName} vs ${awayTeamName}`,
                  startDate: new Date(game.datetime).toISOString(),
                  endDate: new Date(game.datetime).toISOString(),
                  eventStatus: eventGameStatus,
                  eventLocation: facilityName,
                  eventLocationGroup: facilityName,
                  isEventWinnerMarketOpen: false,
                },
                ["id"],
              );

            const [homeTeam, awayTeam]: any = await Promise.all([
              knex("teams")
                .transacting(trx)
                .withSchema(SportsDbSchema.MASL)
                .where("name", homeTeamName),
              knex("teams")
                .transacting(trx)
                .withSchema(SportsDbSchema.MASL)
                .where("name", awayTeamName),
            ]);

            await knex("eventTeams")
              .transacting(trx)
              .withSchema(SportsDbSchema.MASL)
              .insert([
                {
                  eventId: eventDb[0].id,
                  teamId: homeTeam[0].id,
                  status: eventGameStatus,
                },
                {
                  eventId: eventDb[0].id,
                  teamId: awayTeam[0].id,
                  status: eventGameStatus,
                },
              ]);

            for (const period of game.stats.periods) {
              let roundId =
                roundsDbData[roundsDbData.indexOf(roundsDbData.find((x) => x.name === period))]?.id;
              if (!roundId) {
                const roundDb: any = await knex("rounds")
                  .transacting(trx)
                  .withSchema(SportsDbSchema.MASL)
                  .insert(
                    {
                      name: period,
                      roundNo: roundsDbData?.length + 1 || 1,
                    },
                    ["id"],
                  );

                roundId = roundDb[0].id;
                roundsDbData.push({ id: roundId, name: period });
              }

              await Promise.all([
                knex("eventRounds")
                  .transacting(trx)
                  .withSchema(SportsDbSchema.MASL)
                  .insert({
                    eventId: eventDb[0].id,
                    roundId,
                    startDate: new Date(game.datetime).toISOString(),
                    endDate: new Date(game.datetime).toISOString(),
                    roundStatus: eventGameStatus,
                  }),
                knex("scores")
                  .transacting(trx)
                  .withSchema(SportsDbSchema.MASL)
                  .insert([
                    {
                      teamId: homeTeam[0].id,
                      eventId: eventDb[0].id,
                      roundId,
                      goals: game.stats.home_goals_by_period[period],
                    },
                    {
                      teamId: awayTeam[0].id,
                      eventId: eventDb[0].id,
                      roundId,
                      goals: game.stats.away_goals_by_period[period],
                    },
                  ]),
              ]);
            }
          }
        }
      } */
      await trx.commit();

      return true;
    } catch (error) {
      console.error(error);
      await trx.rollback();
      throw error;
    }
  });
}

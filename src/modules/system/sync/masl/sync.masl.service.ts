import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, EntityManager, In, Between, Not, IsNull } from "typeorm";
import { v4 } from "uuid";
import { isBefore, addDays, subDays, parse, subSeconds, parseISO } from "date-fns";

import Events from "../../../../entities/masl/events.entity";
import Leagues from "../../../../entities/masl/leagues.entity";
import LeagueYears from "../../../../entities/masl/leagueYears.entity";
import Rounds from "../../../../entities/masl/rounds.entity";
import Teams from "../../../../entities/masl/teams.entity";
import EventTeams from "../../../../entities/masl/eventTeams.entity";
import EventRounds from "../../../../entities/masl/eventRounds.entity";
import Scores from "../../../../entities/masl/scores.entity";

import { Facility, GameSummary } from "../../../../interfaces/masl/games";
import { Team as TeamType } from "../../../../interfaces/masl/teams";
import LeaguesType from "../../../../interfaces/masl/leagues";
import SeasonsType from "../../../../interfaces/masl/seasons";

import MaslService from "../../../../services/masl.service";
import SlackbotService from "../../../../services/slackbot.service";

import { EventStatus, RoundStatus, MASLPeriods, SportsTypes } from "../../../../constants/system";
import { TeamStatus } from "../../../../constants/events";

@Injectable()
export default class SyncMaslService {
  constructor(
    @InjectRepository(Events) private readonly eventsRepository: Repository<Events>,
    @InjectRepository(EventTeams) private readonly eventTeamsRepository: Repository<EventTeams>,
    @InjectRepository(EventRounds) private readonly eventRoundsRepository: Repository<EventRounds>,
    @InjectRepository(Scores) private readonly scoresRepository: Repository<Scores>,
    private readonly maslService: MaslService,
    private readonly slackbotService: SlackbotService,
  ) {}

  async syncScheduledEvents(): Promise<boolean> {
    await this.eventsRepository.manager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        try {
          const rounds = await transactionalEntityManager.find(Rounds, {
            select: {
              id: true,
              name: true,
              roundNo: true,
            },
          });

          const existingRounds: {
            [key: string]: Partial<Rounds>;
          } = {};
          rounds.forEach((round) => {
            existingRounds[round.name] = round;
          });

          // **** Create new Events *****
          const leagueData: LeaguesType = await this.maslService.getLeagues();

          // for now only limiting to MASL
          const league = leagueData?.leagues.find(
            (item) => item.name === "Major Arena Soccer League",
          );
          if (!league) return;

          let leagueId: string = v4();
          const leagueDb = await transactionalEntityManager.findOne(Leagues, {
            where: {
              name: league.name,
              gender: "men",
            },
            select: {
              id: true,
            },
          });
          if (!leagueDb) {
            await transactionalEntityManager.insert(Leagues, {
              id: leagueId,
              name: league.name,
              gender: "men",
              providerLastUpdated: league.updated_at,
            });
          } else leagueId = leagueDb.id;

          const seasonData: SeasonsType = await this.maslService.getSeason(league.id);

          const applicableSeasons: string[] = ["2023-2024"];
          const parseableSeasons = seasonData.seasons.filter((row) =>
            applicableSeasons.includes(row.name),
          );

          for await (const season of parseableSeasons) {
            const nameSplit: string[] = season.name.split("-");
            const year: number = nameSplit.length > 1 ? +nameSplit[1] : +nameSplit[0];

            let dbLeagueYearId: string = v4();
            // if the year already exists, no need to re-insert
            const leagueYearDb = await transactionalEntityManager.findOne(LeagueYears, {
              where: {
                leagueId,
                year,
              },
              select: {
                id: true,
                providerLastUpdated: true,
              },
            });
            if (!leagueYearDb) {
              await transactionalEntityManager.insert(LeagueYears, {
                id: dbLeagueYearId,
                leagueId,
                year,
                providerLastUpdated: season.updated_at,
              });
            } else dbLeagueYearId = leagueYearDb.id;

            // check to see if the provider has updated the data, otherwise no need to proceed
            const providerLastUpdated: Date = new Date(season.updated_at);
            const hasUpdated: boolean = leagueYearDb?.providerLastUpdated
              ? isBefore(new Date(leagueYearDb?.providerLastUpdated), providerLastUpdated)
              : true;
            if (!hasUpdated) {
              // no change, nothing to do
              continue;
            }

            const [teamsData, gamesData] = await Promise.all([
              this.maslService.getTeams(season.id),
              this.maslService.getGames(season.id),
            ]);

            const { games, references } = gamesData;

            const { teams } = teamsData;

            const teamIds: number[] = [];
            const insertTeams = teams.map((team) => {
              teamIds.push(team.id);

              return {
                providerTeamId: `${team.id}`,
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
            }[] = await transactionalEntityManager.find(Teams, {
              where: { providerTeamId: In(teamIds) },
              select: ["id", "providerTeamId", "name"],
            });

            const existingDbTeamProviderIds: string[] = existingDbTeamRows.map(
              (row) => row.providerTeamId,
            );
            const existingDbTeamProviderNames: string[] = existingDbTeamRows.map((row) => row.name);

            const toInsertTeams = insertTeams.filter(
              (row) =>
                !existingDbTeamProviderIds.includes(`${row.providerTeamId}`) &&
                !existingDbTeamProviderNames.includes(row.name),
            );

            if (toInsertTeams.length) await transactionalEntityManager.insert(Teams, toInsertTeams);

            const locations: {
              [locationId: string]: Facility;
            } = {};
            references.facility.forEach((facility) => {
              locations[facility.id] = facility;
            });

            const dbTeamRows = await transactionalEntityManager.find(Teams, {
              where: { providerTeamId: In(teamIds) },
            });

            const teamsObj: {
              [teamId: string]: TeamType;
            } = {};
            teams.forEach((team) => {
              teamsObj[team.id] = team;
            });

            const dbTeamsObj: {
              [providerTeamId: string]: string;
            } = {};
            dbTeamRows.forEach((row) => {
              dbTeamsObj[row.providerTeamId] = row.id;
            });

            const eventsPayload: Events[] = [];
            const eventTeamsPayload: EventTeams[] = [];
            const eventRoundsPayload: EventRounds[] = [];
            const scoresPayload: Scores[] = [];
            for await (const game of games) {
              const eventId: string = v4();
              const locationName: string =
                locations[game.facility_id]?.name || `Fallback name location - ${game.id}`;
              const homeTeamName: string =
                teamsObj[game.home_team_id]?.name || `Fallback name Home team - ${game.id}`;
              const awayTeamName: string =
                teamsObj[game.away_team_id]?.name || `Fallback name Awa Team - ${game.id}`;

              const existingEvent = await transactionalEntityManager.findOne(Events, {
                where: {
                  providerGameId: `${game.id}`,
                },
              });
              const gameDay: Date = parseISO(game.datetime_tz);
              const gameStartTime: Date = game.started_at
                ? parse(game.started_at, "HH:mm", gameDay)
                : gameDay;
              const gameEndTime: Date = game.ended_at
                ? parse(game.ended_at, "HH:mm", gameDay)
                : null;
              const hasMatchEnded: boolean = game.status === "Final";
              let eventStatus: EventStatus = EventStatus.UPCOMING;
              if (game.status === "In Progress") eventStatus = EventStatus.LIVE;
              else if (hasMatchEnded) eventStatus = EventStatus.COMPLETED;

              if (existingEvent) {
                // if existing event that is upcoming then update and move on
                const updateEventObj: Partial<Events> = {
                  startDate: gameStartTime,
                  providerLastUpdated: game.updated_at,
                  endDate: hasMatchEnded ? gameEndTime : null,
                  eventStatus,
                };

                if ([EventStatus.UPCOMING, EventStatus.NEXT].includes(existingEvent.eventStatus))
                  await transactionalEntityManager.update(
                    Events,
                    {
                      id: existingEvent.id,
                    },
                    updateEventObj,
                  );

                continue;
              }

              eventsPayload.push(
                this.eventsRepository.create({
                  id: eventId,
                  leagueYearId: leagueYearDb?.id || dbLeagueYearId,
                  name: `${homeTeamName} vs ${awayTeamName}`,
                  startDate: gameStartTime,
                  endDate: hasMatchEnded ? gameEndTime : null,
                  eventStatus,
                  eventLocation: locationName,
                  eventLocationGroup: locationName,
                  isEventWinnerMarketOpen: false,
                  providerGameId: `${game.id}`,
                  providerLastUpdated: game.updated_at,
                }),
              );

              eventTeamsPayload.push(
                this.eventTeamsRepository.create({
                  eventId,
                  teamId: dbTeamsObj[game.home_team_id],
                  isHomeTeam: true,
                  status: TeamStatus.ACTIVE,
                }),
                this.eventTeamsRepository.create({
                  eventId,
                  teamId: dbTeamsObj[game.away_team_id],
                  isHomeTeam: false,
                  status: TeamStatus.ACTIVE,
                }),
              );

              const currentRound: string = game.clock.period;
              const currentRoundNo: number = MASLPeriods[currentRound];
              for await (const period of game.stats.periods) {
                let round: Partial<Rounds>;

                // doing this because OT1 is only sent when the game is live and not sent in historical data
                // so to keep it consisten
                let parsedPeriod: string = period;
                if (["OT1", "OT2"].includes(parsedPeriod)) parsedPeriod = "OT";

                // check to see if the round already exists, if not then insert it
                if (!existingRounds[parsedPeriod]) {
                  round = {
                    id: v4(),
                    name: `${parsedPeriod}`,
                    roundNo: rounds.length + 1,
                  };
                  await transactionalEntityManager.insert(Rounds, round);
                  existingRounds[parsedPeriod] = round;
                } else round = existingRounds[parsedPeriod];

                let roundStatus: RoundStatus = RoundStatus.UPCOMING;
                if (round.roundNo === currentRoundNo) roundStatus = RoundStatus.LIVE;
                else if (round.roundNo < currentRoundNo) roundStatus = RoundStatus.COMPLETED;

                eventRoundsPayload.push(
                  this.eventRoundsRepository.create({
                    eventId,
                    roundId: round.id,
                    startDate: null,
                    endDate: hasMatchEnded ? gameEndTime : null,
                    roundStatus,
                  }),
                );

                scoresPayload.push(
                  this.scoresRepository.create({
                    teamId: dbTeamsObj[game.home_team_id],
                    eventId,
                    roundId: round.id,
                    goals: game.stats.home_goals_by_period[`${parsedPeriod}`],
                    isHomeTeam: true,
                  }),
                  this.scoresRepository.create({
                    teamId: dbTeamsObj[game.away_team_id],
                    eventId,
                    roundId: round.id,
                    goals: game.stats.home_goals_by_period[`${parsedPeriod}`],
                    isHomeTeam: false,
                  }),
                );
              }
            }

            if (eventsPayload.length)
              await transactionalEntityManager.insert(Events, eventsPayload);
            if (eventRoundsPayload.length)
              await transactionalEntityManager.insert(EventRounds, eventRoundsPayload);
            if (eventTeamsPayload.length)
              await transactionalEntityManager.insert(EventTeams, eventTeamsPayload);
            if (scoresPayload.length)
              await transactionalEntityManager.insert(Scores, scoresPayload);
          }
          // **** Create new Events *****

          return true;
        } catch (error) {
          throw error;
        }
      },
    );

    return true;
  }

  async setRoundCompleted(
    transactionalEntityManager: EntityManager,
    eventId: string,
    roundId: string,
    clockTime: number,
  ): Promise<true> {
    await transactionalEntityManager.update(
      EventRounds,
      {
        eventId,
        roundId,
        roundStatus: RoundStatus.LIVE,
      },
      {
        endDate: subSeconds(new Date(), clockTime).toISOString(),
        roundStatus: RoundStatus.COMPLETED,
      },
    );

    return true;
  }

  async setRoundLive(
    transactionalEntityManager: EntityManager,
    eventId: string,
    roundId: string,
    clockTime: number,
  ): Promise<boolean> {
    await transactionalEntityManager.update(
      EventRounds,
      {
        eventId,
        roundId,
        roundStatus: RoundStatus.UPCOMING,
      },
      {
        startDate: subSeconds(new Date(), clockTime).toISOString(),
        endDate: null,
        roundStatus: RoundStatus.LIVE,
      },
    );

    return true;
  }

  async setRoundStartEndTime(
    transactionalEntityManager: EntityManager,
    event: Events,
    gameData: GameSummary,
    existingRounds: {
      [key: string]: Partial<Rounds>;
    },
    currentRound: string,
  ): Promise<boolean> {
    const clockTime: number = +gameData.summary.clock.time;

    if (clockTime <= 0) return false;

    switch (currentRound) {
      case "1": {
        await Promise.all([
          transactionalEntityManager.update(
            Events,
            {
              id: event.id,
            },
            {
              startDate: subSeconds(new Date(), clockTime).toISOString(),
            },
          ),

          this.setRoundLive(
            transactionalEntityManager,
            event.id,
            existingRounds[currentRound].id,
            clockTime,
          ),
        ]);

        break;
      }

      case "2": {
        await Promise.all([
          this.setRoundCompleted(
            transactionalEntityManager,
            event.id,
            existingRounds["1"].id,
            clockTime,
          ),

          this.setRoundLive(
            transactionalEntityManager,
            event.id,
            existingRounds[currentRound].id,
            clockTime,
          ),
        ]);

        break;
      }

      case "3": {
        await Promise.all([
          this.setRoundCompleted(
            transactionalEntityManager,
            event.id,
            existingRounds["2"].id,
            clockTime,
          ),

          this.setRoundLive(
            transactionalEntityManager,
            event.id,
            existingRounds[currentRound].id,
            clockTime,
          ),
        ]);

        break;
      }

      case "4": {
        if (gameData.summary.status === "In Progress") {
          await Promise.all([
            this.setRoundCompleted(
              transactionalEntityManager,
              event.id,
              existingRounds["3"].id,
              clockTime,
            ),

            this.setRoundLive(
              transactionalEntityManager,
              event.id,
              existingRounds[currentRound].id,
              clockTime,
            ),
          ]);
        } else if (gameData.summary.status === "Final") {
          await this.setRoundCompleted(
            transactionalEntityManager,
            event.id,
            existingRounds[currentRound].id,
            clockTime,
          );
        }

        /* if (gameData.summary.status === "Final") {
          const alreadySet = await transactionalEntityManager.findOne(EventRounds, {
            where: {
              endDate: Not(IsNull()),
              roundStatus: RoundStatus.COMPLETED,
              eventId: event.id,
              roundId: existingRounds[currentRound].id,
              isActive: true,
              isArchived: false,
            },
          });

          if (!alreadySet) {
            await this.setRoundCompleted(
              transactionalEntityManager,
              event.id,
              existingRounds[currentRound].id,
              clockTime,
            );
          }
        } */

        break;
      }

      case "OT":
        if (gameData.summary.status === "In Progress") {
          await Promise.all([
            this.setRoundCompleted(
              transactionalEntityManager,
              event.id,
              existingRounds["4"].id,
              clockTime,
            ),

            this.setRoundLive(
              transactionalEntityManager,
              event.id,
              existingRounds[currentRound].id,
              clockTime,
            ),
          ]);
        } else if (gameData.summary.status === "Final") {
          //To handle situation when OT completes between sync calls
          await Promise.all([
            this.setRoundCompleted(
              transactionalEntityManager,
              event.id,
              existingRounds["4"].id,
              clockTime,
            ),
            this.setRoundLive(
              transactionalEntityManager,
              event.id,
              existingRounds[currentRound].id,
              clockTime,
            ),
          ]);

          await this.setRoundCompleted(
            transactionalEntityManager,
            event.id,
            existingRounds[currentRound].id,
            clockTime,
          );
        }

        /* if (gameData.summary.status === "Final") {
          const alreadySet = await transactionalEntityManager.findOne(EventRounds, {
            where: {
              endDate: Not(IsNull()),
              roundStatus: RoundStatus.COMPLETED,
              eventId: event.id,
              roundId: existingRounds[currentRound].id,
              isActive: true,
              isArchived: false,
            },
          });

          if (!alreadySet) {
            await this.setRoundCompleted(
              transactionalEntityManager,
              event.id,
              existingRounds[currentRound].id,
              clockTime,
            );
          }
        } */

        break;

      case "SO": {
        if (gameData.summary.status === "In Progress") {
          await Promise.all([
            this.setRoundCompleted(
              transactionalEntityManager,
              event.id,
              existingRounds.OT.id,
              clockTime,
            ),

            this.setRoundLive(
              transactionalEntityManager,
              event.id,
              existingRounds[currentRound].id,
              clockTime,
            ),
          ]);
        } else if (gameData.summary.status === "Final") {
          await Promise.all([
            this.setRoundCompleted(
              transactionalEntityManager,
              event.id,
              existingRounds.OT.id,
              clockTime,
            ),
            this.setRoundLive(
              transactionalEntityManager,
              event.id,
              existingRounds[currentRound].id,
              clockTime,
            ),
          ]);

          await this.setRoundCompleted(
            transactionalEntityManager,
            event.id,
            existingRounds[currentRound].id,
            clockTime,
          );
        }

        /* if (gameData.summary.status === "Final") {
          const alreadySet = await transactionalEntityManager.findOne(EventRounds, {
            where: {
              endDate: Not(IsNull()),
              roundStatus: RoundStatus.COMPLETED,
              eventId: event.id,
              roundId: existingRounds[currentRound].id,
              isActive: true,
              isArchived: false,
            },
          });

          if (!alreadySet) {
            await this.setRoundCompleted(
              transactionalEntityManager,
              event.id,
              existingRounds[currentRound].id,
              clockTime,
            );
          }
        } */

        break;
      }
    }

    return true;
  }

  async syncLiveEvents(): Promise<boolean> {
    await this.eventsRepository.manager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        try {
          const now: Date = new Date();
          const startDate: Date = subDays(now, 2);
          const endDate: Date = addDays(now, 2);

          // only need to fetch events that are live or upcoming to update scores
          // added a range just to account for the timezone
          const events = await transactionalEntityManager.find(Events, {
            relations: ["teams"],
            where: {
              eventStatus: In([EventStatus.LIVE, EventStatus.UPCOMING, EventStatus.NEXT]),
              startDate: Between(startDate, endDate),
            },
            select: {
              id: true,
              providerGameId: true,
              providerLastUpdated: true,
              teams: {
                id: true,
                teamId: true,
                isHomeTeam: true,
              },
            },
          });

          const rounds = await transactionalEntityManager.find(Rounds, {
            select: {
              id: true,
              name: true,
              roundNo: true,
            },
          });

          const existingRounds: {
            [key: string]: Partial<Rounds>;
          } = {};
          rounds.forEach((round) => {
            existingRounds[round.name] = round;
          });

          for await (const event of events) {
            const gameData: GameSummary = await this.maslService.getGameSummary(
              event.providerGameId,
            );

            // check to see if the provider has updated the data, otherwise no need to proceed
            const providerLastUpdated: Date = new Date(gameData.summary.updated_at);

            const hasUpdated: boolean = event.providerLastUpdated
              ? isBefore(new Date(event.providerLastUpdated), providerLastUpdated)
              : true;

            /* if (event.eventStatus === EventStatus.LIVE) {
              const log = {
                id: gameData.summary.id,
                dateTime: gameData.summary.datetime,
                timezone: gameData.summary.datetime_tz,
                status: gameData.summary.status,
                clockPeriod: gameData.summary.clock?.period,
                clockTime: gameData.summary.clock?.time,
                clockRunning: gameData.summary.clock?.running,
                hasUpdated,
              };

              // eslint-disable-next-line no-console
              console.log(`MASL ==> ${JSON.stringify(log)}`);
            } */

            if (!hasUpdated) {
              // no change, nothing to do
              continue;
            }

            // tz time here is the UTC time
            const gameDay: Date = parseISO(gameData.summary.datetime_tz);
            const gameStartTime: Date = gameData.summary.started_at
              ? parse(gameData.summary.started_at, "HH:mm", gameDay)
              : gameDay;
            const gameEndTime: Date = gameData.summary.ended_at
              ? parse(gameData.summary.ended_at, "HH:mm", gameDay)
              : null;

            const hasMatchEnded: boolean = gameData.summary.status === "Final";

            let eventStatus: EventStatus = EventStatus.UPCOMING;
            if (gameData.summary.status === "In Progress") eventStatus = EventStatus.LIVE;
            else if (hasMatchEnded) eventStatus = EventStatus.COMPLETED;

            const updateEventObj: Partial<Events> = {
              startDate: gameStartTime,
              providerLastUpdated: gameData.summary.updated_at,
              endDate: hasMatchEnded ? gameEndTime : null,
              eventStatus,
            };
            //If event endDate is null for completed event, set current time
            if (hasMatchEnded && !event.endDate && !gameEndTime) {
              updateEventObj.endDate = gameEndTime;
            }

            //do not update startDate if live, use round 1 start time
            if (eventStatus === EventStatus.LIVE && !gameData.summary.started_at) {
              delete updateEventObj.startDate;
            }

            await transactionalEntityManager.update(
              Events,
              {
                id: event.id,
              },
              updateEventObj,
            );

            const homeTeam = event.teams.find((team) => team.isHomeTeam === true);
            const awayTeam = event.teams.find((team) => team.isHomeTeam === false);

            let currentRound: string = gameData.summary.clock.period;
            if (["OT1", "OT2"].includes(currentRound)) currentRound = "OT";
            const currentRoundNo: number = MASLPeriods[currentRound];
            for await (const period of gameData.summary.periods) {
              let round: Partial<Rounds>;

              // doing this because OT1 is only sent when the game is live and not sent in historical data
              // so to keep it consisten
              let parsedPeriod: string = period;
              if (["OT1", "OT2"].includes(parsedPeriod)) parsedPeriod = "OT";

              // check to see if the round already exists, if not then insert it
              let eventRound: EventRounds;
              if (!existingRounds[parsedPeriod]) {
                round = {
                  id: v4(),
                  name: `${parsedPeriod}`,
                  roundNo: rounds.length + 1,
                };
                await transactionalEntityManager.insert(Rounds, round);
                // update the object since the same one is used later
                existingRounds[parsedPeriod] = round;
              } else {
                round = existingRounds[parsedPeriod];

                eventRound = await transactionalEntityManager.findOne(EventRounds, {
                  where: {
                    eventId: event.id,
                    roundId: round.id,
                    isActive: true,
                    isArchived: false,
                  },
                  select: {
                    id: true,
                  },
                });
              }

              if (!eventRound) {
                let roundStatus: RoundStatus = RoundStatus.UPCOMING;
                if (round.roundNo === currentRoundNo) roundStatus = RoundStatus.LIVE;
                else if (round.roundNo < currentRoundNo) roundStatus = RoundStatus.COMPLETED;

                await transactionalEntityManager.insert(EventRounds, {
                  eventId: event.id,
                  roundId: round.id,
                  startDate:
                    roundStatus === RoundStatus.UPCOMING
                      ? null
                      : subSeconds(new Date(), +gameData.summary.clock.time).toISOString(),
                  endDate: hasMatchEnded ? gameEndTime : null,
                  roundStatus,
                });
              }

              await Promise.all([
                // for each period get the equivalent score and update
                transactionalEntityManager.upsert(
                  Scores,
                  [
                    {
                      teamId: homeTeam.teamId,
                      eventId: event.id,
                      roundId: round.id,
                      goals: gameData.summary.stats.home_goals_by_period[`${parsedPeriod}`] || 0,
                      isHomeTeam: true,
                    },
                    {
                      teamId: awayTeam.teamId,
                      eventId: event.id,
                      roundId: round.id,
                      goals: gameData.summary.stats.away_goals_by_period[`${parsedPeriod}`] || 0,
                      isHomeTeam: false,
                    },
                  ],
                  {
                    conflictPaths: ["eventId", "teamId", "roundId"],
                  },
                ),
              ]);
            }

            await this.setRoundStartEndTime(
              transactionalEntityManager,
              event,
              gameData,
              existingRounds,
              currentRound,
            );

            // notify slackbot
            // fetch out the rounds for the event where slack bot has not notified the state and the quarter has ended
            const updatedEventRounds = await transactionalEntityManager.find(EventRounds, {
              relations: {
                round: {
                  scores: {
                    team: true,
                  },
                },
              },
              where: {
                eventId: event.id,
                isSlackbotResultNotified: false,
                endDate: Not(IsNull()),
                round: {
                  scores: {
                    eventId: event.id,
                  },
                },
              },
              select: {
                id: true,
                eventId: true,
                startDate: true,
                endDate: true,
                roundStatus: true,
                isSlackbotResultNotified: true,
                round: {
                  id: true,
                  name: true,
                  roundNo: true,
                  scores: {
                    id: true,
                    eventId: true,
                    goals: true,
                    teamId: true,
                    team: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
              order: {
                round: {
                  roundNo: "ASC",
                },
              },
            });

            if (updatedEventRounds?.length) {
              try {
                await Promise.all(
                  updatedEventRounds.map((eventRound) =>
                    this.slackbotService.publishResultsNotification(
                      {
                        eventName: `${gameData?.summary?.away_team?.name} at ${gameData?.summary?.home_team?.name}`,
                        tourName: gameData?.summary?.league?.name,
                        startTime: eventRound?.startDate?.toISOString() || "",
                        endTime: eventRound?.endDate?.toISOString() || "",
                        eventStatus,
                        round: {
                          name: eventRound?.round?.name,
                        },
                        results: eventRound.round.scores.map((scoreItem) => ({
                          name: scoreItem?.team?.name,
                          score: `${scoreItem.goals}`,
                        })),
                      },
                      SportsTypes.MASL,
                    ),
                  ),
                );
              } catch (ignoredCatch) {
                console.error("MASL BOT ERROR", ignoredCatch);
              }

              // update the state since it has been notified
              await transactionalEntityManager.update(
                EventRounds,
                {
                  id: In(updatedEventRounds.map((eventRound) => eventRound.id)),
                },
                {
                  isSlackbotResultNotified: true,
                },
              );
            }

            const updatedEvent = await transactionalEntityManager.findOne(Events, {
              where: {
                id: event.id,
              },
              select: {
                id: true,
                startDate: true,
                endDate: true,
                isSlackbotResultNotified: true,
              },
            });

            // eslint-disable-next-line no-console
            console.log(
              "MASL SLACKBOT",
              `id=${updatedEvent.id} isSlackbotResultNotified=${updatedEvent.isSlackbotResultNotified} gameStatus=${gameData.summary.status} eventStatus=${updatedEvent.eventStatus} game_data_home_score${gameData.summary.stats.home_score} game_data_away_score${gameData.summary.stats.away_score} game_data_clock${gameData.summary.clock.period}`,
            );

            if (
              !updatedEvent.isSlackbotResultNotified &&
              gameData.summary.status === "Final"
              // updatedEvent.eventStatus === EventStatus.COMPLETED
            ) {
              // event has ended, send a notification
              let title: string = "";
              if (gameData.summary.stats.home_score === gameData.summary.stats.away_score) {
                title = `${gameData.summary.away_team.name} (#) ties ${gameData.summary.home_team.name}`;
              } else {
                const winningTeam =
                  gameData.summary.stats.home_score > gameData.summary.stats.away_score
                    ? gameData.summary.home_team.name
                    : gameData.summary.away_team.name;

                const losingTeam =
                  gameData.summary.stats.home_score < gameData.summary.stats.away_score
                    ? gameData.summary.home_team.name
                    : gameData.summary.away_team.name;

                title = `${winningTeam} (${
                  gameData.summary.stats.home_score
                }) Defeats ${losingTeam} (${gameData.summary.stats.away_score}) in ${
                  gameData.summary.stats.overtime || gameData.summary.stats.shootout
                    ? "Overtime"
                    : "Regulation time"
                }`;
              }

              try {
                await this.slackbotService.publishResultsNotification(
                  {
                    title,
                    eventName: `${gameData.summary.away_team.name} at ${gameData.summary.home_team.name}`,
                    tourName: gameData.summary.league.name,
                    startTime: gameStartTime?.toISOString() || "",
                    endTime: gameEndTime?.toISOString() || "",
                    eventStatus,
                    round: {
                      name: gameData.summary.status,
                    },
                    results: [
                      {
                        name: gameData.summary.home_team.name,
                        score: `${gameData.summary.stats.home_score}`,
                      },
                      {
                        name: gameData.summary.away_team.name,
                        score: `${gameData.summary.stats.away_score}`,
                      },
                    ],
                  },
                  SportsTypes.MASL,
                );
              } catch (ignoredCatchError) {
                console.error("MASL BOT ERROR", ignoredCatchError);
              }

              // update the event level notification state
              await transactionalEntityManager.update(
                Events,
                {
                  id: updatedEvent.id,
                },
                {
                  isSlackbotResultNotified: true,
                },
              );
            }

            //Use to set Event Round completed
            // if (gameData.summary.status === "Final") {
            //   await transactionalEntityManager.update(
            //     EventRounds,
            //     {
            //       id: event.id,
            //       endDate: IsNull(),
            //     },
            //     {
            //       endDate: new Date().toISOString(),
            //       roundStatus: RoundStatus.COMPLETED,
            //     },
            //   );
            // }
          }

          return true;
        } catch (error) {
          throw error;
        }
      },
    );

    return true;
  }
}

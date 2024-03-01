import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, EntityManager } from "typeorm";

import Events from "../../../../entities/masl/events.entity";
import Rounds from "../../../../entities/masl/rounds.entity";
import EventRounds from "../../../../entities/masl/eventRounds.entity";
import EventTeams from "../../../../entities/masl/eventTeams.entity";
import Scores from "../../../../entities/masl/scores.entity";
import Odds from "../../../../entities/masl/odds.entity";

import TraderScoresDto from "./dto/traderScores.dto";
import { UpdateOddsDto } from "./dto/odds.dto";

import { RoundStatus, SportsDbSchema } from "../../../../constants/system";

@Injectable()
export default class TradersService {
  constructor(
    @InjectRepository(Events) private readonly eventsRepository: Repository<Events>,
    @InjectRepository(Rounds) private readonly roundsRepository: Repository<Rounds>,
    @InjectRepository(EventRounds) private readonly eventRoundsRepository: Repository<EventRounds>,
    @InjectRepository(EventTeams) private readonly eventTeamsRepository: Repository<EventTeams>,
    @InjectRepository(Odds) private readonly oddsRepository: Repository<Odds>,
  ) {}

  async getTheHeatScore(gameDateId: string): Promise<{
    rounds: Rounds[];
    events: Events[];
  }> {
    const gameRows = await this.eventsRepository
      .createQueryBuilder("events")
      .select(["events.id as id"])
      .where(`to_char(events."startDate", 'MM-DD-YYYY') = '${gameDateId}'`)
      .andWhere('events."isActive" = true')
      .andWhere('events."isArchived" = false')
      .getRawMany();

    const gameIds: string[] = gameRows.map((row) => row.id);
    if (!gameIds.length) return null;

    const rounds = await this.roundsRepository.find({
      select: {
        id: true,
        name: true,
        roundNo: true,
      },
    });

    const events = await Promise.all(
      gameIds.map((gameId) =>
        this.eventsRepository.findOne({
          // relations: ["leagueYear.league", "teams.team", "eventRounds.round.scores"],
          relations: ["teams.team", "rounds.round.scores", "leagueYear.league"],
          where: {
            id: gameId,
            teams: {
              eventId: gameId,
            },
            rounds: {
              eventId: gameId,
              round: {
                scores: {
                  eventId: gameId,
                },
              },
            },
          },
          select: {
            id: true, //event id
            providerGameId: true,
            name: true,
            startDate: true,
            endDate: true,
            // eventNumber:null, //needs to be defined
            // eventType:null,  //needs to be defined
            eventStatus: true,
            eventLocation: true,
            winnerTeamId: true,
            rounds: {
              id: true, //eventRoundId
              // providerId:null,  //needs to be defined
              // round: null, // needs to be defined
              startDate: true,
              endDate: true,
              roundStatus: true,
              round: {
                id: true,
                name: true,
                roundNo: true,
                scores: {
                  id: true,
                  goals: true,
                  teamId: true,
                },
              },
            },
            teams: {
              id: true,
              isHomeTeam: true,
              team: {
                id: true,
                name: true,
                logo: true,
                shortName: true,
              },
            },
            leagueYear: {
              year: true,
              league: {
                name: true,
              },
            },
          },
          order: {
            startDate: "ASC",
            rounds: {
              round: {
                roundNo: "ASC",
              },
            },
          },
        }),
      ),
    );

    return { rounds, events };
  }

  async fetchHeatScore(gameDateId: string): Promise<{
    rounds: Rounds[];
    events: Events[];
  }> {
    const gameRows = await this.eventsRepository
      .createQueryBuilder("events")
      .select(["events.id as id"])
      .where(`to_char(events."startDate", 'MM-DD-YYYY') = '${gameDateId}'`)
      .andWhere('events."isActive" = true')
      .andWhere('events."isArchived" = false')
      .getRawMany();

    const gameIds: string[] = gameRows.map((row) => row.id);
    if (!gameIds.length) return null;

    const rounds = await this.roundsRepository.find({
      select: {
        id: true,
        name: true,
        roundNo: true,
      },
    });

    const events = await Promise.all(
      gameIds.map((gameId) =>
        this.eventsRepository.findOne({
          // relations: ["leagueYear.league", "teams.team", "eventRounds.round.scores"],
          relations: ["teams.team", "eventRounds.round.scores", "leagueYear.league"],
          where: {
            id: gameId,
            teams: {
              eventId: gameId,
            },
            eventRounds: {
              eventId: gameId,
              round: {
                scores: {
                  eventId: gameId,
                },
              },
            },
          },
          select: {
            id: true,
            name: true,
            startDate: true,
            endDate: true,
            eventStatus: true,
            eventLocation: true,
            // leagueYear: {
            //   id: true,
            //   year: true,
            //   league: {
            //     id: true,
            //     name: true,
            //   },
            // },
            teams: {
              id: true,
              isHomeTeam: true,
              team: {
                id: true,
                name: true,
                logo: true,
                shortName: true,
              },
            },
            eventRounds: {
              id: true,
              startDate: true,
              endDate: true,
              roundStatus: true,
              round: {
                id: true,
                name: true,
                roundNo: true,
                scores: {
                  id: true,
                  goals: true,
                  teamId: true,
                },
              },
            },
            leagueYear: {
              year: true,
              league: {
                name: true,
              },
            },
          },
          order: {
            startDate: "ASC",
            eventRounds: {
              round: {
                roundNo: "ASC",
              },
            },
          },
        }),
      ),
    );

    return { rounds, events };
  }

  async saveEventDetails(payload: TraderScoresDto) {
    await this.eventsRepository.manager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        try {
          const promises = [];

          // fetch all event rounds for the game, this is done in order to upsert event rounds that do not exist
          const eventRounds = await this.eventRoundsRepository.find({
            where: {
              eventId: payload.eventId,
            },
            select: {
              id: true,
              roundId: true,
            },
          });

          const eventTeams = await this.eventTeamsRepository.find({
            where: {
              eventId: payload.eventId,
            },
            select: {
              teamId: true,
              isHomeTeam: true,
            },
          });

          if (payload.roundTimes?.length) {
            payload.roundTimes.forEach((row) => {
              let roundStatus: RoundStatus;

              if (row.startDate && row.endDate) roundStatus = RoundStatus.COMPLETED;
              else if (row.startDate && !row.endDate) roundStatus = RoundStatus.LIVE;
              else if (!row.startDate && !row.endDate) roundStatus = RoundStatus.UPCOMING;

              const eventRound: EventRounds = eventRounds.find(
                (eventRoundRow) => eventRoundRow.roundId === row.roundId,
              );

              if (eventRound)
                promises.push(
                  transactionalEntityManager.update(
                    EventRounds,
                    {
                      // eventId: payload.eventId,
                      // roundId: row.roundId,
                      id: eventRound.id,
                    },
                    {
                      startDate: row.startDate,
                      endDate: row.endDate,
                      roundStatus,
                    },
                  ),
                );
              else
                promises.push(
                  transactionalEntityManager.insert(EventRounds, {
                    eventId: payload.eventId,
                    roundId: row.roundId,
                    startDate: row.startDate,
                    endDate: row.endDate,
                    roundStatus,
                  }),
                );
            });
          }

          if (payload.goals?.length) {
            payload.goals.forEach((row) => {
              promises.push(
                transactionalEntityManager.upsert(
                  Scores,
                  {
                    id: row.id,
                    eventId: payload.eventId,
                    roundId: row.roundId,
                    teamId: row.teamId,
                    goals: row.goals,
                    isHomeTeam: eventTeams.some(
                      (itemRow) => itemRow.teamId === row.teamId && itemRow.isHomeTeam,
                    ),
                  },
                  {
                    conflictPaths: ["id"],
                  },
                ),
              );
            });
          }

          if (promises.length) await Promise.all(promises);
        } catch (error) {
          throw error;
        }
      },
    );

    return true;
  }

  public async fetchOdds(eventId: string): Promise<{ odds: Odds[]; eventRounds: EventRounds[] }> {
    const [oddsData, eventRounds] = await Promise.all([
      this.oddsRepository.find({
        where: {
          eventId,
        },
        select: {
          id: true,
          marketType: true,
          subMarketType: true,
          betType: true,
          eventId: true,
          eventRoundId: true,
          type: true,
          odds: true,
          probability: true,
          trueProbability: true,
          hasModifiedProbability: true,
          lean: true,
          playerLean: true,
          bias: true,
          max: true,
          calculatedValue: true,
          isMarketActive: true,
          isSubMarketLocked: true,
          createdAt: true,
          updatedAt: true,
          event: {
            id: true,
            providerGameId: true,
          },
          eventTeam: {
            id: true,
            isHomeTeam: true,

            team: {
              id: true,
              name: true,
              shortName: true,
            },
          },
        },
        relations: ["event", "eventTeam.team", "eventTeam", "eventTeam"],
        order: {
          updatedAt: "DESC",
        },
      }),
      this.eventRoundsRepository.find({
        where: {
          eventId,
        },
        relations: ["event"],
        select: {
          id: true,
          round: {
            id: true,
            name: true,
            roundNo: true,
          },
          event: {
            id: true,
            name: true,
          },
        },
      }),
    ]);

    return {
      odds: oddsData,
      eventRounds,
    };
  }

  async updateOdds(payload: UpdateOddsDto) {
    try {
      const savePayload = payload.items.map((item) =>
        this.oddsRepository.create({
          id: item.id,
          odds: item.odds,
          probability: item.probability,
          hasModifiedProbability: item.hasModifiedProbability,
          lean: item.lean,
          playerLean: item.playerLean,
          bias: item.bias,
          max: item.max,
          calculatedValue: item.calculatedValue,
          isMarketActive: item.isMarketActive,
          isSubMarketLocked: item.isSubMarketLocked,
        }),
      );
      if (savePayload.length) {
        // await this.oddsRepository.save(savePayload);

        /* Trying to emulate this bulk update so it updates in a single query instead of multiple
        
        UPDATE users AS u SET
          email = u2.email,
          first_name = u2.first_name,
          last_name = u2.last_name
        FROM (VALUES
          (1, '[email protected]', 'John', 'Doe'),
          (2, '[email protected]', 'Jane', 'Smith')
        ) AS u2(id, email, first_name, last_name)
        WHERE u2.id = u.id;

        */

        let query = `
          UPDATE ${SportsDbSchema.MASL}.odds AS u SET
            odds = c.odds,
            probability = c.probability,
            "hasModifiedProbability" = c."hasModifiedProbability",
            lean = c.lean,
            "playerLean" = c."playerLean",
            bias = c.bias,
            max = c.max,
            "calculatedValue" = c."calculatedValue",
            "isMarketActive" = c."isMarketActive",
            "isSubMarketLocked" = c."isSubMarketLocked"
          FROM (VALUES`;

        const formattedQuery = savePayload
          .map(
            (obj) =>
              `('${obj.id}', ${obj.odds}, ${obj.probability}, ${obj.hasModifiedProbability} , ${obj.lean}, ${obj.playerLean}, ${obj.bias}, ${obj.max}, ${obj.calculatedValue}, ${obj.isMarketActive}, ${obj.isSubMarketLocked})`,
          )
          .join(", ");

        query += formattedQuery;

        query += `
        ) AS c(
          id,
          odds,
          probability, 
          "hasModifiedProbability",
          lean,
          "playerLean",
          bias,
          max,
          "calculatedValue",
          "isMarketActive",
          "isSubMarketLocked"
          )
        WHERE CAST(c.id AS UUID) = u.id;`;

        await this.oddsRepository.query(query);
      }

      return true;
    } catch (error) {
      throw error;
    }
  }
}

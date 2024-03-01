import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import Events from "../../../../entities/masl/events.entity";
import Odds from "../../../../entities/masl/odds.entity";
import EventRounds from "../../../../entities/masl/eventRounds.entity";
import Rounds from "../../../../entities/masl/rounds.entity";

@Injectable()
export class OddsService {
  constructor(
    @InjectRepository(Events) private readonly eventsRepository: Repository<Events>,
    @InjectRepository(EventRounds) private readonly eventRoundsRepository: Repository<EventRounds>,
    @InjectRepository(Odds) private readonly oddsRepository: Repository<Odds>,
    @InjectRepository(Rounds) private readonly roundsRepository: Repository<Rounds>,
  ) {}

  public async fetchEventOdds(
    eventId: string,
  ): Promise<{ odds: Odds[]; eventRounds: EventRounds[] }> {
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
        relations: {
          event: true,
        },
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

  async fetchEvent(eventId: string): Promise<Events> {
    const event = await this.eventsRepository.findOne({
      where: {
        id: eventId,
        isActive: true,
        isArchived: false,
      },
      relations: {
        leagueYear: {
          league: true,
        },
      },
      select: {
        id: true,
        name: true,
        startDate: true,
        endDate: true,
        eventStatus: true,
        eventLocation: true,
        eventLocationGroup: true,
        leagueYear: {
          year: true,
          league: {
            id: true,
            name: true,
            gender: true,
          },
        },
      },
    });

    return event;
  }

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
}

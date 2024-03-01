import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import groupBy from "lodash.groupby";

import Event from "../../../../entities/ja/events.entity";
import EventTeams from "../../../../entities/ja/eventTeams.entity";
import Teams from "../../../../entities/ja/teams.entity";
import ClientOdds from "../../../../entities/ja/clientOdds.entity";
import Odds from "../../../../entities/ja/odds.entity";
import EventRounds from "../../../../entities/ja/eventRounds.entity";

import * as eventExceptions from "../../../../exceptions/events";

@Injectable()
export class OddsService {
  constructor(
    @InjectRepository(Event) private readonly eventRepository: Repository<Event>,
    @InjectRepository(EventRounds) private readonly eventRoundsRepository: Repository<EventRounds>,
    @InjectRepository(Odds) private readonly oddsRepository: Repository<Odds>,
    @InjectRepository(ClientOdds) private readonly clientOddsRepository: Repository<ClientOdds>,
  ) {}

  public async downloadEventOdds(eventId: string) {
    const event = await this.eventRepository.findOne({
      where: {
        id: eventId,
      },
      relations: ["tourYear.tour"],
      select: {
        id: true,
        name: true,
        eventNumber: true,
        startDate: true,
        endDate: true,
        eventLocation: true,
        eventLocationGroup: true,
        eventStatus: true,
        tourYear: {
          year: true,
          tour: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!event) throw eventExceptions.eventNotFound();

    let data: any = await this.clientOddsRepository
      .createQueryBuilder("clientOdds")
      .andWhere("clientOdds.eventId = :eventId", {
        eventId,
      })
      .leftJoinAndMapOne(
        "clientOdds.eventTeams",
        EventTeams,
        "eventTeams",
        "clientOdds.eventTeamId = eventTeams.id",
      )
      .leftJoinAndMapOne("eventTeams.teams", Teams, "teams", "eventTeams.teamId = teams.id")
      .select([
        "clientOdds.id",
        "clientOdds.odds",
        "clientOdds.trueProbability",
        "clientOdds.probability",
        "clientOdds.createdAt",
        "clientOdds.marketType",
        "clientOdds.subMarketType",
        "clientOdds.type",
        "clientOdds.hasModifiedProbability",
        "clientOdds.lean",
        "clientOdds.bias",
        "clientOdds.max",
        "clientOdds.holdingPercentage",
        "clientOdds.calculatedValue",
        "clientOdds.betType",
        "clientOdds.prop",
        "eventTeams.id",
        "eventTeams.isHomeTeam",
        "teams.id",
        "teams.name",
      ])
      .orderBy("clientOdds.createdAt", "DESC")
      .getMany();

    data = data.map((eventOdd) => {
      return {
        id: eventOdd.id,
        odds: eventOdd.odds,
        probability: eventOdd.probability,
        trueProbability: eventOdd.trueProbability,
        hasModifiedProbability: eventOdd.hasModifiedProbability,
        marketType: eventOdd.marketType,
        subMarketType: eventOdd.subMarketType,
        valueType: eventOdd.type,
        lean: eventOdd.lean,
        bias: eventOdd.bias,
        max: eventOdd.max,
        holdingPercentage: eventOdd.holdingPercentage,
        calculatedValue: eventOdd.calculatedValue,
        betType: eventOdd.betType,
        prop: eventOdd.prop,
        teamId: eventOdd.eventTeams.teams.id,
        teamName: eventOdd.eventTeams.teams.name,
        isHomeTeam: eventOdd.eventTeams.isHomeTeam,
        createdAt: eventOdd.createdAt,
      };
    });

    return {
      sport: "Jai Alai",
      tour: event?.tourYear?.tour?.name || null,
      year: event?.tourYear?.year || null,
      eventName: event.name,
      startDate: event.startDate,
      endDate: event.endDate,
      eventStatus: event.eventStatus,
      eventLocation: event.eventLocation,
      eventLocationGroup: event.eventLocationGroup,
      eventNumber: event.eventNumber,
      publishes: groupBy(data, (d) => new Date(d.createdAt).toISOString()),
    };
  }

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
          weights: true,
          max: true,
          calculatedValue: true,
          prop: true,
          isMarketActive: true,
          isSubMarketLocked: true,
          createdAt: true,
          updatedAt: true,
          event: {
            id: true,
            providerId: true,
            eventType: true,
          },
          eventTeam: {
            id: true,
            isHomeTeam: true,
            athlete1: {
              id: true,
              providerId: true,
              firstName: true,
            },
            athlete2: {
              id: true,
              providerId: true,
              firstName: true,
            },
            team: {
              id: true,
              name: true,
              shortName: true,
            },
          },
        },
        relations: ["event", "eventTeam.team", "eventTeam.athlete1", "eventTeam.athlete2"],
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
          providerId: true,
          round: true,
          event: {
            id: true,
            name: true,
            eventNumber: true,
          },
        },
      }),
    ]);

    return {
      odds: oddsData,

      eventRounds,
    };
  }

  async fetchEvent(eventId: string): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: {
        id: eventId,
        isActive: true,
        isArchived: false,
      },
      relations: ["tourYear.tour"],
      select: {
        id: true,
        name: true,
        startDate: true,
        endDate: true,
        eventStatus: true,
        eventLocation: true,
        eventLocationGroup: true,
        eventNumber: true,
        tourYear: {
          year: true,
          tour: {
            id: true,
            name: true,
            gender: true,
          },
        },
      },
    });

    return event;
  }

  async fetchHeatScore(gameDateId: string): Promise<{
    events: Event[];
  }> {
    const gameRows = await this.eventRepository
      .createQueryBuilder("events")
      .select(["events.id as id"])
      .where(`to_char(events."startDate", 'MM-DD-YYYY') = '${gameDateId}'`)
      .andWhere('events."isActive" = true')
      .andWhere('events."isArchived" = false')
      .getRawMany();

    const gameIds: string[] = gameRows.map((row) => row.id);
    if (!gameIds.length) return null;

    let events = await Promise.all(
      gameIds.map((gameId) =>
        this.eventRepository.findOne({
          relations: {
            tourYear: {
              tour: true,
            },
            teams: {
              team: true,
              athlete1: true,
              athlete2: true,
            },
            rounds: {
              scores: {
                eventRound: true,
              },
            },
          },
          where: {
            id: gameId,
            teams: {
              eventId: gameId,
            },
            rounds: {
              eventId: gameId,
            },
          },
          select: {
            id: true,
            providerId: true,
            name: true,
            startDate: true,
            endDate: true,
            eventNumber: true,
            eventType: true,
            eventStatus: true,
            eventLocation: true,
            winnerTeamId: true,
            rounds: {
              id: true,
              providerId: true,
              round: true,
              startDate: true,
              endDate: true,
              roundStatus: true,
              scores: {
                id: true,
                teamId: true,
                score: true,
                eventRound: {
                  id: true,
                  round: true,
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
              athlete1: {
                id: true,
                providerId: true,
                firstName: true,
              },
              athlete2: {
                id: true,
                providerId: true,
                firstName: true,
              },
            },
            tourYear: {
              year: true,
              tour: {
                name: true,
              },
            },
          },
          order: {
            startDate: "ASC",
            rounds: {
              round: "ASC",
            },
          },
        }),
      ),
    );

    let parsedEvents = events.filter((event) => event);

    if (!parsedEvents.length && gameIds.length) {
      events = await Promise.all(
        gameIds.map((gameId) =>
          this.eventRepository.findOne({
            relations: {
              tourYear: {
                tour: true,
              },
              teams: {
                team: true,
                athlete1: true,
                athlete2: true,
              },
            },
            where: {
              id: gameId,
              teams: {
                eventId: gameId,
              },
            },
            select: {
              id: true,
              providerId: true,
              name: true,
              startDate: true,
              endDate: true,
              eventNumber: true,
              eventType: true,
              eventStatus: true,
              eventLocation: true,
              winnerTeamId: true,
              teams: {
                id: true,
                isHomeTeam: true,
                team: {
                  id: true,
                  name: true,
                  logo: true,
                  shortName: true,
                },
                athlete1: {
                  id: true,
                  providerId: true,
                  firstName: true,
                },
                athlete2: {
                  id: true,
                  providerId: true,
                  firstName: true,
                },
              },
              tourYear: {
                year: true,
                tour: {
                  name: true,
                },
              },
            },
            order: {
              startDate: "ASC",
            },
          }),
        ),
      );

      parsedEvents = events.filter((event) => event);
    }

    return {
      events: parsedEvents.sort((a, b) => a.eventNumber - b.eventNumber),
    };
  }
}

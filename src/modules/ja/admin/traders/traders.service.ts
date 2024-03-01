import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, EntityManager } from "typeorm";
import { format } from "date-fns";
import { v4 } from "uuid";

import Events from "../../../../entities/ja/events.entity";
import Odds from "../../../../entities/ja/odds.entity";
import EventRounds from "../../../../entities/ja/eventRounds.entity";
import ClientOdds from "../../../../entities/ja/clientOdds.entity";

import { SportsDbSchema, OddMarkets } from "../../../../constants/system";

import { UpdateOddsDto } from "./dto/odds.dto";
import { JABetTypes, JAMarketTypes, JASubMarketTypes } from "../../../../constants/odds";

@Injectable()
export default class TradersService {
  constructor(
    @InjectRepository(Events) private readonly eventsRepository: Repository<Events>,
    @InjectRepository(EventRounds) private readonly eventRoundsRepository: Repository<EventRounds>,
    @InjectRepository(Odds) private readonly oddsRepository: Repository<Odds>,
    @InjectRepository(ClientOdds) private readonly clientOddsRepository: Repository<ClientOdds>,
  ) {}

  async fetchHeatScore(gameDateId: string): Promise<{
    //rounds: EventRounds[];
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

    // const rounds = await this.eventRoundsRepository.find({
    //   select: {
    //     id: true,
    //     round: true,
    //   },
    // });

    let events = await Promise.all(
      gameIds.map((gameId) =>
        this.eventsRepository.findOne({
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
          this.eventsRepository.findOne({
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
      // odds: oddsData.filter(
      //   (odd) =>
      //     !(
      //       odd.marketType === JAMarketTypes.EVENT &&
      //       [JASubMarketTypes.SPREAD, JASubMarketTypes.TOTAL].includes(odd.subMarketType)
      //     ),
      // ),
      eventRounds,
    };
  }

  async updateOdds(payload: UpdateOddsDto, eventId?: string) {
    try {
      // based on the current event, get the start date since that is used at the identifier
      // for all grouped games
      const event = eventId
        ? await this.eventsRepository.findOne({
            where: {
              id: eventId,
            },
            select: {
              startDate: true,
            },
          })
        : null;
      // get all the game ids
      const gameRows = event
        ? await this.eventsRepository
            .createQueryBuilder("events")
            .select(["events.id as id"])
            .where(
              `to_char(events."startDate", 'MM-DD-YYYY') = '${format(
                event.startDate,
                "MM-dd-yyyy",
              )}'`,
            )
            .andWhere('events."isActive" = true')
            .andWhere('events."isArchived" = false')
            .getRawMany()
        : [];

      const savePayload = payload.items.map((item) =>
        this.oddsRepository.create({
          id: item.id,
          odds: item.odds,
          probability: item.probability,
          hasModifiedProbability: item.hasModifiedProbability,
          lean: item.lean,
          playerLean: item.playerLean,
          bias: item.bias,
          weights: item.weights,
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
          UPDATE ${SportsDbSchema.JA}.odds AS u SET
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

        await this.oddsRepository.manager.transaction(
          async (transactionalEntityManager: EntityManager) => {
            await transactionalEntityManager.query(query);

            if (gameRows.length <= 0) return true;

            // fetch the odd that was just set so it can be applied to the others
            const odds = await transactionalEntityManager.find(Odds, {
              where: {
                eventId,
                marketType: JAMarketTypes.EVENT,
                subMarketType: JASubMarketTypes.MONEYLINE,
                betType: JABetTypes.EVENT_WINNER,
              },
            });

            // for each of the events, update the event marekt based on this latest data
            const promises = gameRows
              .filter((gameRow) => gameRow.id !== eventId)
              .map(async (gameRow) => {
                await transactionalEntityManager.delete(Odds, {
                  eventId: gameRow.id,
                  marketType: JAMarketTypes.EVENT,
                  subMarketType: JASubMarketTypes.MONEYLINE,
                  betType: JABetTypes.EVENT_WINNER,
                });

                await transactionalEntityManager.save(
                  Odds,
                  odds.map((odd) => ({
                    ...odd,
                    id: v4(),
                    eventId: gameRow.id,
                  })),
                );
              });

            await Promise.all(promises);
          },
        );
      }

      /* await this.oddsRepository.manager.transaction(
        async (transactionalEntityManager: EntityManager) => {
          const transactionResult = await Promise.allSettled(
            payload.items.map((item) =>
              transactionalEntityManager.update(
                Odds,
                {
                  id: item.id,
                  eventId,
                },
                {
                  odds: item.odds,
                  probability: item.probability,
                  hasModifiedProbability: item.hasModifiedProbability,
                  lean: item.lean,
                  playerLean: item.playerLean,
                  bias: item.bias,
                  weights: item.weights,
                  max: item.max,
                  calculatedValue: item.calculatedValue,
                  isMarketActive: item.isMarketActive,
                  isSubMarketLocked: item.isSubMarketLocked,
                },
              ),
            ),
          );

          const errorItem = transactionResult.find(
            (resultItem) => resultItem.status === "rejected",
          ) as PromiseRejectedResult;
          if (errorItem) {
            // get the first error that was thrown in the loop and throw that error
            throw errorItem?.reason;
          }
        },
      ); */

      return true;
    } catch (error) {
      throw error;
    }
  }

  async oddsGoLive(eventId: string, projectionType: OddMarkets): Promise<boolean> {
    const event = await this.eventsRepository.findOne({
      where: {
        id: eventId,
      },
      select: {
        startDate: true,
      },
    });

    // get all the game ids
    const gameRows = await this.eventsRepository
      .createQueryBuilder("events")
      .select(["events.id as id"])
      .where(
        `to_char(events."startDate", 'MM-DD-YYYY') = '${format(event.startDate, "MM-dd-yyyy")}'`,
      )
      .andWhere('events."isActive" = true')
      .andWhere('events."isArchived" = false')
      .getRawMany();

    await this.oddsRepository.manager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        switch (projectionType) {
          case OddMarkets.EVENT_WINNER_PROJECTIONS:
            const projectionEventOutcomeData = await transactionalEntityManager.findOne(Odds, {
              where: {
                eventId,
                marketType: JAMarketTypes.EVENT,
                subMarketType: JASubMarketTypes.MONEYLINE,
                betType: JABetTypes.EVENT_WINNER,
                isActive: true,
              },
              select: {
                isActive: true,
              },
            });
            if (!projectionEventOutcomeData) return;

            await transactionalEntityManager.update(
              ClientOdds,
              {
                eventId,
                marketType: JAMarketTypes.EVENT,
                subMarketType: JASubMarketTypes.MONEYLINE,
                betType: JABetTypes.EVENT_WINNER,
              },
              {
                isActive: false,
                isArchived: true,
              },
            );

            await transactionalEntityManager.query(`
              INSERT INTO ${
                SportsDbSchema.JA
              }."clientOdds"("marketType", "subMarketType", "betType", "type", "eventId", "eventTeamId", "eventRoundId", "odds", "probability", "trueProbability", "hasModifiedProbability", "lean", "bias", "max", "holdingPercentage", "calculatedValue", "prop")
              SELECT "marketType", "subMarketType", "betType", "type", "eventId", "eventTeamId", "eventRoundId", "odds", "probability", "trueProbability", "hasModifiedProbability", "lean", "bias", "max", "holdingPercentage", "calculatedValue", "prop" FROM ${
                SportsDbSchema.JA
              }."odds"
              WHERE ${SportsDbSchema.JA}."odds"."marketType" = '${JAMarketTypes.EVENT}' AND ${
              SportsDbSchema.JA
            }."odds"."subMarketType" = ${JASubMarketTypes.MONEYLINE} AND ${
              SportsDbSchema.JA
            }."odds"."betType" = ${JABetTypes.EVENT_WINNER} AND ${
              SportsDbSchema.JA
            }."odds"."eventId" IN (${gameRows.map((row) => `'${row.id}'`).join(", ")});
            `);

            break;

          default:
            break;
        }
      },
    );

    return true;
  }

  public async fetchClientEventOdd(eventId: string): Promise<ClientOdds> {
    const data = await this.clientOddsRepository.findOne({
      where: {
        eventId,
      },
      select: {
        updatedAt: true,
      },
      order: {
        updatedAt: "DESC",
      },
    });

    return data;
  }
}

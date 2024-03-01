/* eslint-disable no-console */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, EntityTarget, ObjectLiteral } from "typeorm";
import { v4 } from "uuid";

import { OddMarkets, EventStatus, HeatStatus, SportsTypes } from "../../../constants/system";
import { MarketSelectionResultStatus, MarketStatus } from "../../../constants/openbet";

import { IFixtureBodyPayload, Market, IFixturePayloadResponse } from "../../../interfaces/openbet";

import WSLEvents from "../../../entities/wsl/events.entity";
import WSLClientProjectionEventOutcome from "../../../entities/wsl/clientProjectionEventOutcome.entity";
import WSLClientProjectionEventHeatOutcome from "../../../entities/wsl/clientProjectionEventHeatOutcome.entity";
import WSLRoundHeats from "../../../entities/wsl/roundHeats.entity";
import WSLFutures from "../../../entities/wsl/futures.entity";
import WSLClientPlayerHeadToHeads from "../../../entities/wsl/clientPlayerHeadToHeads.entity";

import OpenbetAPIService from "../../../services/openbet-api.service";

import { getDecimalOddsFromProbability } from "../../../helpers/probability.helper";

type QueryModels = {
  eventModel: EntityTarget<ObjectLiteral>;
  futureModel: EntityTarget<ObjectLiteral>;
  heatsModel?: EntityTarget<ObjectLiteral>;
  clientEventModel: EntityTarget<ObjectLiteral>;
  clientEventHeatModel?: EntityTarget<ObjectLiteral>;
  clientEventHeadToHeadModel?: EntityTarget<ObjectLiteral>;
};

@Injectable()
export default class OpenbetNotificationService {
  constructor(
    @InjectRepository(WSLEvents) private readonly wslEventsRepository: Repository<WSLEvents>,

    private readonly openbetService: OpenbetAPIService,
  ) {}

  async processEvent(
    eventId: string | null,
    market: OddMarkets,
    sportsType: SportsTypes,
    futureId?: string,
    roundHeatId?: string,
  ): Promise<IFixturePayloadResponse | null> {
    try {
      const models = this.getRepositories(sportsType);

      const eventRepository = this.wslEventsRepository.manager.getRepository(models.eventModel);
      const futuresRepository = this.wslEventsRepository.manager.getRepository(models.futureModel);
      const heatsRepository = models.heatsModel
        ? this.wslEventsRepository.manager.getRepository(models.heatsModel)
        : null;
      const clientEventOddsRepository = this.wslEventsRepository.manager.getRepository(
        models.clientEventModel,
      );
      const clientHeatOddsRepository = models.clientEventHeatModel
        ? this.wslEventsRepository.manager.getRepository(models.clientEventHeatModel)
        : null;
      const clientHeadToHeadRepository = models.clientEventHeadToHeadModel
        ? this.wslEventsRepository.manager.getRepository(models.clientEventHeadToHeadModel)
        : null;

      const event = eventId
        ? await eventRepository.findOne({
            where: {
              id: eventId,
            },
            select: {
              eventStatus: true,
              providerOpenbetFixtureId: true,
            },
          })
        : null;

      const fixturePayload: IFixtureBodyPayload = {
        header: {
          timestamp: new Date().toISOString(),
          trackingId: v4(),
        },
        fixtureId: event?.providerOpenbetFixtureId,
        markets: [],
      };

      switch (market) {
        case OddMarkets.EVENT_WINNER_PROJECTIONS:
        case OddMarkets.EVENT_SECOND_PLACE_PROJECTIONS: {
          const odds = await clientEventOddsRepository.find({
            where: {
              eventId,
              isActive: true,
              isArchived: false,
            },
            select: {
              id: true,
              eventParticipantId: true,
              odds: true,
              participant: {
                id: true,
                athleteId: true,
                athlete: {
                  id: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
            relations: {
              participant: {
                athlete: true,
              },
            },
          });

          const eventOutcomeMarket: Market = {
            cfsMarketType: {
              specifiers: {
                TYPE: market === OddMarkets.EVENT_WINNER_PROJECTIONS ? "WINNER" : "SECOND",
                SHAPE: "PARTICIPANTS",
                PERIOD: "FINAL_HEAT",
                FACT: "SCORE",
              },
            },
            id:
              market === OddMarkets.EVENT_WINNER_PROJECTIONS
                ? `${eventId}:event_winner`
                : `${eventId}:event_second`,
            name: market === OddMarkets.EVENT_WINNER_PROJECTIONS ? "Event Winner" : "Second Place",
            offeredInRunning: false,
            selections: odds.map((oddRow) => {
              let resultsStatus: MarketSelectionResultStatus = MarketSelectionResultStatus.UNSET;

              if (event.eventStatus === EventStatus.COMPLETED) {
                resultsStatus =
                  event.winnerAthleteId === oddRow.participant.athlete.id
                    ? MarketSelectionResultStatus.WIN
                    : MarketSelectionResultStatus.LOSE;
              }

              return {
                cfsSelectionType: {
                  specifiers: {
                    TYPE: "PARTICIPANT",
                  },
                },
                id: `${oddRow.participant.athlete.id}:selection`,
                name: `${oddRow.participant.athlete.firstName} ${oddRow.participant.athlete.lastName}`,
                parameters: {
                  PLAYER: oddRow.participant.athlete.id,
                },
                result: resultsStatus,
                tradingData: {
                  odds: {
                    decimal: `${oddRow.odds}`,
                  },
                  status:
                    event.eventStatus !== EventStatus.COMPLETED
                      ? MarketStatus.OPEN
                      : MarketStatus.CLOSED,
                },
                typeId: "PLAYER",
              };
            }),
            status:
              event.eventStatus !== EventStatus.COMPLETED ? MarketStatus.OPEN : MarketStatus.CLOSED,
            typeId: "FinalHeatOutright",
          };
          fixturePayload.markets.push(eventOutcomeMarket);
          break;
        }

        case OddMarkets.HEAD_TO_HEAD_PROJECTIONS: {
          const odds = await clientHeadToHeadRepository.find({
            where: {
              eventId,
              visible: true,
              isActive: true,
              isArchived: false,
            },
            select: {
              id: true,
              eventParticipant1Id: true,
              eventParticipant2Id: true,
              eventParticipantWinnerId: true,
              player1Probability: true,
              player2Probability: true,
              voided: true,
              draw: true,
              eventParticipant1: {
                id: true,
                athleteId: true,
                athlete: {
                  id: true,
                  firstName: true,
                  lastName: true,
                },
              },
              eventParticipant2: {
                id: true,
                athleteId: true,
                athlete: {
                  id: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
            relations: {
              eventParticipant1: {
                athlete: true,
              },
              eventParticipant2: {
                athlete: true,
              },
            },
          });

          const headToHeadMarkets: Market[] = odds.map((odd) => {
            let participant1resultsStatus: MarketSelectionResultStatus =
              MarketSelectionResultStatus.UNSET;
            let participant2resultsStatus: MarketSelectionResultStatus =
              MarketSelectionResultStatus.UNSET;
            let marketStatus: MarketStatus = MarketStatus.OPEN;

            if (odd.voided) {
              participant1resultsStatus = MarketSelectionResultStatus.VOID;
              participant2resultsStatus = MarketSelectionResultStatus.VOID;
              marketStatus = MarketStatus.CLOSED;
            } else if (odd.eventParticipantWinnerId) {
              // eslint-disable-next-line unicorn/prefer-ternary
              if (odd.eventParticipant1.id === odd.eventParticipantWinnerId)
                participant1resultsStatus = MarketSelectionResultStatus.WIN;
              else participant1resultsStatus = MarketSelectionResultStatus.WIN;

              marketStatus = MarketStatus.RESULTED;
            }

            return {
              cfsMarketType: {
                specifiers: {
                  TYPE: "WINNER",
                  SHAPE: "2_WAY_PARTICIPANT",
                  PERIOD: "HEAT",
                  FACT: "SCORE",
                },
              },
              parameters: {
                HEAT: "1",
                MARKET_PLAYERS: `${odd.eventParticipant1.athlete.id}-P1|${odd.eventParticipant2.athlete.id}-P2`,
              },
              id: `${eventId}:${odd.id}:P1P2`,
              name: "P1 vs P2",
              offeredInRunning: false,
              selections: [
                {
                  cfsSelectionType: {
                    specifiers: {
                      TYPE: "PARTICIPANT_1",
                    },
                  },
                  id: `${odd.eventParticipant1.athlete.id}:selection`,
                  name: `${odd.eventParticipant1.athlete.firstName} ${odd.eventParticipant1.athlete.lastName}`,
                  parameters: {
                    PLAYER: odd.eventParticipant1.athlete.id,
                  },
                  result: participant1resultsStatus,
                  tradingData: {
                    odds: {
                      decimal: `${getDecimalOddsFromProbability(odd.player1Probability)}`,
                    },
                    status: marketStatus,
                  },
                  typeId: "PLAYER",
                },
                {
                  cfsSelectionType: {
                    specifiers: {
                      TYPE: "PARTICIPANT_2",
                    },
                  },
                  id: `${odd.eventParticipant2.athlete.id}:selection`,
                  name: `${odd.eventParticipant2.athlete.firstName} ${odd.eventParticipant2.athlete.lastName}`,
                  parameters: {
                    PLAYER: odd.eventParticipant2.athlete.id,
                  },
                  result: participant2resultsStatus,
                  tradingData: {
                    odds: {
                      decimal: `${getDecimalOddsFromProbability(odd.player2Probability)}`,
                    },
                    status: marketStatus,
                  },
                  typeId: "PLAYER",
                },
              ],
              status: marketStatus,
              typeId: "Head2Head",
            };
          });

          fixturePayload.markets.push(...headToHeadMarkets);
          break;
        }

        case OddMarkets.HEAT_PROJECTIONS: {
          const heat = await heatsRepository.findOne({
            where: {
              id: roundHeatId,
            },
            relations: {
              round: true,
            },
            select: {
              id: true,
              roundId: true,
              heatName: true,
              heatNo: true,
              round: {
                id: true,
                name: true,
              },
            },
          });

          const odds = await clientHeatOddsRepository.find({
            where: {
              eventId,
              roundHeatId,
              isActive: true,
              isArchived: false,
            },
            select: {
              id: true,
              eventParticipantId: true,
              odds: true,
              participant: {
                id: true,
                athleteId: true,
                athlete: {
                  id: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
            relations: {
              participant: {
                athlete: true,
              },
            },
          });

          const eventOutcomeMarket: Market = {
            cfsMarketType: {
              specifiers: {
                TYPE: "WINNER",
                SHAPE: "PARTICIPANTS",
                PERIOD: "HEAT",
                FACT: "SCORE",
              },
            },
            parameters: {
              HEAT: `${heat.heatNo}`,
            },
            id: `${eventId}:${heat.roundId}:${roundHeatId}`,
            name: `${heat.round.name} Heat ${heat.heatNo} Winner`,
            offeredInRunning: false,
            selections: odds.map((oddRow) => {
              let resultsStatus: MarketSelectionResultStatus = MarketSelectionResultStatus.UNSET;

              if (heat.heatStatus === HeatStatus.COMPLETED) {
                resultsStatus =
                  heat.winnerAthleteId === oddRow.participant.athlete.id
                    ? MarketSelectionResultStatus.WIN
                    : MarketSelectionResultStatus.LOSE;
              }

              return {
                cfsSelectionType: {
                  specifiers: {
                    TYPE: "PARTICIPANT",
                  },
                },
                id: `${oddRow.participant.athlete.id}:selection`,
                name: `${oddRow.participant.athlete.firstName} ${oddRow.participant.athlete.lastName}`,
                parameters: {
                  PLAYER: oddRow.participant.athlete.id,
                },
                result: resultsStatus,
                tradingData: {
                  odds: {
                    decimal: `${oddRow.odds}`,
                  },
                  status:
                    heat.heatStatus !== HeatStatus.COMPLETED
                      ? MarketStatus.OPEN
                      : MarketStatus.CLOSED,
                },
                typeId: "HeatWinner",
              };
            }),
            status:
              heat.heatStatus !== HeatStatus.COMPLETED ? MarketStatus.OPEN : MarketStatus.CLOSED,
            typeId: "FinalHeatOutright",
          };
          fixturePayload.markets.push(eventOutcomeMarket);
          break;
        }

        case OddMarkets.FUTURES_WINNER:
        case OddMarkets.FUTURES_TOP_2:
        case OddMarkets.FUTURES_TOP_3:
        case OddMarkets.FUTURES_TOP_5:
        case OddMarkets.FUTURES_TOP_10:
        case OddMarkets.FUTURES_MAKE_CUT:
        case OddMarkets.FUTURES_MAKE_PLAYOFFS: {
          const future = await futuresRepository.findOne({
            where: {
              id: futureId,
            },
            select: {
              id: true,
              type: true,
              isMarketOpen: true,
              providerOpenbetFixtureId: true,
              clientOdds: {
                id: true,
                futureId: true,
                odds: true,
                athlete: {
                  id: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
            relations: {
              clientOdds: {
                athlete: true,
              },
            },
          });

          let specifierType: string = "";
          let marketName: string = "";
          let marketTypeId: string = "";
          const fixtureId: string = future.providerOpenbetFixtureId || future.id;
          fixturePayload.fixtureId = fixtureId;
          // shouldCreateFixture = !!future.providerOpenbetFixtureId;

          if (market === OddMarkets.FUTURES_WINNER) {
            specifierType = "CHAMPIONSHIP_WINNER";
            marketName = "Winner";
            marketTypeId = "ChampionshipWinner";
          } else if (market === OddMarkets.FUTURES_TOP_5) {
            specifierType = "TOP_5";
            marketName = "Top 5";
            marketTypeId = "ChampionshipTop5";
          }

          const futureMarket: Market = {
            cfsMarketType: {
              specifiers: {
                TYPE: specifierType,
                SHAPE: "PARTICIPANTS",
                PERIOD: "OUTRIGHT",
                FACT: "POINTS",
              },
            },
            id: fixtureId,
            name: marketName,
            offeredInRunning: false,
            selections: future.clientOdds.map((oddRow) => {
              // FIXME: need to get event winner for the tour from WSL
              const resultsStatus: MarketSelectionResultStatus = MarketSelectionResultStatus.UNSET;

              return {
                cfsSelectionType: {
                  specifiers: {
                    TYPE: "PARTICIPANT",
                  },
                },
                id: `${oddRow.athlete.id}:selection`,
                name: `${oddRow.athlete.firstName} ${oddRow.athlete.lastName}`,
                parameters: {
                  PLAYER: oddRow.athlete.id,
                },
                result: resultsStatus,
                tradingData: {
                  odds: {
                    decimal: `${oddRow.odds}`,
                  },
                  status: future.isMarketOpen ? MarketStatus.OPEN : MarketStatus.CLOSED,
                },
                typeId: "PLAYER",
              };
            }),
            status: future.isMarketOpen ? MarketStatus.OPEN : MarketStatus.CLOSED,
            typeId: marketTypeId,
          };

          fixturePayload.markets.push(futureMarket);

          if (!future.providerOpenbetFixtureId)
            await futuresRepository.update(
              {
                id: futureId,
              },
              {
                providerOpenbetFixtureId: fixtureId,
              },
            );
          break;
        }

        default: {
          break;
        }
      }

      const openBetResult = await this.syncOpenbet(fixturePayload, market);
      return openBetResult;
    } catch (error) {
      console.error("OPENBET NOTIFICATION SYNC ERROR", error);
      throw error;
    }
  }

  private getRepositories(sportType: SportsTypes): QueryModels {
    switch (sportType) {
      case SportsTypes.SURFING:
      default: {
        return {
          eventModel: WSLEvents,
          heatsModel: WSLRoundHeats,
          futureModel: WSLFutures,
          clientEventModel: WSLClientProjectionEventOutcome,
          clientEventHeatModel: WSLClientProjectionEventHeatOutcome,
          clientEventHeadToHeadModel: WSLClientPlayerHeadToHeads,
        };
      }
    }
  }

  private async syncOpenbet(
    payload: IFixtureBodyPayload,
    market: OddMarkets,
    // shouldCreateFixture: boolean = false,
  ) {
    if (!payload.markets.length) return null;

    console.log(
      `OPENBET NOTIFICATION SYNC EVENTID=${payload.fixtureId} market=${market} trackingId=${payload.header.trackingId}`,
    );

    await this.openbetService.createFixture(payload);
    // else await this.openbetService.updateFixture(payload);

    console.log(
      `OPENBET NOTIFICATION SYNC SUCCESS EVENTID=${payload.fixtureId} market=${market} trackingId=${payload.header.trackingId}`,
    );

    return null;
  }
}

/* eslint-disable no-console */
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, EntityManager, In, Not } from "typeorm";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { format } from "date-fns";
import axios from "axios";

import Events from "../../../../entities/ja/events.entity";
import JAEventRounds from "../../../../entities/ja/eventRounds.entity";
import JAOdds from "../../../../entities/ja/odds.entity";
import JAScores from "../../../../entities/ja/scores.entity";
import JAEventTeams from "../../../../entities/ja/eventTeams.entity";

import * as jaSocketInterfaces from "../../../../interfaces/ja/socket";

import { EventStatus, SportsTypes, RoundStatus } from "../../../../constants/system";
import { JAMarketTypes } from "../../../../constants/odds";

import { delay } from "../../../../helpers/time.helper";

import JaiApiService from "../../../../services/jai.service";
import TradersService from "../traders/traders.service";

export interface IJaiOddsPayload {
  id?: string;
  marketType: number;
  betType: number;
  subMarketType: number;
  odds: number;
  probability: number;
  hasModifiedProbability: boolean;
  trueProbability: number;
  bias: number;
  lean: number;
  playerLean: number;
  max: number;
  calculatedValue: number;
  isHomeTeam: boolean;
  homeTeamName: string;
  awayTeamName: string;
  baseLean: number;
  basePlayerLean: number;
  athlete1: string;
  athlete2: string;
  providerMatchId: string;
  providerRoundId: string | null;
  homeTeamProviderAthlete1Id: string | null;
  homeTeamProviderAthlete2Id: string | null;
  awayTeamProviderAthlete1Id: string | null;
  awayTeamProviderAthlete2Id: string | null;

  isMarketActive?: boolean;
  isSubMarketLocked?: boolean;
}

@Injectable()
export default class EventService {
  constructor(
    private configService: ConfigService,
    private eventEmitter: EventEmitter2,
    @InjectRepository(Events) private readonly eventsRepository: Repository<Events>,
    @InjectRepository(JAScores) private readonly scoresRepository: Repository<JAScores>,
    @InjectRepository(JAOdds) private readonly oddsRepository: Repository<JAOdds>,
    @InjectRepository(JAEventTeams) private readonly eventTeamsRepository: Repository<JAEventTeams>,
    @InjectRepository(JAEventRounds)
    private readonly eventRoundsRepository: Repository<JAEventRounds>,
    private readonly jaiApiService: JaiApiService,
    private readonly tradersService: TradersService,
  ) {}

  async processJaiEvent(eventName: string, data: any): Promise<boolean> {
    console.log(`JAISOCKETS PROCESS API ${eventName} ==>`, JSON.stringify(data));

    let eventId: string;

    switch (eventName) {
      case "SocketStorePoint":
        eventId = await this.processStorePoint(data);
        break;

      case "SocketFinishSet":
        eventId = await this.processFinishSet(data);
        break;

      case "SocketMatchStatus":
        eventId = await this.processMatchStatus(data);
        break;

      case "SocketFinishMatch":
        eventId = await this.processMatchFinish(data);
        break;

      case "SocketMatchCancelled":
        eventId = await this.processMatchCancelled(data);
        break;

      case "SocketNewSet":
        eventId = await this.processNewSet(data);
        break;

      default:
        console.log(`JAISOCKETS PROCESS default ${eventName} ==>`, JSON.stringify(data));
        break;
    }

    if (
      [
        "SocketStorePoint",
        "SocketFinishSet",
        "SocketMatchStatus",
        "SocketMatchCancelled",
        "SocketNewSet",
      ].includes(eventName)
    ) {
      this.eventEmitter.emit(`${SportsTypes.JA}Event`, {
        refresh: true,
      });
    }

    if (
      ["SocketStorePoint", "SocketFinishSet", "SocketMatchStatus", "SocketNewSet"].includes(
        eventName,
      ) &&
      eventId
    )
      await this.resyncOdds(eventId);

    return true;
  }

  private async processStorePoint(payload: jaSocketInterfaces.IStorePoint): Promise<string> {
    console.log("JAISOCKETS PROCESS processStorePoint ==>", JSON.stringify(payload));

    const eventId = await this.eventRoundsRepository.manager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        const activeRound: JAEventRounds = await transactionalEntityManager.findOne(JAEventRounds, {
          where: {
            providerId: payload.loser.set_id,
          },
          relations: {
            event: {
              teams: {
                athlete1: true,
                athlete2: true,
              },
            },
          },
          select: {
            id: true,
            eventId: true,
            roundStatus: true,
            event: {
              id: true,
              eventType: true,
              teams: {
                id: true,
                eventId: true,
                teamId: true,
                athlete1Id: true,
                athlete2Id: true,
                athlete1: {
                  id: true,
                  providerId: true,
                },
                athlete2: {
                  id: true,
                  providerId: true,
                },
              },
            },
          },
        });
        console.log(
          "JAISOCKETS PROCESS processStorePoint activeRound:",
          JSON.stringify(activeRound),
        );

        // if the round is not live, mark it as live
        const liveRoundResult = await transactionalEntityManager.update(
          JAEventRounds,
          {
            id: activeRound.id,
            roundStatus: Not(RoundStatus.LIVE),
          },
          {
            roundStatus: RoundStatus.LIVE,
            startDate: new Date(),
          },
        );
        console.log(
          "JAISOCKETS PROCESS processStorePoint liveRoundResult:",
          liveRoundResult?.affected,
        );

        // also close the market for this round in case it is not closed already
        await transactionalEntityManager.update(
          JAOdds,
          {
            eventRoundId: activeRound.id,
            isMarketActive: true,
          },
          {
            isMarketActive: false,
          },
        );

        const winningTeamPlayerIds =
          payload.winner.match_type === "D"
            ? [payload.winner.player_id_p1, payload.winner.player_id_p2]
            : [payload.winner.player_id_p1];

        const losingTeamPlayerIds =
          payload.loser.match_type === "D"
            ? [payload.loser.player_id_p1, payload.loser.player_id_p2]
            : [payload.loser.player_id_p1];

        const winningTeam = activeRound.event.teams.find((teamRow) =>
          winningTeamPlayerIds.includes(teamRow.athlete1.providerId),
        );
        const losingTeam = activeRound.event.teams.find((teamRow) =>
          losingTeamPlayerIds.includes(teamRow.athlete1.providerId),
        );

        // check if rows exist to start with
        const scoresRow = await transactionalEntityManager.findOne(JAScores, {
          where: {
            eventId: activeRound.eventId,
            eventRoundId: activeRound.id,
            teamId: winningTeam.teamId,
          },
          select: {
            id: true,
          },
        });

        // the winning team servers within a set and if the game is a doubles
        // then it's alwways player 1 that is serving
        const servingAthleteId: string =
          winningTeam.athlete1.providerId === payload.winner.player_id_p1
            ? winningTeam.athlete1.id
            : winningTeam.athlete2.id;

        // within a set, the winning team is the one that will serve next
        await Promise.all([
          transactionalEntityManager.update(
            JAEventTeams,
            {
              id: winningTeam.id,
            },
            {
              isServing: true,
              servingAthleteId,
            },
          ),
          transactionalEntityManager.update(
            JAEventTeams,
            {
              id: losingTeam.id,
            },
            {
              isServing: false,
              servingAthleteId: null,
            },
          ),
        ]);

        if (scoresRow) {
          await transactionalEntityManager.increment(
            JAScores,
            {
              id: scoresRow.id,
            },
            "score",
            +payload.winner.point_value,
          );
        } else {
          // rows do not exist, create them
          const scoresRowInsert = this.scoresRepository.create([
            {
              eventId: activeRound.eventId,
              teamId: winningTeam.teamId,
              athleteId: winningTeam.athlete1Id,
              eventRoundId: activeRound.id,
              score: +payload.winner.point_value,
              providerId: `${payload.winner.set_scoring_id}`,
            },
            {
              eventId: activeRound.eventId,
              teamId: losingTeam.teamId,
              athleteId: losingTeam.athlete1Id,
              eventRoundId: activeRound.id,
              score: +payload.loser.point_value,
              providerId: `${payload.loser.set_scoring_id}`,
            },
          ]);
          await transactionalEntityManager.save(scoresRowInsert);
        }

        return activeRound.eventId;
      },
    );

    return eventId;
  }

  private async processFinishSet(payload: jaSocketInterfaces.IFinishSet): Promise<string> {
    console.log("JAISOCKETS PROCESS processFinishSet ==>", JSON.stringify(payload));

    await this.eventRoundsRepository.update(
      {
        providerId: `${payload.setData.id}`,
      },
      {
        roundStatus: RoundStatus.COMPLETED,
        endDate: new Date(),
      },
    );

    // if the current set is set 1 then create the odds for set 2
    const eventRound = await this.eventRoundsRepository.findOne({
      where: {
        providerId: `${payload.setData.id}`,
      },
      select: {
        id: true,
        round: true,
        eventId: true,
      },
    });

    const eventTeams = await this.eventTeamsRepository.find({
      where: {
        eventId: eventRound.eventId,
      },
      select: {
        id: true,
        isServing: true,
        athlete1Id: true,
      },
    });

    await this.eventRoundsRepository.manager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        if (+eventRound.round === 1) {
          // copy the odds from the first round and create it for the second round
          const roundOdds = await this.oddsRepository.find({
            where: {
              eventId: eventRound.eventId,
              eventRoundId: eventRound.id,
            },
          });

          const nextEventRound = await this.eventRoundsRepository.findOne({
            where: {
              eventId: eventRound.eventId,
              round: "2",
            },
            select: {
              id: true,
            },
          });

          await transactionalEntityManager.save(
            JAOdds,
            roundOdds.map((row) =>
              this.oddsRepository.create({
                ...row,
                id: undefined,
                eventRoundId: nextEventRound.id,
                isMarketActive: true,
                isSubMarketLocked: false,
              }),
            ),
          );
        }

        await transactionalEntityManager.update(
          JAEventRounds,
          {
            providerId: `${payload.setData.id}`,
          },
          {
            roundStatus: RoundStatus.COMPLETED,
            endDate: new Date(),
          },
        );

        // find the current non serving team, which will be the serving team next
        // mark player 1 in the non serving team as the server
        const nonServingTeam = eventTeams.find((team) => !team.isServing);

        // flip the serving when a set ends
        await Promise.all(
          eventTeams.map((row) =>
            transactionalEntityManager.update(
              JAEventTeams,
              {
                id: row.id,
              },
              {
                isServing: !row.isServing,
                servingAthleteId: row.id === nonServingTeam?.id ? nonServingTeam.athlete1Id : null,
              },
            ),
          ),
        );
      },
    );

    return eventRound.eventId;
  }

  private async processMatchFinish(payload: jaSocketInterfaces.IMatchFinish): Promise<string> {
    console.log("JAISOCKETS PROCESS processMatchFinish ==>", JSON.stringify(payload));

    const event = await this.eventsRepository.findOne({
      where: {
        providerId: payload.id,
      },
      select: {
        id: true,
      },
    });
    console.log("JAISOCKETS PROCESS processMatchFinish event:", event?.id);

    const scoresTeamRow = await this.scoresRepository.findOne({
      where: {
        eventId: event.id,
        providerId: `${payload.winner}`,
      },
      select: {
        teamId: true,
      },
    });

    await this.eventsRepository.update(
      {
        id: event.id,
      },
      {
        winnerTeamId: scoresTeamRow.teamId,
      },
    );

    return event.id;
  }

  private async processMatchStatus(payload: jaSocketInterfaces.IMatchStatus): Promise<string> {
    console.log("JAISOCKETS PROCESS processMatchStatus ==>", JSON.stringify(payload));

    let eventStatus: EventStatus = EventStatus.UPCOMING;

    if (payload.status.status === "R") {
      // live
      eventStatus = EventStatus.LIVE;
    } else if (payload.status.status === "F") {
      // finish
      eventStatus = EventStatus.COMPLETED;
    }

    const event = await this.eventsRepository.findOne({
      where: {
        providerId: payload.status.match_id,
      },
      select: {
        id: true,
      },
    });
    console.log("JAISOCKETS PROCESS processMatchStatus event:", event?.id);

    // if match is live then close the following markets
    await this.eventRoundsRepository.manager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        await transactionalEntityManager.update(
          Events,
          {
            id: event.id,
          },
          {
            eventStatus,
            endDate: eventStatus === EventStatus.COMPLETED ? new Date() : null,
          },
        );
        // event and match markets are closed when the match is live
        if (eventStatus === EventStatus.LIVE) {
          await transactionalEntityManager.update(
            JAOdds,
            {
              eventId: event.id,
              marketType: In([JAMarketTypes.EVENT, JAMarketTypes.MATCH]),
            },
            {
              isMarketActive: false,
            },
          );
        }
      },
    );

    return event.id;
  }

  private async processMatchCancelled(
    payload: jaSocketInterfaces.IMatchCancelled,
  ): Promise<string> {
    console.log("JAISOCKETS PROCESS processMatchCancelled ==>", JSON.stringify(payload));

    const event = await this.eventsRepository.findOne({
      where: {
        providerId: `${payload.match.match_id}`,
      },
      select: {
        id: true,
      },
    });
    console.log("JAISOCKETS PROCESS processMatchCancelled event:", event?.id);

    const scoringData = await this.jaiApiService.getSetPlayers(payload.match.winner);

    const scoresTeamRow = await this.eventTeamsRepository.findOne({
      where: {
        eventId: event.id,
        athlete1: {
          providerId: In(scoringData.map((row) => `${row.playerId}`)),
        },
      },
      relations: {
        athlete1: true,
      },
      select: {
        id: true,
        athlete1Id: true,
        athlete1: {
          id: true,
          providerId: true,
        },
        teamId: true,
      },
    });
    console.log("JAISOCKETS PROCESS processMatchCancelled scoresTeamRow:", scoresTeamRow?.teamId);

    // find the team where the play id matches the players in the team

    // find the winning team based on the set scoring id
    // const scoresTeamRow = await this.scoresRepository.findOne({
    //   where: {
    //     eventId: event.id,
    //     providerId: `${payload.match.winner}`,
    //   },
    //   select: {
    //     teamId: true,
    //   },
    // });

    await this.eventRoundsRepository.manager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        await transactionalEntityManager.update(
          Events,
          {
            id: event.id,
          },
          {
            winnerTeamId: scoresTeamRow.teamId,
            eventStatus: EventStatus.COMPLETED,
            endDate: new Date(),
          },
        );
        // all markets are closed since the game was cancelled
        await transactionalEntityManager.update(
          JAOdds,
          {
            eventId: event.id,
            marketType: In([JAMarketTypes.EVENT, JAMarketTypes.MATCH, JAMarketTypes.SETS]),
          },
          {
            isMarketActive: false,
          },
        );
      },
    );

    return event.id;
  }

  private async processNewSet(payload: jaSocketInterfaces.INewSet): Promise<string> {
    console.log("JAISOCKETS PROCESS processNewSet ==>", JSON.stringify(payload));

    const event = await this.eventsRepository.findOne({
      where: {
        providerId: payload.newSetData.set.match_id,
      },
      select: {
        id: true,
      },
    });
    console.log("JAISOCKETS PROCESS processNewSet event:", event?.id);

    const odds = await this.oddsRepository.find({
      where: {
        eventRound: {
          round: `${+payload.newSetData.set.number - 1}`,
          eventId: event.id,
        },
      },
      relations: {
        eventRound: true,
      },
    });

    await this.eventRoundsRepository.manager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        const insertedRound = await transactionalEntityManager.save(
          JAEventRounds,
          this.eventRoundsRepository.create({
            eventId: event.id,
            round: payload.newSetData.set.number,
            roundStatus: RoundStatus.UPCOMING,
            providerId: `${payload.newSetData.set.id}`,
          }),
        );

        await transactionalEntityManager.save(
          JAOdds,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          odds.map(({ eventRound, ...row }) =>
            this.oddsRepository.create({
              ...row,
              id: undefined,
              eventRoundId: insertedRound.id,
              isMarketActive: true,
              isSubMarketLocked: false,
            }),
          ),
        );
      },
    );

    return event.id;
  }

  private async resyncOdds(eventId: string) {
    // adding a delay so the committed transaction has time to be visible
    await delay(4_000);

    const event = await this.eventsRepository.findOne({
      where: {
        id: eventId,
      },
      select: {
        startDate: true,
      },
    });

    const gameDate = format(event.startDate, "MM-dd-yyyy");

    console.log("RESEYNC JAI start");
    console.log("RESEYNC JAI gameDate", gameDate);

    const gameRows = await this.eventsRepository
      .createQueryBuilder("events")
      .select(["events.id as id"])
      .where(`to_char(events."startDate", 'MM-DD-YYYY') = '${gameDate}'`)
      .andWhere('events."isActive" = true')
      .andWhere('events."isArchived" = false')
      .getRawMany<{
        id: string;
      }>();
    console.log("RESEYNC JAI gameRows:", JSON.stringify(gameRows));

    const promises = gameRows.map(async (gameRow) => {
      const { odds, eventRounds } = await this.tradersService.fetchOdds(gameRow.id);

      const homeTeamRow = odds.find((row) => row.eventTeam.isHomeTeam);
      const awayTeamRow = odds.find((row) => !row.eventTeam.isHomeTeam);

      const oddsRequestPayload: IJaiOddsPayload[] = odds.map((d) => {
        const round = eventRounds.find((eR) => eR.id === d.eventRoundId);

        return {
          id: d.id,
          marketType: d.marketType,
          betType: d.betType,
          subMarketType: d.subMarketType,
          odds: +Number(d.odds).toFixed(2),
          probability: +Number(d.probability).toFixed(2),
          hasModifiedProbability: d.hasModifiedProbability,
          trueProbability: +Number(d.trueProbability).toFixed(2),
          bias: d.bias,
          lean: d.lean,
          playerLean: d.playerLean,
          max: d.max,
          calculatedValue: +Number(d.calculatedValue).toFixed(2),
          isHomeTeam: d.eventTeam.isHomeTeam,
          homeTeamName: homeTeamRow.eventTeam.team.name,
          awayTeamName: awayTeamRow.eventTeam.team.name,
          baseLean: 0,
          basePlayerLean: 0,
          athlete1: d.eventTeam.isHomeTeam
            ? homeTeamRow.eventTeam.athlete1.firstName
            : awayTeamRow.eventTeam.athlete1.firstName,
          athlete2: d.eventTeam.isHomeTeam
            ? homeTeamRow.eventTeam.athlete2?.firstName || null
            : awayTeamRow.eventTeam.athlete2?.firstName || null,
          providerMatchId: d.event.providerId,
          providerRoundId: round?.providerId || null,
          homeTeamProviderAthlete1Id: d.eventTeam.isHomeTeam
            ? d.eventTeam.athlete1.providerId
            : null,
          homeTeamProviderAthlete2Id: d.eventTeam.isHomeTeam
            ? d.eventTeam.athlete2?.providerId
            : null,
          awayTeamProviderAthlete1Id: !d.eventTeam.isHomeTeam
            ? d.eventTeam.athlete1.providerId
            : null,
          awayTeamProviderAthlete2Id: !d.eventTeam.isHomeTeam
            ? d.eventTeam.athlete2?.providerId
            : null,

          isMarketActive: d.isMarketActive,
          isSubMarketLocked: d.isSubMarketLocked,
        };
      });

      const response = await axios.post<{
        data: {
          data: IJaiOddsPayload[];
        };
      }>(
        `${this.configService.get("jaiOddsOutputApiBaseUrl")}/api/jaialai/model/output`,
        oddsRequestPayload,
      );

      const updatedOdds: IJaiOddsPayload[] = response.data.data.data;

      return updatedOdds.map((row) => ({
        id: row.id,
        odds: row.odds,
        probability: row.probability,
        hasModifiedProbability: row.hasModifiedProbability,
        bias: row.bias,
        lean: row.lean,
        playerLean: row.playerLean,
        max: row.max,
        weights: null,
        calculatedValue: row.calculatedValue,
        isMarketActive: row.isMarketActive,
        isSubMarketLocked: row.isSubMarketLocked,
      }));
    });

    const oddResults = await Promise.all(promises);

    const items = oddResults.flat();
    console.log("RESEYNC JAI items count", items.length);

    await this.tradersService.updateOdds({
      items,
    });

    this.eventEmitter.emit(`${SportsTypes.JA}Event`, {
      oddsRefresh: true,
    });

    console.log("RESEYNC JAI end");

    return true;
  }
}

/* eslint-disable id-denylist */
/* eslint-disable no-console */
import Pusher, { Channel } from "pusher-js";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, EntityManager, In, Not } from "typeorm";
import { EventEmitter2 } from "@nestjs/event-emitter";

import { ConfigService } from "@nestjs/config";

import * as jaSocketInterfaces from "../interfaces/ja/socket";

import JAEvents from "../entities/ja/events.entity";
import JAEventRounds from "../entities/ja/eventRounds.entity";
import JAOdds from "../entities/ja/odds.entity";
import JAScores from "../entities/ja/scores.entity";

import { EventStatus, RoundStatus, SportsTypes } from "../constants/system";
import { JAMarketTypes } from "../constants/odds";

const events: string[] = [
  "SocketDeletePoint",
  "SocketFinishMatch",
  "SocketFinishSet",
  "SocketInGameActions",
  "SocketMatchCancelled",
  "SocketMatchStatus",
  "SocketNewSet",
  "SocketStorePoint",
  "SocketUpdateMatchNumber",
  "SocketStoreCourtSwap",
  "SocketUpdateMatchNumber",
  "SocketStoreScratch",
];

export class MockH2hChannel {
  private eventCallbacks: Record<string, ((data: any) => void)[]> = {};

  bind(eventName: string, callback: (data: object) => void) {
    // Check if the event already exists, if not, create an array to store callbacks
    if (!this.eventCallbacks[eventName]) {
      this.eventCallbacks[eventName] = [];
    }
    this.eventCallbacks[eventName].push(callback);
  }

  // A separate function to trigger the stored callbacks for a specific event
  triggerEvent(eventName: string, eventData: object) {
    const callbacks = this.eventCallbacks[eventName];
    if (callbacks) {
      for (const callback of callbacks) {
        callback(eventData);
      }
    }
  }
}

@Injectable()
export default class JASockets {
  private channel: Channel | MockH2hChannel;

  constructor(
    public configService: ConfigService,
    private eventEmitter: EventEmitter2,
    @InjectRepository(JAEvents) private readonly eventsRepository: Repository<JAEvents>,
    @InjectRepository(JAScores) private readonly scoresRepository: Repository<JAScores>,
    @InjectRepository(JAOdds) private readonly oddsRepository: Repository<JAOdds>,
    @InjectRepository(JAEventRounds)
    private readonly eventRoundsRepository: Repository<JAEventRounds>,
  ) {
    const h2hChannel = this.init();
    this.channel = h2hChannel;

    events.forEach((event: string) => {
      const eventName: string = "App\\Events\\" + event;

      h2hChannel.bind(eventName, async (data: any) => {
        console.log(`JAISOCKETS ==> ${event}`, JSON.stringify(data));

        switch (event) {
          case "SocketStorePoint":
            await this.processStorePoint(data);
            break;

          case "SocketFinishSet":
            await this.processFinishSet(data);
            break;

          case "SocketMatchStatus":
            await this.processMatchStatus(data);
            break;

          case "SocketFinishMatch":
            await this.processMatchFinish(data);
            break;

          case "SocketMatchCancelled":
            await this.processMatchCancelled(data);
            break;

          case "SocketNewSet":
            await this.processNewSet(data);
            break;

          default:
            console.log(`JAISOCKETS PROCESS default ${event} ==>`, JSON.stringify(data));
            break;
        }

        if (
          [
            "SocketStorePoint",
            "SocketFinishSet",
            "SocketMatchStatus",
            "SocketMatchCancelled",
            "SocketNewSet",
          ].includes(event)
        ) {
          this.eventEmitter.emit(`${SportsTypes.JA}Event`, {
            refresh: true,
          });
        }
      });
    });
  }

  init(): Channel | MockH2hChannel {
    if (!this.isAllowed()) {
      // return a mock object for development
      const mockChannel = new MockH2hChannel();
      return mockChannel;
    }

    const io = new Pusher(this.configService.get<string>("jaiAlaiPusher.appKey"), {
      cluster: this.configService.get<string>("jaiAlaiPusher.cluster"),
      wsHost: this.configService.get<string>("jaiAlaiPusher.wsHost"),
      wsPort: +this.configService.get<number>("jaiAlaiPusher.wsPort"),
      forceTLS: false,
    });

    io.connection.bind("initialized", () => console.log("initialized"));
    io.connection.bind("connecting", () => console.log("connecting"));
    io.connection.bind("connected", () => console.log("connected"));
    io.connection.bind("unavailable", () => console.log("unavailable"));
    io.connection.bind("failed", () => console.log("failed"));
    io.connection.bind("disconnected", () => console.log("disconnected"));

    io.connection.bind("initialized", function () {
      console.log("initialized");
    });
    io.connection.bind("connecting", function () {
      console.log("connecting");
    });
    io.connection.bind("connected", () => {
      console.log("connected");
    });
    io.connection.bind("unavailable", function () {
      console.log("unavailable");
    });
    io.connection.bind("failed", function () {
      console.log("failed");
    });
    io.connection.bind("disconnected", function () {
      console.log("disconnected");
    });

    const h2hChannel = io.subscribe(this.configService.get<string>("jaiAlaiPusher.channel"));
    return h2hChannel;
  }

  isAllowed(): boolean {
    const isDevelop: boolean = this.configService.get<boolean>("isDevelop");
    const isStaging: boolean = this.configService.get<boolean>("isStaging");
    const isRelease: boolean = this.configService.get<boolean>("isRelease");

    return isRelease || isStaging || isDevelop;
  }

  async processStorePoint(payload: jaSocketInterfaces.IStorePoint) {
    console.log("JAISOCKETS PROCESS processStorePoint ==>", JSON.stringify(payload));

    await this.eventRoundsRepository.manager.transaction(
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
      },
    );
  }

  async processFinishSet(payload: jaSocketInterfaces.IFinishSet) {
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
      },
    );
  }

  async processMatchFinish(payload: jaSocketInterfaces.IMatchFinish) {
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
  }

  async processMatchStatus(payload: jaSocketInterfaces.IMatchStatus) {
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
          JAEvents,
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
  }

  async processMatchCancelled(payload: jaSocketInterfaces.IMatchCancelled) {
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

    // find the winning team based on the set scoring id
    const scoresTeamRow = await this.scoresRepository.findOne({
      where: {
        eventId: event.id,
        providerId: `${payload.match.winner}`,
      },
      select: {
        teamId: true,
      },
    });

    await this.eventRoundsRepository.manager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        await transactionalEntityManager.update(
          JAEvents,
          {
            id: event.id,
          },
          {
            winnerTeamId: scoresTeamRow.teamId,
            eventStatus: EventStatus.CANCELLED,
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
  }

  async processNewSet(payload: jaSocketInterfaces.INewSet) {
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
  }

  public triggerEvent(eventName: string, eventData: object) {
    (this.channel as MockH2hChannel).triggerEvent(eventName, eventData);
  }
}

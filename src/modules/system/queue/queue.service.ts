/* eslint-disable no-console */
/* eslint-disable no-case-declarations */

import { Injectable, OnModuleInit } from "@nestjs/common";
import { SQS } from "aws-sdk";
import { Consumer } from "sqs-consumer";
import { InjectRepository } from "@nestjs/typeorm";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Repository, EntityManager, IsNull, In } from "typeorm";
import groupBy from "lodash.groupby";
import { isAfter, getYear } from "date-fns";
import { ConfigService } from "@nestjs/config";

import WSLProjectionEventOutcome from "../../../entities/wsl/projectionEventOutcome.entity";
import WSLProjectionEventHeatOutcome from "../../../entities/wsl/projectionEventHeatOutcome.entity";
import WSLEventRounds from "../../../entities/wsl/eventRounds.entity";
import WSLEvents from "../../../entities/wsl/events.entity";
import WSLPlayerHeadToHeads from "../../../entities/wsl/playerHeadToHeads.entity";
import WSLProjectionEventShows from "../../../entities/wsl/projectionEventShows.entity";
import WSLProjectionEventPodiums from "../../../entities/wsl/projectionEventPodiums.entity";

import SLSProjectionEventOutcome from "../../../entities/sls/projectionEventOutcome.entity";
import SLSProjectionHeatOutcome from "../../../entities/sls/projectionEventHeatOutcome.entity";
import SLSEventRounds from "../../../entities/sls/eventRounds.entity";
import SLSEvents from "../../../entities/sls/events.entity";
import SLSPlayerHeadToHeads from "../../../entities/sls/playerHeadToHeads.entity";
import SLSProjectionEventShows from "../../../entities/sls/projectionEventShows.entity";
import SLSProjectionEventPodiums from "../../../entities/sls/projectionEventPodiums.entity";

import NRXProjectionEventOutcome from "../../../entities/nrx/projectionEventOutcome.entity";
import NRXProjectionEventPodiums from "../../../entities/nrx/projectionEventPodiums.entity";
import NRXProjectionEventShows from "../../../entities/nrx/projectionEventShows.entity";
import NRXProjectionEventHeatOutcome from "../../../entities/nrx/projectionEventHeatOutcome.entity";
import NRXEventRounds from "../../../entities/nrx/eventRounds.entity";
import NRXEventParticipants from "../../../entities/nrx/eventParticipants.entity";
import NRXEvents from "../../../entities/nrx/events.entity";
import NRXRoundHeats from "../../../entities/nrx/roundHeats.entity";
import NRXPlayerHeadToHeads from "../../../entities/nrx/playerHeadToHeads.entity";
import NRXScores from "../../../entities/nrx/scores.entity";

import MASLEvents from "../../../entities/masl/events.entity";

import * as probabilityHelpers from "../../../helpers/probability.helper";

import { postCutDate } from "../../../constants/wsl";

import { IOdds, IEventParticipants } from "../../../interfaces/simulation";
import { ISimScoresList } from "../../../interfaces/nrx";

import MaslSyncService from "../sync/masl/sync.masl.service";
import WSLSyncService from "../sync/wsl/sync.wsl.service";
import SLSSyncService from "../sync/sls/sync.sls.service";

import NotificationsService from "../notifications/notifications.service";

import SlackService from "../../../services/slack.service";

import {
  Queues,
  QueueMessageType,
  SportsTypes,
  SimRunTypes,
  EventStatus,
  Gender,
  NRXRounds,
  NRXLapStatus,
  QueueCronType,
  DEFAULT_HOLD_PERCENTAGE,
  SHOWS_HOLD_PERCENTAGE,
  PODIUM_HOLD_PERCENTAGE,
  OddMarkets,
} from "../../../constants/system";

import {
  IQueueUrl,
  IQueueValue,
  IQueuePayload,
  IQueueMessageBody,
  IProcessSim,
  IProcessSimBody,
  IProcessSimResponseBody,
  IProcessEvent,
  IProcessMarketNotification,
  IProcessMarketNotificationBody,
  IProcessEventBody,
  ICronResponseBody,
} from "../../../interfaces/system";

import * as serverExceptions from "../../../exceptions/system";

type showPodiumItem = {
  position: number;
  count: number;
  eventParticipantId: string;
};

@Injectable()
export default class QueueService implements OnModuleInit {
  private sqs: SQS = null;
  private queueUrls: IQueueUrl = {
    [Queues.SIM_TASKS]: null,
    [Queues.DEAD_SIM_TASKS]: null,
    [Queues.SIM_TASK_RESPONSES]: null,
    [Queues.DEAD_SIM_TASK_RESPONSES]: null,
    [Queues.TASKS]: null,
    [Queues.DEAD_TASKS]: null,
    [Queues.CRON]: null,
    [Queues.DEAD_CRON]: null,
  };

  constructor(
    private eventEmitter: EventEmitter2,

    @InjectRepository(SLSProjectionEventOutcome)
    private readonly slsProjectionEventOutcome: Repository<SLSProjectionEventOutcome>,

    @InjectRepository(SLSProjectionHeatOutcome)
    private readonly slsProjectionHeatOutcome: Repository<SLSProjectionHeatOutcome>,

    @InjectRepository(SLSProjectionEventShows)
    private readonly slsProjectionEventShows: Repository<SLSProjectionEventShows>,

    @InjectRepository(SLSProjectionEventPodiums)
    private readonly slsProjectionEventPodiums: Repository<SLSProjectionEventPodiums>,

    @InjectRepository(SLSPlayerHeadToHeads)
    private readonly slsPlayerHeadToHead: Repository<SLSPlayerHeadToHeads>,

    @InjectRepository(WSLProjectionEventOutcome)
    private readonly wslProjectionEventOutcome: Repository<WSLProjectionEventOutcome>,

    @InjectRepository(WSLProjectionEventShows)
    private readonly wslProjectionEventShows: Repository<WSLProjectionEventShows>,

    @InjectRepository(WSLProjectionEventPodiums)
    private readonly wslProjectionEventPodiums: Repository<WSLProjectionEventPodiums>,

    @InjectRepository(WSLPlayerHeadToHeads)
    private readonly wslPlayerHeadToHead: Repository<WSLPlayerHeadToHeads>,

    @InjectRepository(NRXProjectionEventOutcome)
    private readonly nrxProjectionEventOutcome: Repository<NRXProjectionEventOutcome>,

    @InjectRepository(NRXProjectionEventPodiums)
    private readonly nrxProjectionEventPodiums: Repository<NRXProjectionEventPodiums>,

    @InjectRepository(NRXProjectionEventShows)
    private readonly nrxProjectionEventShows: Repository<NRXProjectionEventShows>,

    @InjectRepository(NRXPlayerHeadToHeads)
    private readonly nrxPlayerHeadToHead: Repository<NRXPlayerHeadToHeads>,

    @InjectRepository(WSLProjectionEventHeatOutcome)
    private readonly wslProjectionEventHeatOutcome: Repository<WSLProjectionEventHeatOutcome>,

    @InjectRepository(NRXProjectionEventHeatOutcome)
    private readonly nrxProjectionEventHeatOutcome: Repository<NRXProjectionEventHeatOutcome>,

    @InjectRepository(SLSEventRounds)
    private readonly slsEventRoundsRepo: Repository<SLSEventRounds>,

    @InjectRepository(WSLEventRounds)
    private readonly wslEventRoundsRepo: Repository<WSLEventRounds>,

    @InjectRepository(NRXEventRounds)
    private readonly nrxEventRounds: Repository<NRXEventRounds>,

    @InjectRepository(SLSEvents)
    private readonly eventsRepo: Repository<SLSEvents>,

    @InjectRepository(WSLEvents)
    private readonly wslEventsRepo: Repository<WSLEvents>,

    @InjectRepository(NRXEvents)
    private readonly nrxEventsRepo: Repository<NRXEvents>,

    @InjectRepository(NRXRoundHeats)
    private readonly nrxRoundHeats: Repository<NRXRoundHeats>,

    @InjectRepository(NRXEventParticipants)
    private readonly nrxEventParticipants: Repository<NRXEventParticipants>,

    @InjectRepository(NRXScores)
    private readonly nrxScores: Repository<NRXScores>,

    @InjectRepository(MASLEvents)
    private readonly maslEventsRepo: Repository<MASLEvents>,

    private configService: ConfigService,

    private maslSyncService: MaslSyncService,

    private wslSyncService: WSLSyncService,

    private slsSyncService: SLSSyncService,

    private notificationsService: NotificationsService,

    private readonly slackService: SlackService,
  ) {
    this.sqs = new SQS({
      credentials: {
        accessKeyId: this.configService.get<string>("aws.sqs.accessKeyId"),
        secretAccessKey: this.configService.get<string>("aws.sqs.secretAccessKey"),
      },
      region: this.configService.get<string>("aws.sqs.region"),
    });
  }

  async onModuleInit() {
    if (!this.isAllowed()) return false;

    const environment = this.configService.get<string>("environment");

    const [
      simTaskQueue,
      deadSimTaskQueue,
      simTaskResponseQueue,
      deadSimTaskResponseQueue,
      tasksQueue,
      deadTasksQueue,
      cronQueue,
      deadCronQueue,
    ] = await Promise.all([
      this.sqs
        .getQueueUrl({
          QueueName: `${environment}_${Queues.SIM_TASKS}`,
        })
        .promise(),
      this.sqs
        .getQueueUrl({
          QueueName: `dead_${environment}_${Queues.SIM_TASKS}`,
        })
        .promise(),
      this.sqs
        .getQueueUrl({
          QueueName: `${environment}_${Queues.SIM_TASK_RESPONSES}`,
        })
        .promise(),
      this.sqs
        .getQueueUrl({
          QueueName: `dead_${environment}_${Queues.SIM_TASK_RESPONSES}`,
        })
        .promise(),
      this.sqs
        .getQueueUrl({
          QueueName: `${environment}_${Queues.TASKS}`,
        })
        .promise(),
      this.sqs
        .getQueueUrl({
          QueueName: `dead_${environment}_${Queues.TASKS}`,
        })
        .promise(),
      this.sqs
        .getQueueUrl({
          QueueName: `${environment}_${Queues.CRON}`,
        })
        .promise(),
      this.sqs
        .getQueueUrl({
          QueueName: `dead_${environment}_${Queues.CRON}`,
        })
        .promise(),
    ]);

    this.queueUrls[Queues.SIM_TASKS] = {
      url: simTaskQueue.QueueUrl,
      isDlq: false,
      key: Queues.SIM_TASKS,
    };
    this.queueUrls[Queues.DEAD_SIM_TASKS] = {
      url: deadSimTaskQueue.QueueUrl,
      isDlq: true,
      key: Queues.DEAD_SIM_TASKS,
    };
    this.queueUrls[Queues.SIM_TASK_RESPONSES] = {
      url: simTaskResponseQueue.QueueUrl,
      isDlq: false,
      key: Queues.SIM_TASK_RESPONSES,
    };
    this.queueUrls[Queues.DEAD_SIM_TASK_RESPONSES] = {
      url: deadSimTaskResponseQueue.QueueUrl,
      isDlq: true,
      key: Queues.DEAD_SIM_TASK_RESPONSES,
    };
    this.queueUrls[Queues.TASKS] = {
      url: tasksQueue.QueueUrl,
      isDlq: false,
      key: Queues.TASKS,
    };
    this.queueUrls[Queues.DEAD_TASKS] = {
      url: deadTasksQueue.QueueUrl,
      isDlq: true,
      key: Queues.DEAD_TASKS,
    };
    this.queueUrls[Queues.CRON] = {
      url: cronQueue.QueueUrl,
      isDlq: false,
      key: Queues.CRON,
    };
    this.queueUrls[Queues.DEAD_CRON] = {
      url: deadCronQueue.QueueUrl,
      isDlq: true,
      key: Queues.DEAD_CRON,
    };

    this.initConsumers(this.queueUrls);
  }

  isAllowed(): boolean {
    const isDevelop: boolean = this.configService.get<boolean>("isDevelop");
    const isStaging: boolean = this.configService.get<boolean>("isStaging");
    const isRelease: boolean = this.configService.get<boolean>("isRelease");

    return isRelease || isStaging || isDevelop;
  }

  async notifyMarketPublishNotification({
    delaySeconds = 1,
    eventId,
    futureId,
    roundHeatId,
    sportType,
    market,
  }: IProcessMarketNotification) {
    try {
      const payload: IProcessMarketNotificationBody = {
        eventId,
        futureId,
        roundHeatId,
        messageType: QueueMessageType.MARKET_NOTIFICATION,
        queueType: Queues.TASKS,
        sportType,
        market,
      };
      console.log("🚀 ~ file: queue.service.ts:295 ~ notify ~ payload:", payload);

      const result = await this.sendQueueMessage({
        delaySeconds,
        messageBody: payload,
      });

      return result;
    } catch (error) {
      throw error;
    }
  }

  async notifyEventUpdate({
    delaySeconds = 5,
    eventId,
    sportType,
    triggerIds = [],
    triggerType,
  }: IProcessEvent) {
    try {
      const payload: IProcessEventBody = {
        eventId,
        messageType: QueueMessageType.EVENT,
        queueType: Queues.TASKS,
        sportType,
        triggerType,
        triggerIds,
      };

      // eslint-disable-next-line no-console
      console.log(
        "🚀 ~ file: queue.service.ts ~ line 179 ~ QueueService ~ notifyEventUpdate ~ payload",
        eventId,
      );

      const result = await this.sendQueueMessage({
        delaySeconds,
        messageBody: payload,
      });

      return result;
    } catch (error) {
      throw error;
    }
  }

  async notifySim({
    delaySeconds = 5,
    eventId,
    isPostCut,
    gender,
    sportType,
    simRunType,
    rounds,
    homeTeamId,
    awayTeamId,
    triggerType,
    triggerIds = [],
  }: IProcessSim) {
    try {
      const payload: IProcessSimBody = {
        isPostCut,
        eventId,
        gender,
        sportType,
        simRunType,
        rounds,
        homeTeamId,
        awayTeamId,
        messageType: QueueMessageType.SIM,
        queueType: Queues.SIM_TASKS,
        triggerType,
        triggerIds,
      };
      // eslint-disable-next-line no-console
      console.log(
        "🚀 ~ file: queue.service.ts ~ line 205 ~ QueueService ~ notifySim ~ payload",
        payload.eventId,
        payload.sportType,
      );

      const result = await this.sendQueueMessage({
        delaySeconds,
        messageBody: payload,
      });

      this.eventEmitter.emit(`${sportType}OddEvent`, {
        status: "start",
      });

      return result;
    } catch (error) {
      throw error;
    }
  }

  private async sendQueueMessage<T extends IQueueMessageBody>(payload: IQueuePayload<T>) {
    try {
      if (!this.isAllowed()) return false;

      if (Object.values(this.queueUrls).some((item) => item === null))
        throw serverExceptions.queueNotAvailable;

      switch (payload.messageBody.queueType) {
        case Queues.SIM_TASKS:
          return this.sqs
            .sendMessage({
              DelaySeconds: payload.delaySeconds,
              MessageBody: JSON.stringify(payload.messageBody),
              QueueUrl: this.queueUrls[Queues.SIM_TASKS].url,
            })
            .promise();

        case Queues.TASKS:
          return this.sqs
            .sendMessage({
              DelaySeconds: payload.delaySeconds,
              MessageBody: JSON.stringify(payload.messageBody),
              QueueUrl: this.queueUrls[Queues.TASKS].url,
            })
            .promise();
          break;

        default:
          throw serverExceptions.unhandledQueueMessage;
      }
    } catch (error) {
      throw error;
    }
  }

  processQueueMessage = async (message: SQS.Message) => {
    try {
      const parsedMessage = JSON.parse(message.Body);
      console.log(
        "🚀 ~ file: queue.service.ts:440 ~ processQueueMessage= ~ parsedMessage:",
        parsedMessage.messageType,
      );

      switch (parsedMessage.messageType) {
        case QueueMessageType.SIM_RESPONSE:
          const simResponsePayload: IProcessSimResponseBody =
            parsedMessage as IProcessSimResponseBody;
          // eslint-disable-next-line no-console
          console.log(
            "🚀 ~ file: queue.service.ts ~ line 251 ~ QueueService ~ processQueueMessage= ~ simResponsePayload",
            JSON.stringify({
              eventId: simResponsePayload.eventId,
              sportType: simResponsePayload.sportType,
            }),
          );

          await this.processSimResult(
            simResponsePayload.eventId,
            {
              winners: simResponsePayload.winners,
              second: simResponsePayload.second,
              third: simResponsePayload.third,
              heats: simResponsePayload?.heats || [],
              bets: simResponsePayload?.bets || null,
              totalSimRuns: simResponsePayload.totalSimRuns,
            },
            simResponsePayload.simRunType,
            simResponsePayload.sportType,
          );
          break;

        case QueueMessageType.EVENT:
          const eventPayload: IProcessEventBody = parsedMessage as IProcessEventBody;
          await this.notifyEventSim(
            eventPayload.eventId,
            eventPayload.sportType,
            eventPayload.triggerType,
            eventPayload.triggerIds,
          );
          break;

        case QueueMessageType.MARKET_NOTIFICATION:
          const marketNotificationPayload: IProcessMarketNotificationBody =
            parsedMessage as IProcessMarketNotificationBody;
          console.log(
            "🚀 ~ file: queue.service.ts:474 ~ processQueueMessage= ~ marketNotificationPayload:",
            marketNotificationPayload,
          );
          await this.notificationsService.notifyOddsPublished(
            marketNotificationPayload.sportType,
            marketNotificationPayload.market,
            marketNotificationPayload.eventId,
            marketNotificationPayload.futureId,
            marketNotificationPayload.roundHeatId,
          );
          break;

        case QueueMessageType.CRON:
          const cronPayload: ICronResponseBody = parsedMessage as ICronResponseBody;

          console.log(
            "🚀 ~ file: queue.service.ts:496 ~ processQueueMessage= ~ cronPayload.cronType:",
            cronPayload.cronType,
          );
          switch (cronPayload.cronType) {
            case QueueCronType.MASL_SYNC_SCHEDULED_EVENTS:
              await this.maslSyncService.syncScheduledEvents();
              break;
            case QueueCronType.MASL_SYNC_LIVE_EVENTS:
              await this.maslSyncService.syncLiveEvents();
              break;

            case QueueCronType.WSL_SYNC_SCHEDULED_EVENTS:
              await this.wslSyncService.syncEvents();
              break;
            case QueueCronType.WSL_SYNC_LIVE_EVENTS:
              await this.wslSyncService.syncLiveUpcomingEvents();
              break;

            case QueueCronType.SLS_SYNC_SCHEDULED_EVENTS:
              await this.slsSyncService.syncEvents();
              break;
            case QueueCronType.SLS_SYNC_LIVE_EVENTS:
              await this.slsSyncService.syncLiveUpcomingEvents();
              break;

            default:
              break;
          }
          break;

        default:
          break;
      }
    } catch (error) {
      console.error(
        "🚀 ~ file: queue.service.ts ~ line 211 ~ QueueService ~ processQueueMessage ~ error",
        error,
        JSON.stringify(JSON.parse(message.Body)),
      );
      throw await this.wrapError(error);
    }
  };

  private async processDlqMessage(message: SQS.Message) {
    try {
      const payload = JSON.parse(message.Body);
      console.error(
        "🚀 ~ file: queue.service.ts ~ line 166 ~ QueueService ~ processDlqMessage ~ payload",
        payload,
      );
    } catch (error) {
      throw await this.wrapError(error);
    }
  }

  private initConsumers(queueUrls: IQueueUrl): Consumer[] {
    try {
      const consumers = Object.values(queueUrls)
        .filter((queue: IQueueValue) => !queue.isDlq && queue.key !== Queues.SIM_TASKS)
        .map((queue: IQueueValue) => this.createConsumer(queue.url, this.processQueueMessage));

      const dlqConsumers = Object.values(queueUrls)
        .filter((queue: IQueueValue) => queue.isDlq && queue.key !== Queues.SIM_TASKS)
        .map((queue: IQueueValue) => this.createConsumer(queue.url, this.processDlqMessage));

      return [...consumers, ...dlqConsumers];
    } catch (error) {
      throw error;
    }
  }

  private createConsumer(queueUrl: string, callbackUrl: (message: SQS.Message) => Promise<void>) {
    try {
      const queueConsumer = Consumer.create({
        queueUrl,
        handleMessage: callbackUrl,
        sqs: this.sqs,
      });
      queueConsumer.on("error", async (err) => {
        console.error(`${queueUrl} ==> error ${err}`);
      });

      queueConsumer.on("processing_error", async (err) => {
        console.error(`${queueUrl} ==> processing_error ${err}`);
      });

      // queueConsumer.on("message_processed", (message: SQS.Message) => {
      //   console.error(`${queueUrl} ==> message_processed ${JSON.stringify(message)}`);
      // });

      // queueConsumer.on("response_processed", () => {
      //   console.error(`${queueUrl} ==> response_processed`);
      // });

      queueConsumer.on("timeout_error", async (err) => {
        console.error(`${queueUrl} ==> timeout_error ${err}`);
      });

      queueConsumer.on("stopped", async () => {
        console.error(`${queueUrl} ==> stopped SQS stream stopped`);
      });

      queueConsumer.on("stopped", async () => {
        console.error(`${queueUrl} ==> stopped SQS stream stopped`);
      });

      queueConsumer.start();

      return queueConsumer;
    } catch (error) {
      console.error("🚀 ~ file: queue.service.ts:593 ~ createConsumer ~ error:", error);
      throw error;
    }
  }

  public async notifyEventSim(
    eventId: string,
    sportType: SportsTypes,
    triggerType: OddMarkets,
    triggerIds: string[],
  ) {
    try {
      if (sportType === SportsTypes.SKATEBOARDING) {
        const event = await this.eventsRepo.findOne({
          where: {
            id: eventId,
          },
          select: {
            id: true,
            eventStatus: true,
            leagueYear: {
              leagueId: true,
              league: {
                id: true,
                gender: true,
              },
            },
            isSimulationEnabled: true,
          },
          relations: ["leagueYear.league"],
        });
        if (
          [EventStatus.COMPLETED, EventStatus.CANCELLED, EventStatus.POSTPONED].includes(
            event.eventStatus,
          ) ||
          !event.isSimulationEnabled
        )
          return true;

        const result = await this.slsEventRoundsRepo.find({
          where: {
            eventId,
            round: {
              heats: {
                eventId,
                scores: {
                  eventId,
                  athlete: {
                    // filtering on this causes an issue because not event event has an event seed
                    // older ones will not, though there should be no reason to sim older events to start with
                    participant: {
                      eventId,
                      isActive: true,
                      isArchived: false,
                    },
                  },
                },
              },
            },
          },
          select: {
            roundStatus: true,
            round: {
              id: true,
              name: true,
              roundNo: true,
              heats: {
                id: true,
                heatName: true,
                heatNo: true,
                heatStatus: true,
                scores: {
                  athleteId: true,
                  roundScore: true,
                  athlete: {
                    id: true,
                    participant: {
                      id: true,
                      athleteId: true,
                      seedNo: true,
                      baseRunScore: true,
                      baseTrickScore: true,
                      baseRoundScore: true,
                      trickCompletion: true,
                    },
                  },
                },
              },
            },
          },
          relations: ["round.heats.scores.athlete.participant"],
        });

        if (result.length <= 0) {
          // nothing to sim, likely and older event
          // eslint-disable-next-line no-console
          console.log("Did not run sim, no result set found");
        }

        const payload = {
          eventId,
          gender: event.leagueYear.league.gender as Gender,
          simRunType: SimRunTypes.EVENT,
          sportType,
          triggerType,
          triggerIds,
          rounds: result.map((row) => {
            return {
              id: row.round.id,
              name: row.round.name,
              roundNo: row.round.roundNo,
              status: row.roundStatus,
              heats: row.round.heats.map((heat) => {
                return {
                  id: heat.id,
                  name: heat.heatName,
                  heatNo: heat.heatNo,
                  heatStatus: heat.heatStatus,
                  participants: heat.scores.map((score) => {
                    return {
                      seedNo: score.athlete.participant.seedNo,
                      athleteId: score.athlete.id,
                      eventParticipantId: score.athlete.participant.id,
                      baseRunScore: +score.athlete.participant.baseRunScore,
                      baseTrickScore: +score.athlete.participant.baseTrickScore,
                      baseRoundScore: +score.athlete.participant.baseRoundScore,
                      trickCompletion: +score.athlete.participant.trickCompletion,
                      roundScore: +score.roundScore,
                    };
                  }),
                };
              }),
            };
          }),
        };

        await this.notifySim(payload);
      } else if (sportType === SportsTypes.SURFING) {
        const event = await this.wslEventsRepo.findOne({
          where: {
            id: eventId,
          },
          select: {
            id: true,
            eventStatus: true,
            startDate: true,
            tourYear: {
              tourId: true,
              tour: {
                id: true,
                gender: true,
              },
            },
            isSimulationEnabled: true,
          },
          relations: ["tourYear.tour"],
        });
        if (
          [EventStatus.COMPLETED, EventStatus.CANCELLED, EventStatus.POSTPONED].includes(
            event.eventStatus,
          ) ||
          !event.isSimulationEnabled
        )
          return true;

        const result = await this.wslEventRoundsRepo.find({
          where: {
            eventId,
            round: {
              heats: {
                eventId,
                scores: {
                  eventId,
                  athlete: {
                    // filtering on this causes an issue because not event event has an event seed
                    // older ones will not, though there should be no reason to sim older events to start with
                    participant: {
                      eventId,
                      isActive: true,
                      isArchived: false,
                    },
                  },
                },
              },
            },
          },
          select: {
            roundStatus: true,
            round: {
              id: true,
              name: true,
              roundNo: true,
              heats: {
                id: true,
                heatName: true,
                heatNo: true,
                heatStatus: true,
                scores: {
                  athleteId: true,
                  heatScore: true,
                  heatPosition: true,
                  athlete: {
                    id: true,
                    participant: {
                      id: true,
                      athleteId: true,
                      seedNo: true,
                      tier: true,
                      tierSeed: true,
                      baseProjection: true,
                      isActive: true,
                      isArchived: false,
                    },
                  },
                },
              },
            },
          },
          relations: ["round.heats.scores.athlete.participant"],
        });

        if (result.length <= 0) {
          // nothing to sim, likely and older event
          // eslint-disable-next-line no-console
          console.log("Did not run sim, no result set found");
        }

        const isPostCut: boolean = isAfter(event.startDate, postCutDate(getYear(event.startDate)));

        const payload = {
          eventId,
          isPostCut,
          gender: event.tourYear.tour.gender as Gender,
          simRunType: SimRunTypes.EVENT,
          sportType,
          triggerType,
          triggerIds,
          rounds: result.map((row) => {
            return {
              id: row.round.id,
              name: row.round.name,
              roundNo: row.round.roundNo,
              status: row.roundStatus,
              heats: row.round.heats.map((heat) => {
                return {
                  id: heat.id,
                  name: heat.heatName,
                  heatNo: heat.heatNo,
                  heatStatus: heat.heatStatus,
                  participants: heat.scores.map((score) => {
                    return {
                      seedNo: score.athlete.participant.seedNo,
                      tier: score.athlete.participant.tier,
                      tierSeed: +score.athlete.participant.tierSeed,
                      athleteId: score.athlete.id,
                      eventParticipantId: score.athlete.participant.id,
                      baseProjection: +score.athlete.participant.baseProjection,
                      heatScore: +score.heatScore,
                      heatPosition: +score.heatPosition,
                    };
                  }),
                };
              }),
            };
          }),
        };

        await this.notifySim(payload);
      } else if (sportType === SportsTypes.RALLYCROSS) {
        const event = await this.nrxEventsRepo.findOne({
          where: {
            id: eventId,
          },
          select: {
            id: true,
            eventStatus: true,
            tourYear: {
              tourId: true,
              tour: {
                id: true,
                gender: true,
              },
            },
            isSimulationEnabled: true,
          },
          relations: ["tourYear.tour"],
        });
        if (
          [EventStatus.COMPLETED, EventStatus.CANCELLED, EventStatus.POSTPONED].includes(
            event.eventStatus,
          ) ||
          !event.isSimulationEnabled
        )
          return false;

        const result = await this.nrxEventRounds.find({
          where: {
            eventId,
            round: {
              heats: {
                eventId,
                // scores: {
                //   eventId,
                //   athlete: {
                //     // filtering on this causes an issue because not event event has an event seed
                //     // older ones will not, though there should be no reason to sim older events to start with
                //     participant: {
                //       eventId,
                //       isActive: true,
                //       isArchived: false,
                //     },
                //   },
                // },
              },
            },
          },
          select: {
            roundStatus: true,
            round: {
              id: true,
              name: true,
              roundNo: true,
              heats: {
                id: true,
                heatName: true,
                heatNo: true,
                heatStatus: true,
                // scores: {
                //   athleteId: true,
                //   roundSeed: true,
                //   lapTime: true,
                //   isJoker: true,
                //   isBye: true,
                //   athlete: {
                //     id: true,
                //     participant: {
                //       id: true,
                //       athleteId: true,
                //       seedNo: true,
                //       baseProjection: true,
                //       baseLapTime: true,
                //       baseJokerLapTime: true,
                //       baseNonJokerLapTime: true,
                //       isActive: true,
                //       isArchived: false,
                //     },
                //   },
                // },
              },
            },
          },
          // relations: ["round.heats.scores.athlete.participant"],
          relations: ["round.heats"],
          // order: {
          //   round: {
          //     roundNo: "ASC",
          //   },
          // },
        });

        const scores = await this.nrxScores.find({
          where: {
            eventId,
            athlete: {
              // filtering on this causes an issue because not event event has an event seed
              // older ones will not, though there should be no reason to sim older events to start with
              participant: {
                eventId,
                isActive: true,
                isArchived: false,
              },
            },
          },
          relations: ["athlete.participant"],
          select: {
            roundHeatId: true,
            athleteId: true,
            roundSeed: true,
            lapTime: true,
            isJoker: true,
            isBye: true,
            status: true,
            athlete: {
              id: true,
              participant: {
                id: true,
                athleteId: true,
                seedNo: true,
                baseProjection: true, // solo
                baseHeadLapTime: true,
                baseNonJokerLapTime: true, // race
                headCrashRate: true,
                raceCrashRate: true,
                isActive: true,
                isArchived: true,
              },
            },
          },
        });

        const scoreGroups: ISimScoresList = groupBy(scores, "roundHeatId");

        const parsedResult = result.map((row) => ({
          ...row,
          round: {
            ...row.round,
            heats: row.round.heats.map((heatRow) => ({
              ...heatRow,
              scores: scoreGroups[heatRow.id] || [],
            })),
          },
        }));

        const eventParticipants = await this.nrxEventParticipants.find({
          where: {
            eventId,
            isActive: true,
            isArchived: false,
          },
          select: {
            id: true,
            athleteId: true,
            seedNo: true,
            baseProjection: true, // solo
            baseHeadLapTime: true,
            baseNonJokerLapTime: true, // race
            headCrashRate: true,
            raceCrashRate: true,
            isActive: true,
            isArchived: false,
          },
        });

        if (!parsedResult.length) {
          // nothing to sim, likely and older event
          // eslint-disable-next-line no-console
          console.log("Did not run sim, no result set found");
          return false;
        } else if (!eventParticipants.length) {
          // eslint-disable-next-line no-console
          console.log("Did not run sim, no participants exist");
          return false;
        } else if (eventParticipants.length) {
          // check to see if there is any participant where the projection values do not exist
          // in that case do not run the sim
          // const isInvalid = eventParticipants.some((row) => +row.baseLapTime <= 0);
          const isInvalid = eventParticipants.some((row) => +row.baseProjection <= 0);
          if (isInvalid) {
            // eslint-disable-next-line no-console
            console.log("Did not run sim, no participants exist");
            return false;
          }
        }

        const payload: IProcessSim = {
          eventId,
          gender: event.tourYear.tour.gender as Gender,
          simRunType: SimRunTypes.EVENT,
          sportType,
          triggerType,
          triggerIds,
          rounds: parsedResult.map((row) => {
            return {
              id: row.round.id,
              name: row.round.name,
              roundNo: row.round.roundNo,
              status: row.roundStatus,
              heats: row.round.heats.map((heat) => {
                const participantsObj: {
                  [participantId: string]: IEventParticipants;
                } = {};

                heat.scores.forEach((score) => {
                  if (!participantsObj[score.athleteId])
                    participantsObj[score.athleteId] = {
                      seedNo: +score.athlete.participant.seedNo,
                      athleteId: score.athlete.id,
                      eventParticipantId: score.athlete.participant.id,
                      baseSoloLapTime: +score.athlete.participant.baseProjection, // solo
                      baseHeadLapTime: +score.athlete.participant.baseHeadLapTime,
                      baseRaceLapTime: +score.athlete.participant.baseNonJokerLapTime, // race
                      headCrashRate: +score.athlete.participant.headCrashRate,
                      raceCrashRate: +score.athlete.participant.raceCrashRate,
                      soloCrashRate: +score.athlete.participant.soloCrashRate,
                      laps: [],
                    };
                  participantsObj[score.athleteId].laps.push({
                    isBye: score.isBye,
                    isJoker: score.isJoker,
                    lapTime: +score.lapTime,
                    status: score.status ? (score.status as NRXLapStatus) : null,
                  });
                });

                let participants = Object.values(participantsObj);
                if (!participants.length && row.round.roundNo === NRXRounds.TP) {
                  // this could happen because of irregularity with Thrill One data posting
                  // so use the participant list above and create the participants only if this is
                  participants = eventParticipants.map((eventParticipantRow) => ({
                    seedNo: +eventParticipantRow.seedNo,
                    athleteId: eventParticipantRow.athleteId,
                    eventParticipantId: eventParticipantRow.id,
                    baseSoloLapTime: +eventParticipantRow.baseProjection,
                    baseHeadLapTime: +eventParticipantRow.baseHeadLapTime,
                    baseRaceLapTime: +eventParticipantRow.baseNonJokerLapTime,
                    headCrashRate: +eventParticipantRow.headCrashRate,
                    raceCrashRate: +eventParticipantRow.raceCrashRate,
                    soloCrashRate: +eventParticipantRow.soloCrashRate,
                    laps: [],
                  }));
                }

                return {
                  id: heat.id,
                  name: heat.heatName,
                  heatNo: heat.heatNo,
                  heatStatus: heat.heatStatus,
                  participants,
                };
              }),
            };
          }),
        };

        await this.notifySim(payload);
      } else if (sportType === SportsTypes.MASL) {
        const event = await this.maslEventsRepo.findOne({
          relations: ["teams"],
          where: {
            id: eventId,
            teams: {
              eventId,
            },
          },
          select: {
            id: true,
            eventStatus: true,
            teams: {
              id: true,
              eventId: true,
              teamId: true,
              isHomeTeam: true,
            },
            isSimulationEnabled: true,
          },
        });
        if (
          [EventStatus.COMPLETED, EventStatus.CANCELLED, EventStatus.POSTPONED].includes(
            event.eventStatus,
          ) ||
          !event.isSimulationEnabled
        )
          return false;

        const homeTeam = event.teams.find((row) => row.isHomeTeam);
        const awayTeam = event.teams.find((row) => !row.isHomeTeam);

        const payload: IProcessSim = {
          eventId,
          gender: Gender.MALE,
          simRunType: SimRunTypes.EVENT,
          sportType,
          triggerType,
          triggerIds,
          homeTeamId: homeTeam.teamId,
          awayTeamId: awayTeam.teamId,
        };

        await this.notifySim(payload);
      }

      return true;
    } catch (error) {
      throw await this.wrapError(error);
    }
  }

  async processSimResult(
    eventId: string,
    payload: IOdds,
    simRunType: SimRunTypes,
    sportsType: SportsTypes,
  ) {
    let result: boolean;
    switch (sportsType) {
      case SportsTypes.SKATEBOARDING:
        result = await this.processSlsResult(eventId, payload, simRunType);
        break;

      case SportsTypes.SURFING:
        result = await this.processWslResult(eventId, payload, simRunType);
        break;

      case SportsTypes.RALLYCROSS:
        result = await this.processNrxResult(eventId, payload, simRunType);
        break;

      default:
        break;
    }

    this.eventEmitter.emit(`${sportsType}OddEvent`, {
      status: "end",
    });

    return result;
  }

  private async processSlsResult(
    eventId: string,
    simPayload: IOdds,
    simRunType: SimRunTypes,
  ): Promise<boolean> {
    switch (simRunType) {
      case SimRunTypes.EVENT:
        const [
          winnerHoldPercentage,
          secondHoldPercentage,
          heatHoldPercentages,
          showHoldPercentage,
          podiumHoldPercentage,
          headToHeadHoldPercentages,
        ] = await Promise.all([
          this.slsProjectionEventOutcome
            .createQueryBuilder()
            .select("SUM(probability)", "total")
            .where({
              eventId,
              position: 1,
            })
            .getRawOne<{
              total: string;
            }>(),
          this.slsProjectionEventOutcome
            .createQueryBuilder()
            .select("SUM(probability)", "total")
            .where({
              eventId,
              position: 2,
            })
            .getRawOne<{
              total: string;
            }>(),
          this.slsProjectionHeatOutcome
            .createQueryBuilder()
            .select([`"roundHeatId"`, "SUM(probability) as total"])
            .where({
              eventId,
            })
            .groupBy(`"roundHeatId"`)
            .getRawMany<{
              roundHeatId: string;
              total: string;
            }>(),
          this.slsProjectionEventShows
            .createQueryBuilder()
            .select("SUM(probability)", "total")
            .where({
              eventId,
            })
            .getRawOne<{
              total: string;
            }>(),
          this.slsProjectionEventPodiums
            .createQueryBuilder()
            .select("SUM(probability)", "total")
            .where({
              eventId,
            })
            .getRawOne<{
              total: string;
            }>(),
          this.slsPlayerHeadToHead
            .createQueryBuilder()
            .select(["id", `"holdingPercentage" as total`])
            .where({
              eventId,
            })
            .getRawMany<{
              id: string;
              total: string;
            }>(),
        ]);

        const winnerHoldingPercentage: number =
          +winnerHoldPercentage?.total && +winnerHoldPercentage?.total >= DEFAULT_HOLD_PERCENTAGE
            ? Math.round(+winnerHoldPercentage.total)
            : DEFAULT_HOLD_PERCENTAGE;
        const secondHoldingPercentage: number =
          +secondHoldPercentage?.total && +secondHoldPercentage?.total >= DEFAULT_HOLD_PERCENTAGE
            ? Math.round(+secondHoldPercentage.total)
            : DEFAULT_HOLD_PERCENTAGE;
        const showHoldingPercentage: number =
          +showHoldPercentage?.total && +showHoldPercentage?.total >= SHOWS_HOLD_PERCENTAGE
            ? Math.round(+showHoldPercentage.total)
            : SHOWS_HOLD_PERCENTAGE;
        const podiumHoldingPercentage: number =
          +podiumHoldPercentage?.total && +podiumHoldPercentage?.total >= PODIUM_HOLD_PERCENTAGE
            ? Math.round(+podiumHoldPercentage.total)
            : PODIUM_HOLD_PERCENTAGE;

        const simEventPayload: SLSProjectionEventOutcome[] = [
          ...simPayload.winners.map((winner) => {
            const probability = probabilityHelpers.computeProbability(
              winner.probability,
              winnerHoldingPercentage,
              DEFAULT_HOLD_PERCENTAGE,
            );

            return this.slsProjectionEventOutcome.create({
              eventId,
              eventParticipantId: winner.eventParticipantId,
              position: 1,
              odds: probabilityHelpers.getDecimalOddsFromProbability(probability),
              probability,
              trueProbability: winner.probability,
              hasModifiedProbability: false,
            });
          }),
          ...simPayload.second.map((second) => {
            const probability = probabilityHelpers.computeProbability(
              second.probability,
              secondHoldingPercentage,
              DEFAULT_HOLD_PERCENTAGE,
            );

            return this.slsProjectionEventOutcome.create({
              eventId,
              eventParticipantId: second.eventParticipantId,
              position: 2,
              odds: probabilityHelpers.getDecimalOddsFromProbability(probability),
              probability,
              trueProbability: second.probability,
              hasModifiedProbability: false,
            });
          }),
        ];

        const showPodiumPayload: showPodiumItem[] = [
          ...simPayload.winners.map((row) => ({
            position: 1,
            count: row.count,
            eventParticipantId: row.eventParticipantId,
          })),
          ...simPayload.second.map((row) => ({
            position: 2,
            count: row.count,
            eventParticipantId: row.eventParticipantId,
          })),
          ...simPayload.third.map((row) => ({
            position: 3,
            count: row.count,
            eventParticipantId: row.eventParticipantId,
          })),
        ];

        const groupedParticipantPlayers: {
          [key: string]: showPodiumItem[];
        } = groupBy(showPodiumPayload, "eventParticipantId");

        const simShowsPayload: SLSProjectionEventShows[] = [];
        const simPodiumsPayload: SLSProjectionEventPodiums[] = [];

        Object.values(groupedParticipantPlayers).map((rows) => {
          const itemRow = rows[0];

          const showsCount: number = rows
            .filter((row) => [1, 2].includes(row.position))
            .reduce((total, item) => total + item.count, 0);
          const podiumCount: number = rows
            .filter((row) => [1, 2, 3].includes(row.position))
            .reduce((total, item) => total + item.count, 0);

          const showProbability: number = probabilityHelpers.getProbability(
            showsCount,
            simPayload.totalSimRuns,
          );
          const showOdds: number = probabilityHelpers.getDecimalOdds(
            showsCount,
            simPayload.totalSimRuns,
          );
          const podiumProbability: number = probabilityHelpers.getProbability(
            podiumCount,
            simPayload.totalSimRuns,
          );
          const podiumOdds: number = probabilityHelpers.getDecimalOdds(
            podiumCount,
            simPayload.totalSimRuns,
          );

          simShowsPayload.push(
            this.slsProjectionEventShows.create({
              eventId,
              eventParticipantId: itemRow.eventParticipantId,
              odds: showOdds,
              probability: showProbability,
              trueProbability: showProbability,
              hasModifiedProbability: false,
            }),
          );

          simPodiumsPayload.push(
            this.slsProjectionEventPodiums.create({
              eventId,
              eventParticipantId: itemRow.eventParticipantId,
              odds: podiumOdds,
              probability: podiumProbability,
              trueProbability: podiumProbability,
              hasModifiedProbability: false,
            }),
          );
        });

        const parsedSimShowsPayload: SLSProjectionEventShows[] = simShowsPayload.map((row) => {
          const probability = probabilityHelpers.computeProbability(
            row.trueProbability,
            showHoldingPercentage,
            SHOWS_HOLD_PERCENTAGE,
          );

          return {
            ...row,
            odds: probabilityHelpers.getDecimalOddsFromProbability(probability),
            probability,
            trueProbability: row.probability,
          };
        });

        const parsedSimPodiumsPayload: SLSProjectionEventPodiums[] = simPodiumsPayload.map(
          (row) => {
            const probability = probabilityHelpers.computeProbability(
              row.trueProbability,
              podiumHoldingPercentage,
              PODIUM_HOLD_PERCENTAGE,
            );

            return {
              ...row,
              odds: probabilityHelpers.getDecimalOddsFromProbability(probability),
              probability,
              trueProbability: row.probability,
            };
          },
        );

        // fetch the event and fetch the heats
        // make a check to ensure that the market is still open for both in order to update it
        const [event] = await Promise.all([
          this.eventsRepo.findOne({
            where: {
              id: eventId,
              isEventWinnerMarketOpen: true,
            },
            select: {
              id: true,
              isEventWinnerMarketOpen: true,
            },
          }),
          // this.slsRoundHeatsRepo.find({
          //   where: {
          //     eventId,
          //   },
          //   select: {
          //     eventId: true,
          //     id: true,
          //     isHeatWinnerMarketOpen: true,
          //   },
          // }),
        ]);
        // const heatIds = heats.map((item) => item.id);

        const simEventHeatPayload: SLSProjectionHeatOutcome[] = simPayload.heats.map((item) => {
          const heatHoldPercentageRow = heatHoldPercentages.find(
            (row) => row.roundHeatId === item.roundHeatId,
          );
          const holdingPercentage: number =
            heatHoldPercentageRow?.total && +heatHoldPercentageRow?.total >= DEFAULT_HOLD_PERCENTAGE
              ? Math.round(+heatHoldPercentageRow.total)
              : DEFAULT_HOLD_PERCENTAGE;

          const probability = probabilityHelpers.computeProbability(
            item.probability,
            holdingPercentage,
            DEFAULT_HOLD_PERCENTAGE,
          );

          return this.slsProjectionHeatOutcome.create({
            ...item,
            odds: probabilityHelpers.getDecimalOddsFromProbability(probability),
            probability,
            trueProbability: item.probability,
            hasModifiedProbability: false,
          });
        });

        await this.slsProjectionEventOutcome.manager.transaction(
          async (transactionalEntityManager: EntityManager) => {
            if (simEventPayload.length && event?.isEventWinnerMarketOpen) {
              await transactionalEntityManager.delete(SLSProjectionEventOutcome, {
                eventId,
              });
              await transactionalEntityManager.delete(SLSProjectionEventShows, {
                eventId,
              });
              await transactionalEntityManager.delete(SLSProjectionEventPodiums, {
                eventId,
              });
              await transactionalEntityManager.save(SLSProjectionEventOutcome, simEventPayload);
              await transactionalEntityManager.save(
                SLSProjectionEventPodiums,
                parsedSimPodiumsPayload,
              );
              await transactionalEntityManager.save(SLSProjectionEventShows, parsedSimShowsPayload);
              // at the same time clear previously archived event participants
              // await transactionalEntityManager.delete(SLSEventParticipants, {
              //   eventId,
              //   isActive: false,
              //   isArchived: true,
              // });
            }

            const modifiedRoundHeatIds = simEventHeatPayload.map((item) => item.roundHeatId);
            if (simEventHeatPayload.length) {
              await transactionalEntityManager.delete(SLSProjectionHeatOutcome, {
                eventId,
                roundHeatId: In(modifiedRoundHeatIds),
              });
              await transactionalEntityManager.save(SLSProjectionHeatOutcome, simEventHeatPayload);
            }

            if (simPayload.bets?.headToHead?.length) {
              await Promise.all(
                simPayload.bets.headToHead.map(async (headToHeadItem) => {
                  const headToHeadHoldPercentageRow = headToHeadHoldPercentages.find(
                    (row) => row.id === headToHeadItem.id,
                  );
                  const holdingPercentage: number =
                    headToHeadHoldPercentageRow?.total &&
                    +headToHeadHoldPercentageRow?.total >= DEFAULT_HOLD_PERCENTAGE
                      ? Math.round(+headToHeadHoldPercentageRow.total)
                      : DEFAULT_HOLD_PERCENTAGE;

                  const player1Probability = probabilityHelpers.computeProbability(
                    headToHeadItem.player1Probability,
                    holdingPercentage,
                    DEFAULT_HOLD_PERCENTAGE,
                  );
                  const player2Probability = probabilityHelpers.computeProbability(
                    headToHeadItem.player2Probability,
                    holdingPercentage,
                    DEFAULT_HOLD_PERCENTAGE,
                  );

                  return transactionalEntityManager.update(
                    SLSPlayerHeadToHeads,
                    {
                      id: headToHeadItem.id,
                      // only updating bets that have no finished
                      eventParticipantWinnerId: IsNull(),
                    },
                    {
                      player1Odds:
                        probabilityHelpers.getDecimalOddsFromProbability(player1Probability),
                      player2Odds:
                        probabilityHelpers.getDecimalOddsFromProbability(player2Probability),
                      player1Probability,
                      player2Probability,
                      player1TrueProbability: headToHeadItem.player1Probability,
                      player2TrueProbability: headToHeadItem.player2Probability,
                      holdingPercentage,
                      player1HasModifiedProbability: false,
                      player2HasModifiedProbability: false,
                    },
                  );
                }),
              );
            }

            // if (simEventHeatPayload.length) {
            //   await transactionalEntityManager.delete(SLSProjectionEventHeatOutcome, {
            //     eventId,
            //   });
            //   await transactionalEntityManager.save(
            //     SLSProjectionEventHeatOutcome,
            //     simEventHeatPayload,
            //   );
            // }
          },
        );

        break;

      case SimRunTypes.HEAT:
        break;

      default:
        break;
    }

    return true;
  }

  private async processWslResult(
    eventId: string,
    simPayload: IOdds,
    simRunType: SimRunTypes,
  ): Promise<boolean> {
    switch (simRunType) {
      case SimRunTypes.EVENT:
        const [
          winnerHoldPercentage,
          secondHoldPercentage,
          heatHoldPercentages,
          showHoldPercentage,
          podiumHoldPercentage,
          headToHeadHoldPercentages,
        ] = await Promise.all([
          this.wslProjectionEventOutcome
            .createQueryBuilder()
            .select("SUM(probability)", "total")
            .where({
              eventId,
              position: 1,
            })
            .getRawOne<{
              total: string;
            }>(),
          this.wslProjectionEventOutcome
            .createQueryBuilder()
            .select("SUM(probability)", "total")
            .where({
              eventId,
              position: 2,
            })
            .getRawOne<{
              total: string;
            }>(),
          this.wslProjectionEventHeatOutcome
            .createQueryBuilder()
            .select([`"roundHeatId"`, "SUM(probability) as total"])
            .where({
              eventId,
            })
            .groupBy(`"roundHeatId"`)
            .getRawMany<{
              roundHeatId: string;
              total: string;
            }>(),
          this.wslProjectionEventShows
            .createQueryBuilder()
            .select("SUM(probability)", "total")
            .where({
              eventId,
            })
            .getRawOne<{
              total: string;
            }>(),
          this.wslProjectionEventPodiums
            .createQueryBuilder()
            .select("SUM(probability)", "total")
            .where({
              eventId,
            })
            .getRawOne<{
              total: string;
            }>(),
          this.wslPlayerHeadToHead
            .createQueryBuilder()
            .select(["id", `"holdingPercentage" as total`])
            .where({
              eventId,
            })
            .getRawMany<{
              id: string;
              total: string;
            }>(),
        ]);

        const winnerHoldingPercentage: number =
          +winnerHoldPercentage?.total && +winnerHoldPercentage?.total >= DEFAULT_HOLD_PERCENTAGE
            ? Math.round(+winnerHoldPercentage.total)
            : DEFAULT_HOLD_PERCENTAGE;
        const secondHoldingPercentage: number =
          +secondHoldPercentage?.total && +secondHoldPercentage?.total >= DEFAULT_HOLD_PERCENTAGE
            ? Math.round(+secondHoldPercentage.total)
            : DEFAULT_HOLD_PERCENTAGE;
        const showHoldingPercentage: number =
          +showHoldPercentage?.total && +showHoldPercentage?.total >= SHOWS_HOLD_PERCENTAGE
            ? Math.round(+showHoldPercentage.total)
            : SHOWS_HOLD_PERCENTAGE;
        const podiumHoldingPercentage: number =
          +podiumHoldPercentage?.total && +podiumHoldPercentage?.total >= PODIUM_HOLD_PERCENTAGE
            ? Math.round(+podiumHoldPercentage.total)
            : PODIUM_HOLD_PERCENTAGE;

        const simEventPayload: WSLProjectionEventOutcome[] = [
          ...simPayload.winners.map((winner) => {
            const probability = probabilityHelpers.computeProbability(
              winner.probability,
              winnerHoldingPercentage,
              DEFAULT_HOLD_PERCENTAGE,
            );

            return this.wslProjectionEventOutcome.create({
              eventId,
              eventParticipantId: winner.eventParticipantId,
              position: 1,
              odds: probabilityHelpers.getDecimalOddsFromProbability(probability),
              probability,
              trueProbability: winner.probability,
              hasModifiedProbability: false,
            });
          }),
          ...simPayload.second.map((second) => {
            const probability = probabilityHelpers.computeProbability(
              second.probability,
              secondHoldingPercentage,
              DEFAULT_HOLD_PERCENTAGE,
            );

            return this.wslProjectionEventOutcome.create({
              eventId,
              eventParticipantId: second.eventParticipantId,
              position: 2,
              odds: probabilityHelpers.getDecimalOddsFromProbability(probability),
              probability,
              trueProbability: second.probability,
              hasModifiedProbability: false,
            });
          }),
        ];

        const showPodiumPayload: showPodiumItem[] = [
          ...simPayload.winners.map((row) => ({
            position: 1,
            count: row.count,
            eventParticipantId: row.eventParticipantId,
          })),
          ...simPayload.second.map((row) => ({
            position: 2,
            count: row.count,
            eventParticipantId: row.eventParticipantId,
          })),
          ...simPayload.third.map((row) => ({
            position: 3,
            count: row.count,
            eventParticipantId: row.eventParticipantId,
          })),
        ];

        const groupedParticipantPlayers: {
          [key: string]: showPodiumItem[];
        } = groupBy(showPodiumPayload, "eventParticipantId");

        const simShowsPayload: WSLProjectionEventShows[] = [];
        const simPodiumsPayload: WSLProjectionEventPodiums[] = [];

        Object.values(groupedParticipantPlayers).map((rows) => {
          const itemRow = rows[0];

          const showsCount: number = rows
            .filter((row) => [1, 2].includes(row.position))
            .reduce((total, item) => total + item.count, 0);
          const podiumCount: number = rows
            .filter((row) => [1, 2, 3].includes(row.position))
            .reduce((total, item) => total + item.count, 0);

          const showProbability: number = probabilityHelpers.getProbability(
            showsCount,
            simPayload.totalSimRuns,
          );
          const showOdds: number = probabilityHelpers.getDecimalOdds(
            showsCount,
            simPayload.totalSimRuns,
          );
          const podiumProbability: number = probabilityHelpers.getProbability(
            podiumCount,
            simPayload.totalSimRuns,
          );
          const podiumOdds: number = probabilityHelpers.getDecimalOdds(
            podiumCount,
            simPayload.totalSimRuns,
          );

          simShowsPayload.push(
            this.wslProjectionEventShows.create({
              eventId,
              eventParticipantId: itemRow.eventParticipantId,
              odds: showOdds,
              probability: showProbability,
              trueProbability: showProbability,
              hasModifiedProbability: false,
            }),
          );

          simPodiumsPayload.push(
            this.wslProjectionEventPodiums.create({
              eventId,
              eventParticipantId: itemRow.eventParticipantId,
              odds: podiumOdds,
              probability: podiumProbability,
              trueProbability: podiumProbability,
              hasModifiedProbability: false,
            }),
          );
        });

        const parsedSimShowsPayload: WSLProjectionEventShows[] = simShowsPayload.map((row) => {
          const probability = probabilityHelpers.computeProbability(
            row.trueProbability,
            showHoldingPercentage,
            SHOWS_HOLD_PERCENTAGE,
          );

          return {
            ...row,
            odds: probabilityHelpers.getDecimalOddsFromProbability(probability),
            probability,
            trueProbability: row.probability,
          };
        });

        const parsedSimPodiumsPayload: WSLProjectionEventPodiums[] = simPodiumsPayload.map(
          (row) => {
            const probability = probabilityHelpers.computeProbability(
              row.trueProbability,
              podiumHoldingPercentage,
              PODIUM_HOLD_PERCENTAGE,
            );

            return {
              ...row,
              odds: probabilityHelpers.getDecimalOddsFromProbability(probability),
              probability,
              trueProbability: row.probability,
            };
          },
        );

        // FIXME: currently not checking for heat open or event open
        // because the sim is only running on the last heat of each round
        // fetch the event and fetch the heats
        // make a check to ensure that the market is still open for both in order to update it
        // const [event, heats] = await Promise.all([
        //   this.wslEventsRepo.findOne({
        //     where: {
        //       id: eventId,
        //       isEventWinnerMarketOpen: true,
        //     },
        //     select: {
        //       id: true,
        //       isEventWinnerMarketOpen: true,
        //     },
        //   }),
        //   this.wslRoundHeatsRepo.find({
        //     where: {
        //       eventId,
        //       isHeatWinnerMarketOpen: true,
        //     },
        //     select: {
        //       id: true,
        //       isHeatWinnerMarketOpen: true,
        //     },
        //   }),
        // ]);
        // const heatIds = heats.map((item) => item.id);

        const simEventHeatPayload: WSLProjectionEventHeatOutcome[] = simPayload.heats
          // .filter((item) => heatIds.includes(item.roundHeatId))
          .map((item) => {
            const heatHoldPercentageRow = heatHoldPercentages.find(
              (row) => row.roundHeatId === item.roundHeatId,
            );

            const holdingPercentage: number =
              heatHoldPercentageRow?.total &&
              +heatHoldPercentageRow?.total >= DEFAULT_HOLD_PERCENTAGE
                ? Math.round(+heatHoldPercentageRow.total)
                : DEFAULT_HOLD_PERCENTAGE;

            const probability = probabilityHelpers.computeProbability(
              item.probability,
              holdingPercentage,
              DEFAULT_HOLD_PERCENTAGE,
            );

            return this.wslProjectionEventHeatOutcome.create({
              ...item,
              odds: probabilityHelpers.getDecimalOddsFromProbability(probability),
              probability,
              trueProbability: item.probability,
              hasModifiedProbability: false,
            });
          });

        await this.wslProjectionEventOutcome.manager.transaction(
          async (transactionalEntityManager: EntityManager) => {
            // if (simEventPayload.length && event?.isEventWinnerMarketOpen) {
            if (simEventPayload.length) {
              await transactionalEntityManager.delete(WSLProjectionEventOutcome, {
                eventId,
              });
              await transactionalEntityManager.delete(WSLProjectionEventShows, {
                eventId,
              });
              await transactionalEntityManager.delete(WSLProjectionEventPodiums, {
                eventId,
              });
              await transactionalEntityManager.save(WSLProjectionEventOutcome, simEventPayload);
              await transactionalEntityManager.save(
                WSLProjectionEventPodiums,
                parsedSimPodiumsPayload,
              );
              await transactionalEntityManager.save(WSLProjectionEventShows, parsedSimShowsPayload);
              // at the same time clear previously archived event participants
              // await transactionalEntityManager.delete(WSLEventParticipants, {
              //   eventId,
              //   isActive: false,
              //   isArchived: true,
              // });
            }

            const modifiedRoundHeatIds = simEventHeatPayload.map((item) => item.roundHeatId);
            if (simEventHeatPayload.length) {
              await transactionalEntityManager.delete(WSLProjectionEventHeatOutcome, {
                eventId,
                roundHeatId: In(modifiedRoundHeatIds),
              });
              await transactionalEntityManager.save(
                WSLProjectionEventHeatOutcome,
                simEventHeatPayload,
              );
            }

            if (simPayload.bets?.headToHead?.length) {
              await Promise.all(
                simPayload.bets.headToHead.map(async (headToHeadItem) => {
                  const headToHeadHoldPercentageRow = headToHeadHoldPercentages.find(
                    (row) => row.id === headToHeadItem.id,
                  );
                  const holdingPercentage: number =
                    headToHeadHoldPercentageRow?.total &&
                    +headToHeadHoldPercentageRow?.total >= DEFAULT_HOLD_PERCENTAGE
                      ? Math.round(+headToHeadHoldPercentageRow.total)
                      : DEFAULT_HOLD_PERCENTAGE;

                  const player1Probability = probabilityHelpers.computeProbability(
                    headToHeadItem.player1Probability,
                    holdingPercentage,
                    DEFAULT_HOLD_PERCENTAGE,
                  );
                  const player2Probability = probabilityHelpers.computeProbability(
                    headToHeadItem.player2Probability,
                    holdingPercentage,
                    DEFAULT_HOLD_PERCENTAGE,
                  );

                  return transactionalEntityManager.update(
                    WSLPlayerHeadToHeads,
                    {
                      id: headToHeadItem.id,
                      eventParticipantWinnerId: IsNull(),
                    },
                    {
                      player1Odds:
                        probabilityHelpers.getDecimalOddsFromProbability(player1Probability),
                      player2Odds:
                        probabilityHelpers.getDecimalOddsFromProbability(player2Probability),
                      player1Probability,
                      player2Probability,
                      player1TrueProbability: headToHeadItem.player1Probability,
                      player2TrueProbability: headToHeadItem.player2Probability,
                      holdingPercentage,
                      player1HasModifiedProbability: false,
                      player2HasModifiedProbability: false,
                    },
                  );
                }),
              );
            }
          },
        );

        break;

      case SimRunTypes.HEAT:
        break;

      default:
        break;
    }

    return true;
  }

  private async processNrxResult(
    eventId: string,
    simPayload: IOdds,
    simRunType: SimRunTypes,
  ): Promise<boolean> {
    switch (simRunType) {
      case SimRunTypes.EVENT:
        const [
          winnerHoldPercentage,
          secondHoldPercentage,
          heatHoldPercentages,
          showHoldPercentage,
          podiumHoldPercentage,
          headToHeadHoldPercentages,
        ] = await Promise.all([
          this.nrxProjectionEventOutcome
            .createQueryBuilder()
            .select("SUM(probability)", "total")
            .where({
              eventId,
              position: 1,
            })
            .getRawOne<{
              total: string;
            }>(),
          this.nrxProjectionEventOutcome
            .createQueryBuilder()
            .select("SUM(probability)", "total")
            .where({
              eventId,
              position: 2,
            })
            .getRawOne<{
              total: string;
            }>(),
          this.nrxProjectionEventHeatOutcome
            .createQueryBuilder()
            .select([`"roundHeatId"`, "SUM(probability) as total"])
            .where({
              eventId,
            })
            .groupBy(`"roundHeatId"`)
            .getRawMany<{
              roundHeatId: string;
              total: string;
            }>(),
          this.nrxProjectionEventShows
            .createQueryBuilder()
            .select("SUM(probability)", "total")
            .where({
              eventId,
            })
            .getRawOne<{
              total: string;
            }>(),
          this.nrxProjectionEventPodiums
            .createQueryBuilder()
            .select("SUM(probability)", "total")
            .where({
              eventId,
            })
            .getRawOne<{
              total: string;
            }>(),
          this.nrxPlayerHeadToHead
            .createQueryBuilder()
            .select(["id", `"holdingPercentage" as total`])
            .where({
              eventId,
            })
            .getRawMany<{
              id: string;
              total: string;
            }>(),
        ]);

        const winnerHoldingPercentage: number =
          +winnerHoldPercentage?.total && +winnerHoldPercentage?.total >= DEFAULT_HOLD_PERCENTAGE
            ? Math.round(+winnerHoldPercentage.total)
            : DEFAULT_HOLD_PERCENTAGE;
        const secondHoldingPercentage: number =
          +secondHoldPercentage?.total && +secondHoldPercentage?.total >= DEFAULT_HOLD_PERCENTAGE
            ? Math.round(+secondHoldPercentage.total)
            : DEFAULT_HOLD_PERCENTAGE;
        const showHoldingPercentage: number =
          +showHoldPercentage?.total && +showHoldPercentage?.total >= SHOWS_HOLD_PERCENTAGE
            ? Math.round(+showHoldPercentage.total)
            : SHOWS_HOLD_PERCENTAGE;
        const podiumHoldingPercentage: number =
          +podiumHoldPercentage?.total && +podiumHoldPercentage?.total >= PODIUM_HOLD_PERCENTAGE
            ? Math.round(+podiumHoldPercentage.total)
            : PODIUM_HOLD_PERCENTAGE;

        const simEventPayload: NRXProjectionEventOutcome[] = [
          ...simPayload.winners.map((winner) => {
            const probability = probabilityHelpers.computeProbability(
              winner.probability,
              winnerHoldingPercentage,
              DEFAULT_HOLD_PERCENTAGE,
            );

            return this.nrxProjectionEventOutcome.create({
              eventId,
              eventParticipantId: winner.eventParticipantId,
              position: 1,
              odds: probabilityHelpers.getDecimalOddsFromProbability(probability),
              probability,
              trueProbability: winner.probability,
              hasModifiedProbability: false,
            });
          }),
          ...simPayload.second.map((second) => {
            const probability = probabilityHelpers.computeProbability(
              second.probability,
              secondHoldingPercentage,
              DEFAULT_HOLD_PERCENTAGE,
            );

            return this.nrxProjectionEventOutcome.create({
              eventId,
              eventParticipantId: second.eventParticipantId,
              position: 2,
              odds: probabilityHelpers.getDecimalOddsFromProbability(probability),
              probability,
              trueProbability: second.probability,
              hasModifiedProbability: false,
            });
          }),
        ];

        const showPodiumPayload: showPodiumItem[] = [
          ...simPayload.winners.map((row) => ({
            position: 1,
            count: row.count,
            eventParticipantId: row.eventParticipantId,
          })),
          ...simPayload.second.map((row) => ({
            position: 2,
            count: row.count,
            eventParticipantId: row.eventParticipantId,
          })),
          ...simPayload.third.map((row) => ({
            position: 3,
            count: row.count,
            eventParticipantId: row.eventParticipantId,
          })),
        ];

        const groupedParticipantPlayers: {
          [key: string]: showPodiumItem[];
        } = groupBy(showPodiumPayload, "eventParticipantId");

        const simShowsPayload: NRXProjectionEventShows[] = [];
        const simPodiumsPayload: NRXProjectionEventPodiums[] = [];

        Object.values(groupedParticipantPlayers).map((rows) => {
          const itemRow = rows[0];

          const showsCount: number = rows
            .filter((row) => [1, 2].includes(row.position))
            .reduce((total, item) => total + item.count, 0);
          const podiumCount: number = rows
            .filter((row) => [1, 2, 3].includes(row.position))
            .reduce((total, item) => total + item.count, 0);

          const showProbability: number = probabilityHelpers.getProbability(
            showsCount,
            simPayload.totalSimRuns,
          );
          const showOdds: number = probabilityHelpers.getDecimalOdds(
            showsCount,
            simPayload.totalSimRuns,
          );
          const podiumProbability: number = probabilityHelpers.getProbability(
            podiumCount,
            simPayload.totalSimRuns,
          );
          const podiumOdds: number = probabilityHelpers.getDecimalOdds(
            podiumCount,
            simPayload.totalSimRuns,
          );

          simShowsPayload.push(
            this.nrxProjectionEventShows.create({
              eventId,
              eventParticipantId: itemRow.eventParticipantId,
              odds: showOdds,
              probability: showProbability,
              trueProbability: showProbability,
              hasModifiedProbability: false,
            }),
          );

          simPodiumsPayload.push(
            this.nrxProjectionEventPodiums.create({
              eventId,
              eventParticipantId: itemRow.eventParticipantId,
              odds: podiumOdds,
              probability: podiumProbability,
              trueProbability: podiumProbability,
              hasModifiedProbability: false,
            }),
          );
        });

        const parsedSimShowsPayload: NRXProjectionEventShows[] = simShowsPayload.map((row) => {
          const probability = probabilityHelpers.computeProbability(
            row.trueProbability,
            showHoldingPercentage,
            SHOWS_HOLD_PERCENTAGE,
          );

          return {
            ...row,
            odds: probabilityHelpers.getDecimalOddsFromProbability(probability),
            probability,
            trueProbability: row.probability,
          };
        });

        const parsedSimPodiumsPayload: NRXProjectionEventPodiums[] = simPodiumsPayload.map(
          (row) => {
            const probability = probabilityHelpers.computeProbability(
              row.trueProbability,
              podiumHoldingPercentage,
              PODIUM_HOLD_PERCENTAGE,
            );

            return {
              ...row,
              odds: probabilityHelpers.getDecimalOddsFromProbability(probability),
              probability,
              trueProbability: row.probability,
            };
          },
        );

        // fetch the event and fetch the heats
        // make a check to ensure that the market is still open for both in order to update it
        const [event, heats] = await Promise.all([
          this.nrxEventsRepo.findOne({
            where: {
              id: eventId,
              isEventWinnerMarketOpen: true,
            },
            select: {
              id: true,
              isEventWinnerMarketOpen: true,
            },
          }),
          this.nrxRoundHeats.find({
            where: {
              eventId,
              isHeatWinnerMarketOpen: true,
            },
            select: {
              id: true,
              isHeatWinnerMarketOpen: true,
            },
          }),
        ]);
        const heatIds = heats.map((item) => item.id);

        const simEventHeatPayload: NRXProjectionEventHeatOutcome[] = simPayload.heats
          .filter((item) => heatIds.includes(item.roundHeatId))
          .map((item) => {
            const heatHoldPercentageRow = heatHoldPercentages.find(
              (row) => row.roundHeatId === item.roundHeatId,
            );
            const holdingPercentage: number =
              heatHoldPercentageRow?.total &&
              +heatHoldPercentageRow?.total >= DEFAULT_HOLD_PERCENTAGE
                ? Math.round(+heatHoldPercentageRow.total)
                : DEFAULT_HOLD_PERCENTAGE;

            const probability = probabilityHelpers.computeProbability(
              item.probability,
              holdingPercentage,
              DEFAULT_HOLD_PERCENTAGE,
            );

            return this.nrxProjectionEventHeatOutcome.create({
              ...item,
              odds: probabilityHelpers.getDecimalOddsFromProbability(probability),
              probability,
              trueProbability: item.probability,
              hasModifiedProbability: false,
            });
          });

        await this.nrxProjectionEventOutcome.manager.transaction(
          async (transactionalEntityManager: EntityManager) => {
            if (simEventPayload.length && event?.isEventWinnerMarketOpen) {
              await transactionalEntityManager.delete(NRXProjectionEventOutcome, {
                eventId,
              });
              await transactionalEntityManager.delete(NRXProjectionEventPodiums, {
                eventId,
              });
              await transactionalEntityManager.delete(NRXProjectionEventShows, {
                eventId,
              });
              await transactionalEntityManager.save(NRXProjectionEventOutcome, simEventPayload);
              await transactionalEntityManager.save(
                NRXProjectionEventPodiums,
                parsedSimPodiumsPayload,
              );
              await transactionalEntityManager.save(NRXProjectionEventShows, parsedSimShowsPayload);
              // at the same time clear previously archived event participants
              // await transactionalEntityManager.delete(NRXEventParticipants, {
              //   eventId,
              //   isActive: false,
              //   isArchived: true,
              // });
            }

            const modifiedRoundHeatIds = simEventHeatPayload.map((item) => item.roundHeatId);
            if (simEventHeatPayload.length) {
              await transactionalEntityManager.delete(NRXProjectionEventHeatOutcome, {
                eventId,
                roundHeatId: In(modifiedRoundHeatIds),
              });
              await transactionalEntityManager.save(
                NRXProjectionEventHeatOutcome,
                simEventHeatPayload,
              );
            }

            if (simPayload.bets?.headToHead?.length) {
              await Promise.all(
                simPayload.bets.headToHead.map(async (headToHeadItem) => {
                  const headToHeadHoldPercentageRow = headToHeadHoldPercentages.find(
                    (row) => row.id === headToHeadItem.id,
                  );
                  const holdingPercentage: number =
                    headToHeadHoldPercentageRow?.total &&
                    +headToHeadHoldPercentageRow?.total >= DEFAULT_HOLD_PERCENTAGE
                      ? Math.round(+headToHeadHoldPercentageRow.total)
                      : DEFAULT_HOLD_PERCENTAGE;

                  const player1Probability = probabilityHelpers.computeProbability(
                    headToHeadItem.player1Probability,
                    holdingPercentage,
                    DEFAULT_HOLD_PERCENTAGE,
                  );
                  const player2Probability = probabilityHelpers.computeProbability(
                    headToHeadItem.player2Probability,
                    holdingPercentage,
                    DEFAULT_HOLD_PERCENTAGE,
                  );

                  return transactionalEntityManager.update(
                    NRXPlayerHeadToHeads,
                    {
                      id: headToHeadItem.id,
                      eventParticipantWinnerId: IsNull(),
                    },
                    {
                      player1Odds:
                        probabilityHelpers.getDecimalOddsFromProbability(player1Probability),
                      player2Odds:
                        probabilityHelpers.getDecimalOddsFromProbability(player2Probability),
                      player1Probability,
                      player2Probability,
                      player1TrueProbability: headToHeadItem.player1Probability,
                      player2TrueProbability: headToHeadItem.player2Probability,
                      holdingPercentage,
                      player1HasModifiedProbability: false,
                      player2HasModifiedProbability: false,
                    },
                  );
                }),
              );
            }
          },
        );

        break;

      case SimRunTypes.HEAT:
        break;

      default:
        break;
    }

    return true;
  }

  private async wrapError(error: Error, payload?: any) {
    try {
      await this.slackService.dumpLog({
        title: "Queue Event Unable to process",
        payload,
        stack: error,
      });
    } catch (err) {
      console.error("🚀 ~ file: queue.service.ts:1847 ~ wrapError ~ err:", err);
    }
  }
}

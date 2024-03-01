import { HttpStatus } from "@nestjs/common";

import {
  Environment,
  NodeEnvironment,
  Queues,
  SportsTypes,
  SimRunTypes,
  Gender,
  QueueCronType,
  OddMarkets,
} from "../constants/system";

import { IOdds, IRounds } from "./simulation";

export interface IException {
  response: IExceptionPayload;
  status: HttpStatus;

  initMessage(): void;
  initName(): void;
  getResponse(): string | object;
  getStatus(): number;
  createBody(objectOrError: object | string, description?: string, statusCode?: number): object;
}

export interface IExceptionPayload {
  message: string;
  stack?: any;
  data?: any;
  metadata?: any;
}

export interface ISlackHooks {
  deployment: string;
  genericLogging: string;
}

export interface ITwilio {
  accountSid: string;
  accountAuthToken: string;
  genericAuthServiceId: string;
  genericMessagingServiceId: string;
}

export interface IPusher {
  appKey: string;
  cluster: string;
  channel: string;
  wsHost: string;
  wsPort: number;
}

interface IAWSCredentials {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
}

interface IAwsServices {
  sqs: IAWSCredentials;
}

interface IClient {
  host: string;
}

interface OClient {
  clientId: string;
  secretKey: string;
  proxyApiKey: string;
}

export interface ISystemConfig {
  database: IDatabase;
  firebase: IFirebase;
  environment: Environment;
  nodeEnvironment: NodeEnvironment;
  slack: ISlackHooks;
  twilio: ITwilio;
  jaiAlaiPusher: IPusher;
  jaiAlaiApiKey: string;
  jaiOddsOutputApiBaseUrl: string;
  jwtAuthSecret: string;
  maslApiKey: string;
  wslClientId: string;
  wslClientSecret: string;
  aws: IAwsServices;
  appPort: number;
  appVersion: string;
  apiHost: string;

  googleCaptchaSecret: string;

  client: IClient;
  openBetClient: OClient;
  isDevelop: boolean;
  isStaging: boolean;
  isRelease: boolean;
  isProdCompiled: boolean;
}

export interface IDatabase {
  host: string;
  port: number;
  user: string;
  password: string;
  name: string;
}

export interface IFirebase {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
}

export interface IGenericStringKeyValue {
  [key: string]: string;
}

export interface IQueueValue {
  url: string;
  isDlq: boolean;
  key: Queues;
}

export interface IQueueUrl {
  [Queues.SIM_TASKS]: IQueueValue;
  [Queues.DEAD_SIM_TASKS]: IQueueValue;
  [Queues.SIM_TASK_RESPONSES]: IQueueValue;
  [Queues.DEAD_SIM_TASK_RESPONSES]: IQueueValue;
  [Queues.TASKS]: IQueueValue;
  [Queues.DEAD_TASKS]: IQueueValue;
  [Queues.CRON]: IQueueValue;
  [Queues.DEAD_CRON]: IQueueValue;
}

export interface IQueueMessageBody {
  messageType: string;
  queueType: string;
}

export interface IQueuePayload<T extends IQueueMessageBody> {
  messageBody: T;
  deduplicationId?: string;
  delaySeconds?: number;
}

export interface IQueueRequestParams {
  delaySeconds?: number;
}

export interface IProcessSim extends IQueueRequestParams {
  isPostCut?: boolean;
  eventId: string;
  gender: Gender;
  sportType: SportsTypes;
  simRunType: SimRunTypes;
  rounds?: IRounds[];
  homeTeamId?: string;
  awayTeamId?: string;
  triggerType?: OddMarkets;
  triggerIds?: string[];
}

export interface IProcessSimBody extends IProcessSim, IQueueMessageBody {}
export interface IProcessSimResponseBody extends IQueueMessageBody, IOdds {
  eventId: string;
  sportType: SportsTypes;
  simRunType: SimRunTypes;
}

export interface IProcessEvent extends IQueueRequestParams {
  eventId: string;
  sportType: SportsTypes;
  triggerType?: OddMarkets;
  triggerIds?: string[];
}
export interface IProcessEventBody extends IProcessEvent, IQueueMessageBody {}

export interface ICronResponseBody extends IQueueMessageBody {
  cronType: QueueCronType;
}

export interface IProcessMarketNotification extends IQueueRequestParams {
  eventId?: string;
  futureId?: string;
  roundHeatId?: string;
  sportType: SportsTypes;
  market: OddMarkets;
}
export interface IProcessMarketNotificationBody extends IQueueMessageBody {
  eventId?: string;
  futureId?: string;
  roundHeatId?: string;
  sportType: SportsTypes;
  market: OddMarkets;
}

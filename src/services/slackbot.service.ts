import { Injectable } from "@nestjs/common";
import { SQS } from "aws-sdk";

import { IResultsPublish, IResult, ITask } from "../interfaces/slackbot";

import { SportsTypes, Environment } from "../constants/system";
import { TASK_TYPE } from "../constants/slackbot";

import { ConfigService } from "@nestjs/config";

@Injectable()
export default class SlackbotService {
  private sqs: SQS = null;
  private queueUrl: string;

  constructor(private configService: ConfigService) {
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

    const slackbotQueue = await this.sqs
      .getQueueUrl({
        QueueName:
          environment === Environment.Release
            ? "live_slackbot_odds_events"
            : "dev_slackbot_odds_events",
      })
      .promise();

    if (slackbotQueue?.QueueUrl) this.queueUrl = slackbotQueue.QueueUrl;
  }

  isAllowed(): boolean {
    const isDevelop: boolean = this.configService.get<boolean>("isDevelop");
    const isRelease: boolean = this.configService.get<boolean>("isRelease");

    return isRelease || isDevelop;
  }

  async publishResultsNotification(payload: IResult, sportType: SportsTypes) {
    const slackPayload: IResultsPublish<IResult> = {
      sportType,
      taskType: TASK_TYPE.RESULTS_PUBLISH,
      payload,
    };

    if (this.isAllowed()) await this.publishNotification(slackPayload);

    return slackPayload;
  }

  private async publishNotification<T extends ITask>(payload: T) {
    const result = await this.sqs
      .sendMessage({
        MessageBody: JSON.stringify(payload),
        QueueUrl: this.queueUrl,
      })
      .promise();

    return {
      messageId: result.MessageId,
    };
  }
}

import { Injectable } from "@nestjs/common";
import axios from "axios";

import { ConfigService } from "@nestjs/config";

@Injectable()
export default class SlackService {
  constructor(private configService: ConfigService) {}

  isAllowed(): boolean {
    const isDevelop: boolean = this.configService.get<boolean>("isDevelop");
    const isStaging: boolean = this.configService.get<boolean>("isStaging");
    const isRelease: boolean = this.configService.get<boolean>("isRelease");

    return isRelease || isStaging || isDevelop;
  }

  async notifyDeployment(title: string) {
    if (!this.isAllowed()) return false;

    const appVersion: string = this.configService.get<string>("appVersion");
    const environment: string = this.configService.get<string>("environment");

    const messageBody = {
      text: title,
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: title,
          },
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: "*Version*",
            },
            {
              type: "mrkdwn",
              text: "*Environment*",
            },
            {
              type: "plain_text",
              text: appVersion,
            },
            {
              type: "plain_text",
              text: environment,
            },
            {
              type: "mrkdwn",
              text: "*App*",
            },
            {
              type: "mrkdwn",
              text: "*Type*",
            },
            {
              type: "plain_text",
              text: "Altsports",
            },
            {
              type: "plain_text",
              text: "API",
            },
          ],
        },
      ],
    };

    const slackNotificationUrl: string = this.configService.get<string>("slack.deployment");

    await axios.post(slackNotificationUrl, messageBody);

    return true;
  }

  async dumpLog({ title, payload, stack }: { title: string; payload?: object; stack?: object }) {
    if (!this.isAllowed()) return false;

    const appVersion: string = this.configService.get<string>("appVersion");
    const environment: string = this.configService.get<string>("environment");

    const messageBody = {
      attachments: [
        {
          title,
          fields: [
            {
              title: "payload",
              value: JSON.stringify(payload),
              short: false,
            },
            {
              title: "stack",
              value: JSON.stringify(stack),
              short: false,
            },
            {
              title: "environment",
              value: environment,
              short: true,
            },
            {
              title: "version",
              value: appVersion,
              short: true,
            },
          ],
          ts: new Date().getTime() / 1000,
        },
      ],
    };

    const slackNotificationUrl: string = this.configService.get<string>("slack.genericLogging");

    await axios.post(slackNotificationUrl, messageBody);

    return true;
  }
}

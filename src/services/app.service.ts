import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
  BeforeApplicationShutdown,
} from "@nestjs/common";

import SlackService from "./slack.service";

@Injectable()
export default class AppService
  implements OnApplicationBootstrap, OnApplicationShutdown, BeforeApplicationShutdown
{
  constructor(private slackService: SlackService) {}

  async onApplicationBootstrap() {
    // eslint-disable-next-line no-console
    await this.slackService.notifyDeployment("App Internal Init");
  }

  async beforeApplicationShutdown(signal?: string) {
    // eslint-disable-next-line no-console
    console.info("called => beforeApplicationShutdown", signal);
    await this.slackService.notifyDeployment("App Internal Queue Destroy");
  }

  async onApplicationShutdown(signal?: string) {
    // eslint-disable-next-line no-console
    console.info("called => onApplicationShutdown", signal);
    await this.slackService.notifyDeployment("App Internal Destroy");
  }
}

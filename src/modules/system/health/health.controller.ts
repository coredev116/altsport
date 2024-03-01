import { Controller, Get } from "@nestjs/common";
import { HealthCheckService, HealthCheck, TypeOrmHealthIndicator } from "@nestjs/terminus";
import { ConfigService } from "@nestjs/config";

import WSLService from "../sync/wsl/sync.wsl.service";
import OpenbetAPIService from "../../../services/openbet-api.service";

// import NotificationService from "../notifications/notifications.service";

// import { SportsTypes, OddMarkets } from "../../../constants/system";

@Controller({
  path: "health",
})
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private configService: ConfigService,
    private wslService: WSLService,
    private openbetAPIService: OpenbetAPIService, // private notificationService: NotificationService,
  ) {}

  @Get()
  @HealthCheck()
  async check() {
    const appVersion: string = this.configService.get<string>("appVersion");

    const { status, error } = await this.health.check([
      async () =>
        this.db.pingCheck("default", {
          timeout: 5_000,
        }),
    ]);

    return {
      status,
      error,
      version: appVersion,
    };
  }

  @Get("wsl/test")
  async checkWSL() {
    if (!this.isAllowed()) return false;

    // await this.notificationService.notifyOddsPublished(
    //   SportsTypes.SURFING,
    //   OddMarkets.HEAT_PROJECTIONS,
    //   null,
    //   "794e113a-995d-4bc3-9f8a-0285ecbc09cc",
    //   null,
    // );

    return this.wslService.syncLiveUpcomingEvents();
  }

  @Get("openbet/heartbeat")
  @HealthCheck()
  async checkopenbetHeartbeat() {
    if (!this.isAllowed()) return false;

    const response = await this.openbetAPIService.heartbeat();

    return {
      response,
    };
  }

  isAllowed(): boolean {
    const isDevelop: boolean = this.configService.get<boolean>("isDevelop");
    const isStaging: boolean = this.configService.get<boolean>("isStaging");
    const isRelease: boolean = this.configService.get<boolean>("isRelease");

    return !(isRelease || isDevelop || isStaging);
  }
}

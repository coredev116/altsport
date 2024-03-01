import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";

import { HealthController } from "./health.controller";

import WSLModule from "../sync/wsl/sync.wsl.module";
import NotificationModule from "../notifications/notifications.module";

import OpenbetAPIService from "../../../services/openbet-api.service";

@Module({
  imports: [TerminusModule, WSLModule, NotificationModule],
  controllers: [HealthController],
  providers: [OpenbetAPIService],
})
export default class HealthModule {}

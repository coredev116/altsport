import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { MarketNotificationsController } from "./market.notifications.controller";

import ClientMarketNotifications from "../../../../entities/clientMarketNotifications.entity";
import OddMarkets from "../../../../entities/oddMarkets.entity";

import { MarketNotificationsService } from "./market.notifications.service";

@Module({
  imports: [TypeOrmModule.forFeature([ClientMarketNotifications, OddMarkets])],
  controllers: [MarketNotificationsController],
  providers: [MarketNotificationsService],
})
export default class ClientNotificationSettingsModule {}

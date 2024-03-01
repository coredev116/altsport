import { Module } from "@nestjs/common";

import MarketNotificationsModule from "./marketNotifications/market.notifications.module";

@Module({
  imports: [MarketNotificationsModule],
  providers: [],
  controllers: [],
})
export default class ClientSettingsModule {}

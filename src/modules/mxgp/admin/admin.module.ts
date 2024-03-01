import { Module } from "@nestjs/common";

import TradersModule from "./traders/traders.module";
import OddsModule from "./odds/odds.module";
import EventsModule from "./events/events.module";

@Module({
  imports: [OddsModule, EventsModule, TradersModule],
  providers: [],
  controllers: [],
})
export default class AdminModule {}

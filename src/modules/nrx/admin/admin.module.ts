import { Module } from "@nestjs/common";

import TourModule from "./tours/tours.module";
import EventModule from "./events/events.module";
import RoundModule from "./rounds/rounds.module";
import HeatModule from "./heats/heats.module";
import TraderModule from "./traders/traders.module";
import OddsModule from "./odds/odds.module";
import ResultModule from "./results/results.module";

@Module({
  imports: [
    TourModule,
    EventModule,
    RoundModule,
    HeatModule,
    TraderModule,
    OddsModule,
    ResultModule,
  ],
  providers: [],
  controllers: [],
})
export default class AdminModule {}

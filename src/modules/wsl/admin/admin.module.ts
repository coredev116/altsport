import { Module } from "@nestjs/common";

// import AthleteModule from "./athletes/athletes.module";
import EventModule from "./events/events.module";
import HeatModule from "./heats/heats.module";
import OddsModule from "./odds/odds.module";
import ResultModule from "./results/results.module";
import RoundModule from "./rounds/rounds.module";
import TourModule from "./tours/tours.module";
import TraderModule from "./traders/traders.module";

@Module({
  imports: [
    // AthleteModule,
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

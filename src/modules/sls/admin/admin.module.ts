import { Module } from "@nestjs/common";

// import AthleteModule from "./athlete/athlete.module";
import LeaguesModule from "./leagues/leagues.module";
import EventModule from "./events/events.module";
import RoundModule from "./rounds/rounds.module";
import HeatsModule from "./heats/heats.module";
import TraderModule from "./traders/traders.module";
import OddsModule from "./odds/odds.module";
import ResultModule from "./results/results.module";

@Module({
  imports: [
    // AthleteModule,
    EventModule,
    LeaguesModule,
    RoundModule,
    HeatsModule,
    TraderModule,
    OddsModule,
    ResultModule,
  ],
  providers: [],
  controllers: [],
})
export default class SLSAdminModule {}

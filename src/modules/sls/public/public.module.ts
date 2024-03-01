import { Module } from "@nestjs/common";

import AthleteModule from "./athletes/athletes.module";
import LeagueModule from "./leagues/leagues.module";
import EventModule from "./events/events.module";
import OddsModule from "./odds/odds.module";
import ResultModule from "./result/results.module";

@Module({
  imports: [AthleteModule, LeagueModule, EventModule, OddsModule, ResultModule],
  providers: [],
  controllers: [],
})
export default class PublicModule {}

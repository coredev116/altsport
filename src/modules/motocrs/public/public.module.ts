import { Module } from "@nestjs/common";

import AthleteModule from "./athletes/athletes.module";
import TourModule from "./tours/tours.module";
import EventModule from "./events/events.module";

@Module({
  imports: [AthleteModule, TourModule, EventModule],
  providers: [],
  controllers: [],
})
export default class PublicModule {}

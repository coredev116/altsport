import { Module } from "@nestjs/common";

import EventsModule from "./events/events.module";

@Module({
  imports: [EventsModule],
  providers: [],
  controllers: [],
})
export default class PublicModule {}

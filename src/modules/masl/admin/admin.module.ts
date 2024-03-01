import { Module } from "@nestjs/common";

import TraderModule from "./traders/traders.module";
import EventModule from "./events/events.module";

@Module({
  imports: [TraderModule, EventModule],
  providers: [],
  controllers: [],
})
export default class AdminModule {}

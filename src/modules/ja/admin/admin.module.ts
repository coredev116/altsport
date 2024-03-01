import { Module } from "@nestjs/common";

import TraderModule from "./traders/traders.module";
import EventModule from "./events/events.module";
import SocketModule from "./socket/sockets.module";

@Module({
  imports: [TraderModule, EventModule, SocketModule],
  providers: [],
  controllers: [],
})
export default class AdminModule {}

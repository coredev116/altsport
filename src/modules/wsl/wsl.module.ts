import { Module } from "@nestjs/common";

import AdminModule from "./admin/admin.module";
import MqModule from "./mq/mq.module";
import PublicModule from "./public/public.module";

@Module({
  imports: [AdminModule, PublicModule, MqModule],
  providers: [],
  controllers: [],
  exports: [AdminModule, PublicModule, MqModule],
})
export default class WSLModule {}

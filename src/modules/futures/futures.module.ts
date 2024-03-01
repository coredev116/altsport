import { Module } from "@nestjs/common";

import FuturesAdminModule from "./admin/admin.module";
import FuturesClientModule from "./client/client.module";

@Module({
  imports: [FuturesClientModule, FuturesAdminModule],
  providers: [],
  controllers: [],
})
export default class FuturesModule {}

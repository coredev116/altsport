import { Module } from "@nestjs/common";

import SPRAdminModule from "./admin/admin.module";
import PublicModule from "./public/public.module";

@Module({
  imports: [SPRAdminModule, PublicModule],
  providers: [],
  controllers: [],
})
export default class SPRModule {}

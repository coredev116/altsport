import { Module } from "@nestjs/common";

import WRXAdminModule from "./admin/admin.module";
import PublicModule from "./public/public.module";

@Module({
  imports: [WRXAdminModule, PublicModule],
  providers: [],
  controllers: [],
})
export default class WRXModule {}

import { Module } from "@nestjs/common";

import SLSAdminModule from "./admin/admin.module";
import SLSPublicModule from "./public/public.module";

@Module({
  imports: [SLSAdminModule, SLSPublicModule],
  providers: [],
  controllers: [],
})
export default class SLSModule {}

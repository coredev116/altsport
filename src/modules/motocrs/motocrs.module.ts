import { Module } from "@nestjs/common";

import MOTOCRSAdminModule from "./admin/admin.module";
import PublicModule from "./public/public.module";

@Module({
  imports: [MOTOCRSAdminModule, PublicModule],
  providers: [],
  controllers: [],
})
export default class MOTOCRSModule {}

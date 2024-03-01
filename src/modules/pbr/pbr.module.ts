import { Module } from "@nestjs/common";

import PBRAdminModule from "./admin/admin.module";

@Module({
  imports: [PBRAdminModule],
  providers: [],
  controllers: [],
})
export default class PBRModule {}

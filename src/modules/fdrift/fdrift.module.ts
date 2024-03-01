import { Module } from "@nestjs/common";

import FDRIFTAdminModule from "./admin/admin.module";

@Module({
  imports: [FDRIFTAdminModule],
  providers: [],
  controllers: [],
})
export default class FDRIFTModule {}

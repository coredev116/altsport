import { Module } from "@nestjs/common";

import MXGPAdminModule from "./admin/admin.module";

@Module({
  imports: [MXGPAdminModule],
  providers: [],
  controllers: [],
})
export default class MXGPModule {}

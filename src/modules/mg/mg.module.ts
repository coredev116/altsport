import { Module } from "@nestjs/common";

import MGAdminModule from "./admin/admin.module";

@Module({
  imports: [MGAdminModule],
  providers: [],
  controllers: [],
})
export default class MGModule {}

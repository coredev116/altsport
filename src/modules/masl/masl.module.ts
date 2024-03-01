import { Module } from "@nestjs/common";

import MASLAdminModule from "./admin/admin.module";

@Module({
  imports: [MASLAdminModule],
  providers: [],
  controllers: [],
})
export default class MASLModule {}

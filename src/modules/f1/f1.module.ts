import { Module } from "@nestjs/common";

import F1AdminModule from "./admin/admin.module";

@Module({
  imports: [F1AdminModule],
  providers: [],
  controllers: [],
})
export default class F1Module {}

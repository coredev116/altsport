import { Module } from "@nestjs/common";

import AdminModule from "./admin/sports.module";
import PublicModule from "./public/sports.module";

@Module({
  imports: [AdminModule, PublicModule],
  providers: [],
  controllers: [],
})
export default class SportsModule {}

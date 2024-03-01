import { Module } from "@nestjs/common";

import TraderModule from "./traders/traders.module";

@Module({
  imports: [TraderModule],
  providers: [],
  controllers: [],
})
export default class AdminModule {}

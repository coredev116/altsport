import { Module } from "@nestjs/common";
import OddsModule from "./odds/odds.module";

@Module({
  imports: [OddsModule],
  providers: [],
  controllers: [],
})
export default class JAClientModule {}

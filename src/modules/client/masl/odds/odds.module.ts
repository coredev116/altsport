import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import { OddsService } from "./odds.service";

import { OddsController } from "./odds.controller";

import Events from "../../../../entities/masl/events.entity";
import Odds from "../../../../entities/masl/odds.entity";
import EventRounds from "../../../../entities/masl/eventRounds.entity";
import Rounds from "../../../../entities/masl/rounds.entity";

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forFeature([Events, Odds, EventRounds, Rounds])],
  controllers: [OddsController],
  providers: [OddsService],
})
export default class OddsModule {}

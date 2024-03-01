import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import { OddsService } from "./odds.service";

import { OddsController } from "./odds.controller";

import Event from "../../../../entities/ja/events.entity";
import ClientOdds from "../../../../entities/ja/clientOdds.entity";
import Odds from "../../../../entities/ja/odds.entity";
import EventRounds from "../../../../entities/ja/eventRounds.entity";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Event, ClientOdds, Odds, EventRounds]),
  ],
  controllers: [OddsController],
  providers: [OddsService],
})
export default class OddsModule {}

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { CacheModule } from "@nestjs/cache-manager";

import CacheConfigService from "../../../../factory/cache.factory";

import TradersService from "./traders.service";

import TraderController from "./traders.controller";

import Events from "../../../../entities/ja/events.entity";
import Odds from "../../../../entities/ja/odds.entity";
import ClientOdds from "../../../../entities/ja/clientOdds.entity";
import EventRounds from "../../../../entities/ja/eventRounds.entity";

@Module({
  imports: [
    CacheModule.registerAsync({
      useClass: CacheConfigService,
    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Events, Odds, ClientOdds, EventRounds]),
  ],
  providers: [TradersService],
  controllers: [TraderController],
  exports: [TradersService],
})
export default class TraderModule {}

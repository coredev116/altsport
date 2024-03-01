import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { CacheModule } from "@nestjs/cache-manager";

import CacheConfigService from "../../../../factory/cache.factory";

import TradersService from "./traders.service";

import TraderController from "./traders.controller";

import Events from "../../../../entities/masl/events.entity";
import Rounds from "../../../../entities/masl/rounds.entity";
import EventRounds from "../../../../entities/masl/eventRounds.entity";
import EventTeams from "../../../../entities/masl/eventTeams.entity";
import Scores from "../../../../entities/masl/scores.entity";
import Odds from "../../../../entities/masl/odds.entity";

@Module({
  imports: [
    CacheModule.registerAsync({
      useClass: CacheConfigService,
    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Events, Rounds, EventRounds, Scores, EventTeams, Odds]),
  ],
  providers: [TradersService],
  controllers: [TraderController],
  exports: [TradersService],
})
export default class TraderModule {}

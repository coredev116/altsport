import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { CacheModule } from "@nestjs/cache-manager";

import CacheConfigService from "../../../../factory/cache.factory";

import Events from "../../../../entities/ja/events.entity";
import JAEventRounds from "../../../../entities/ja/eventRounds.entity";
import JAOdds from "../../../../entities/ja/odds.entity";
import JAScores from "../../../../entities/ja/scores.entity";
import JAEventTeams from "../../../../entities/ja/eventTeams.entity";
import JAClientOdds from "../../../../entities/ja/clientOdds.entity";

import SocketService from "./sockets.service";
import JaiApiService from "../../../../services/jai.service";
import TradersService from "../traders/traders.service";

import SocketController from "./sockets.controller";

@Module({
  imports: [
    CacheModule.registerAsync({
      useClass: CacheConfigService,
    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Events, JAEventRounds, JAClientOdds, JAOdds, JAScores, JAEventTeams]),
  ],
  providers: [SocketService, JaiApiService, TradersService],
  controllers: [SocketController],
})
export default class SocketModule {}

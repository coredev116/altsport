import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CacheModule } from "@nestjs/cache-manager";

import CacheConfigService from "../../../../factory/cache.factory";

import { HeatsService } from "./heats.service";

import HeatsController from "./heats.controller";

import RoundHeats from "../../../../entities/sls/roundHeats.entity";
import Rounds from "../../../../entities/sls/rounds.entity";
import EventRounds from "../../../../entities/sls/eventRounds.entity";

@Module({
  imports: [
    CacheModule.registerAsync({
      useClass: CacheConfigService,
    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([RoundHeats, Rounds, EventRounds]),
  ],

  controllers: [HeatsController],
  providers: [HeatsService],
})
export default class HeatsModule {}

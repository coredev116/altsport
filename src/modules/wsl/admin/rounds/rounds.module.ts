import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { CacheModule } from "@nestjs/cache-manager";

import CacheConfigService from "../../../../factory/cache.factory";

import RoundService from "./rounds.service";

import RoundController from "./rounds.controller";

import Rounds from "../../../../entities/wsl/rounds.entity";
import EventRounds from "../../../../entities/wsl/eventRounds.entity";
import Events from "../../../../entities/wsl/events.entity";

@Module({
  imports: [
    CacheModule.registerAsync({
      useClass: CacheConfigService,
    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Rounds, EventRounds, Events]),
  ],
  providers: [RoundService],
  controllers: [RoundController],
})
export default class RoundModule {}

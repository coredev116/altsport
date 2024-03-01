import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { CacheModule } from "@nestjs/cache-manager";

import CacheConfigService from "../../../../factory/cache.factory";

import HeatService from "./heats.service";

import HeatController from "./heats.controller";

import Event from "../../../../entities/wsl/events.entity";
import Round from "../../../../entities/wsl/rounds.entity";
import EventRounds from "../../../../entities/wsl/eventRounds.entity";
import RoundHeats from "../../../../entities/wsl/roundHeats.entity";

@Module({
  imports: [
    CacheModule.registerAsync({
      useClass: CacheConfigService,
    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([RoundHeats, Event, Round, EventRounds]),
  ],
  providers: [HeatService],
  controllers: [HeatController],
})
export default class HeatModule {}

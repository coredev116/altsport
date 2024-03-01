import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { CacheModule } from "@nestjs/cache-manager";

import CacheConfigService from "../../../../factory/cache.factory";

import Event from "../../../../entities/wsl/events.entity";
import Tour from "../../../../entities/wsl/tours.entity";
import Scores from "../../../../entities/wsl/scores.entity";
import EventRounds from "../../../../entities/wsl/eventRounds.entity";
import RoundHeats from "../../../../entities/wsl/roundHeats.entity";
import SimulationWeights from "../../../../entities/wsl/simulationWeights.entity";

import EventService from "./events.service";

import EventController from "./events.controller";

@Module({
  imports: [
    CacheModule.registerAsync({
      useClass: CacheConfigService,
    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Event, Tour, EventRounds, Scores, RoundHeats, SimulationWeights]),
  ],
  providers: [EventService],
  controllers: [EventController],
  exports: [EventService],
})
export default class EventModule {}

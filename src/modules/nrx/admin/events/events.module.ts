import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { CacheModule } from "@nestjs/cache-manager";

import CacheConfigService from "../../../../factory/cache.factory";

import Event from "../../../../entities/nrx/events.entity";
import Tour from "../../../../entities/nrx/tours.entity";
import Scores from "../../../../entities/nrx/scores.entity";
import EventRounds from "../../../../entities/nrx/eventRounds.entity";
import RoundHeats from "../../../../entities/nrx/roundHeats.entity";

import EventService from "./events.service";

import EventController from "./events.controller";

@Module({
  imports: [
    CacheModule.registerAsync({
      useClass: CacheConfigService,
    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Event, Tour, EventRounds, Scores, RoundHeats]),
  ],
  providers: [EventService],
  controllers: [EventController],
  exports: [EventService],
})
export default class EventModule {}

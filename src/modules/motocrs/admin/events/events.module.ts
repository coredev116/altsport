import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { CacheModule } from "@nestjs/cache-manager";

import CacheConfigService from "../../../../factory/cache.factory";

import Event from "../../../../entities/motocrs/events.entity";
import Tour from "../../../../entities/motocrs/tours.entity";
import Scores from "../../../../entities/motocrs/scores.entity";
import EventRounds from "../../../../entities/motocrs/eventRounds.entity";
import RoundHeats from "../../../../entities/motocrs/roundHeats.entity";

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

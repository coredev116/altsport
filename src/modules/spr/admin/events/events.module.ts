import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { CacheModule } from "@nestjs/cache-manager";

import CacheConfigService from "../../../../factory/cache.factory";

import Event from "../../../../entities/spr/events.entity";
import Tour from "../../../../entities/spr/tours.entity";

import EventService from "./events.service";

import EventController from "./events.controller";

@Module({
  imports: [
    CacheModule.registerAsync({
      useClass: CacheConfigService,
    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Event, Tour]),
  ],
  providers: [EventService],
  controllers: [EventController],
})
export default class EventModule {}

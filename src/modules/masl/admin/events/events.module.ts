import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { CacheModule } from "@nestjs/cache-manager";

import CacheConfigService from "../../../../factory/cache.factory";

import Events from "../../../../entities/masl/events.entity";

import EventService from "./events.service";

import EventController from "./events.controller";

@Module({
  imports: [
    CacheModule.registerAsync({
      useClass: CacheConfigService,
    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Events]),
  ],
  providers: [EventService],
  controllers: [EventController],
  exports: [EventService],
})
export default class EventModule {}

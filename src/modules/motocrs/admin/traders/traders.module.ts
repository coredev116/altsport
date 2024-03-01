import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { CacheModule } from "@nestjs/cache-manager";

import CacheConfigService from "../../../../factory/cache.factory";

import TradersService from "./traders.service";

import TraderController from "./traders.controller";

import Events from "../../../../entities/motocrs/events.entity";
import EventParticipants from "../../../../entities/motocrs/eventParticipants.entity";
import ProjectionEventOutcome from "../../../../entities/motocrs/projectionEventOutcome.entity";

import QueueModule from "../../../system/queue/queue.module";

@Module({
  imports: [
    CacheModule.registerAsync({
      useClass: CacheConfigService,
    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Events, EventParticipants, ProjectionEventOutcome]),
    QueueModule,
  ],
  providers: [TradersService],
  controllers: [TraderController],
})
export default class TraderModule {}

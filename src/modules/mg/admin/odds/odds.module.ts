import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { CacheModule } from "@nestjs/cache-manager";

import CacheConfigService from "../../../../factory/cache.factory";

import QueueModule from "../../../system/queue/queue.module";
import EventsModule from "../events/events.module";

import { OddsService } from "./odds.service";

import { OddsController } from "./odds.controller";

import EventParticipant from "../../../../entities/mg/eventParticipants.entity";
import PlayerHeadToHeads from "../../../../entities/mg/playerHeadToHeads.entity";
import ClientPlayerHeadToHeads from "../../../../entities/mg/clientPlayerHeadToHeads.entity";

@Module({
  imports: [
    CacheModule.registerAsync({
      useClass: CacheConfigService,
    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([EventParticipant, PlayerHeadToHeads, ClientPlayerHeadToHeads]),
    QueueModule,
    EventsModule,
  ],
  controllers: [OddsController],
  providers: [OddsService],
})
export default class OddsModule {}

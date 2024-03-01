import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { CacheModule } from "@nestjs/cache-manager";

import CacheConfigService from "../../../../factory/cache.factory";

import QueueModule from "../../../system/queue/queue.module";
import EventsModule from "../events/events.module";

import { OddsService } from "./odds.service";

import { OddsController } from "./odds.controller";

import ProjectionEventHeatOutcome from "../../../../entities/fdrift/projectionEventHeatOutcome.entity";
import ProjectionEventOutcome from "../../../../entities/fdrift/projectionEventOutcome.entity";
import EventParticipants from "../../../../entities/fdrift/eventParticipants.entity";
import PlayerHeadToHeads from "../../../../entities/fdrift/playerHeadToHeads.entity";
import RoundHeats from "../../../../entities/fdrift/roundHeats.entity";

import ClientProjectionEventHeatOutcome from "../../../../entities/fdrift/clientProjectionEventHeatOutcome.entity";
import ClientProjectionEventOutcome from "../../../../entities/fdrift/clientProjectionEventOutcome.entity";
import ClientPlayerHeadToHeads from "../../../../entities/fdrift/clientPlayerHeadToHeads.entity";

@Module({
  imports: [
    CacheModule.registerAsync({
      useClass: CacheConfigService,
    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([
      ProjectionEventHeatOutcome,
      ProjectionEventOutcome,
      EventParticipants,
      PlayerHeadToHeads,
      RoundHeats,
      ClientProjectionEventHeatOutcome,
      ClientProjectionEventOutcome,
      ClientPlayerHeadToHeads,
    ]),
    QueueModule,
    EventsModule,
  ],
  controllers: [OddsController],
  providers: [OddsService],
})
export default class OddsModule {}

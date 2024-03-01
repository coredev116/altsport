import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { CacheModule } from "@nestjs/cache-manager";

import CacheConfigService from "../../../../factory/cache.factory";

import QueueModule from "../../../system/queue/queue.module";
import EventsModule from "../events/events.module";

import { OddsService } from "./odds.service";

import { OddsController } from "./odds.controller";

import ProjectionEventHeatOutcome from "../../../../entities/motocrs/projectionEventHeatOutcome.entity";
import ProjectionEventOutcome from "../../../../entities/motocrs/projectionEventOutcome.entity";
import PropBets from "../../../../entities/motocrs/propBets.entity";
import EventParticipants from "../../../../entities/motocrs/eventParticipants.entity";
import PlayerHeadToHeads from "../../../../entities/motocrs/playerHeadToHeads.entity";
import RoundHeats from "../../../../entities/motocrs/roundHeats.entity";
import ProjectionEventPodiums from "../../../../entities/motocrs/projectionEventPodiums.entity";

import ClientProjectionEventHeatOutcome from "../../../../entities/motocrs/clientProjectionEventHeatOutcome.entity";
import ClientProjectionEventOutcome from "../../../../entities/motocrs/clientProjectionEventOutcome.entity";
import ClientPlayerHeadToHeads from "../../../../entities/motocrs/clientPlayerHeadToHeads.entity";
import ClientPropBets from "../../../../entities/motocrs/clientPropBets.entity";
import ClientProjectionEventPodiums from "../../../../entities/motocrs/clientProjectionEventPodiums.entity";

@Module({
  imports: [
    CacheModule.registerAsync({
      useClass: CacheConfigService,
    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([
      ProjectionEventHeatOutcome,
      ProjectionEventOutcome,
      PropBets,
      EventParticipants,
      PlayerHeadToHeads,
      RoundHeats,
      ProjectionEventPodiums,
      ClientProjectionEventHeatOutcome,
      ClientProjectionEventOutcome,
      ClientPlayerHeadToHeads,
      ClientPropBets,
      ClientProjectionEventPodiums,
    ]),
    QueueModule,
    EventsModule,
  ],
  controllers: [OddsController],
  providers: [OddsService],
})
export default class OddsModule {}

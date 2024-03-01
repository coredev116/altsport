import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { CacheModule } from "@nestjs/cache-manager";

import CacheConfigService from "../../../../factory/cache.factory";

import QueueModule from "../../../system/queue/queue.module";
import EventsModule from "../events/events.module";

import { OddsService } from "./odds.service";

import { OddsController } from "./odds.controller";

import ProjectionEventHeatOutcome from "../../../../entities/wsl/projectionEventHeatOutcome.entity";
import ProjectionEventOutcome from "../../../../entities/wsl/projectionEventOutcome.entity";
import PropBets from "../../../../entities/wsl/propBets.entity";
import EventParticipants from "../../../../entities/wsl/eventParticipants.entity";
import PlayerHeadToHeads from "../../../../entities/wsl/playerHeadToHeads.entity";
import RoundHeats from "../../../../entities/wsl/roundHeats.entity";
import ProjectionEventShows from "../../../../entities/wsl/projectionEventShows.entity";
import ProjectionEventPodiums from "../../../../entities/wsl/projectionEventPodiums.entity";

import ClientProjectionEventHeatOutcome from "../../../../entities/wsl/clientProjectionEventHeatOutcome.entity";
import ClientProjectionEventOutcome from "../../../../entities/wsl/clientProjectionEventOutcome.entity";
import ClientPlayerHeadToHeads from "../../../../entities/wsl/clientPlayerHeadToHeads.entity";
import ClientPropBets from "../../../../entities/wsl/clientPropBets.entity";
import ClientProjectionEventShows from "../../../../entities/wsl/clientProjectionEventShows.entity";
import ClientProjectionEventPodiums from "../../../../entities/wsl/clientProjectionEventPodiums.entity";

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
      ProjectionEventShows,
      ProjectionEventPodiums,
      ClientProjectionEventHeatOutcome,
      ClientProjectionEventOutcome,
      ClientPlayerHeadToHeads,
      ClientPropBets,
      ClientProjectionEventShows,
      ClientProjectionEventPodiums,
    ]),
    QueueModule,
    EventsModule,
  ],
  controllers: [OddsController],
  providers: [OddsService],
})
export default class OddsModule {}

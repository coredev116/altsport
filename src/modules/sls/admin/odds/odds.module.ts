import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { CacheModule } from "@nestjs/cache-manager";

import CacheConfigService from "../../../../factory/cache.factory";

import QueueModule from "../../../system/queue/queue.module";
import EventsModule from "../events/events.module";

import { OddsService } from "./odds.service";

import { OddsController } from "./odds.controller";

import ProjectionEventHeatOutcome from "../../../../entities/sls/projectionEventHeatOutcome.entity";
import ProjectionEventOutcome from "../../../../entities/sls/projectionEventOutcome.entity";
import PlayerHeadToHeads from "../../../../entities/sls/playerHeadToHeads.entity";
import PropBets from "../../../../entities/sls/propBets.entity";
import EventParticipants from "../../../../entities/sls/eventParticipants.entity";
import ProjectionEventShows from "../../../../entities/sls/projectionEventShows.entity";
import ProjectionEventPodiums from "../../../../entities/sls/projectionEventPodiums.entity";
import RoundHeats from "../../../../entities/sls/roundHeats.entity";

import ClientProjectionEventHeatOutcome from "../../../../entities/sls/clientProjectionEventHeatOutcome.entity";
import ClientProjectionEventOutcome from "../../../../entities/sls/clientProjectionEventOutcome.entity";
import ClientPlayerHeadToHeads from "../../../../entities/sls/clientPlayerHeadToHeads.entity";
import ClientPropBets from "../../../../entities/sls/clientPropBets.entity";
import ClientProjectionEventShows from "../../../../entities/sls/clientProjectionEventShows.entity";
import ClientProjectionEventPodiums from "../../../../entities/sls/clientProjectionEventPodiums.entity";

@Module({
  imports: [
    CacheModule.registerAsync({
      useClass: CacheConfigService,
    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([
      ProjectionEventHeatOutcome,
      ProjectionEventOutcome,
      RoundHeats,
      PlayerHeadToHeads,
      PropBets,
      EventParticipants,
      ProjectionEventShows,
      ProjectionEventPodiums,
      ClientProjectionEventOutcome,
      ClientPlayerHeadToHeads,
      ClientPropBets,
      ClientProjectionEventShows,
      ClientProjectionEventPodiums,
      ClientProjectionEventHeatOutcome,
    ]),
    QueueModule,
    EventsModule,
  ],
  controllers: [OddsController],
  providers: [OddsService],
})
export default class OddsModule {}

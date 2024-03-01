import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { CacheModule } from "@nestjs/cache-manager";

import CacheConfigService from "../../../../factory/cache.factory";

import { OddsService } from "./odds.service";

import QueueModule from "../../../system/queue/queue.module";
import EventsModule from "../events/events.module";

import { OddsController } from "./odds.controller";

import PropBets from "../../../../entities/nrx/propBets.entity";
import EventParticipants from "../../../../entities/nrx/eventParticipants.entity";
import ProjectionEventOutcome from "../../../../entities/nrx/projectionEventOutcome.entity";
import ProjectionEventShows from "../../../../entities/nrx/projectionEventShows.entity";
import ProjectionEventPodiums from "../../../../entities/nrx/projectionEventPodiums.entity";
import ProjectionEventHeatOutcome from "../../../../entities/nrx/projectionEventHeatOutcome.entity";
import RoundHeats from "../../../../entities/nrx/roundHeats.entity";
import PlayerHeadToHeads from "../../../../entities/nrx/playerHeadToHeads.entity";

import ClientPropBets from "../../../../entities/nrx/clientPropBets.entity";
import ClientProjectionEventOutcome from "../../../../entities/nrx/clientProjectionEventOutcome.entity";
import ClientProjectionEventShows from "../../../../entities/nrx/clientProjectionEventShows.entity";
import ClientProjectionEventPodiums from "../../../../entities/nrx/clientProjectionEventPodiums.entity";
import ClientProjectionEventHeatOutcome from "../../../../entities/nrx/clientProjectionEventHeatOutcome.entity";
import ClientPlayerHeadToHeads from "../../../../entities/nrx/clientPlayerHeadToHeads.entity";

@Module({
  imports: [
    CacheModule.registerAsync({
      useClass: CacheConfigService,
    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([
      PropBets,
      EventParticipants,
      ProjectionEventOutcome,
      ProjectionEventShows,
      ProjectionEventPodiums,
      ProjectionEventHeatOutcome,
      RoundHeats,
      PlayerHeadToHeads,
      ClientProjectionEventOutcome,
      ClientProjectionEventHeatOutcome,
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

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { CacheModule } from "@nestjs/cache-manager";

import CacheConfigService from "../../../../factory/cache.factory";

import TradersService from "./traders.service";

import TraderController from "./traders.controller";

import Events from "../../../../entities/spr/events.entity";
import Tours from "../../../../entities/spr/tours.entity";
import RoundHeats from "../../../../entities/spr/roundHeats.entity";
import Athletes from "../../../../entities/spr/athletes.entity";
import Scores from "../../../../entities/spr/scores.entity";
import EventParticipants from "../../../../entities/spr/eventParticipants.entity";
import EventRounds from "../../../../entities/spr/eventRounds.entity";
import ProjectionEventOutcome from "../../../../entities/spr/projectionEventOutcome.entity";
import ProjectionEventHeatOutcome from "../../../../entities/spr/projectionEventHeatOutcome.entity";
import PlayerHeadToHeads from "../../../../entities/spr/playerHeadToHeads.entity";
import ProjectionEventShows from "../../../../entities/spr/projectionEventShows.entity";
import ProjectionEventPodiums from "../../../../entities/spr/projectionEventPodiums.entity";
import PropBets from "../../../../entities/spr/propBets.entity";
import ClientProjectionEventOutcome from "../../../../entities/spr/clientProjectionEventOutcome.entity";
import ClientProjectionEventHeatOutcome from "../../../../entities/spr/clientProjectionEventHeatOutcome.entity";
import ClientPlayerHeadToHeads from "../../../../entities/spr/clientPlayerHeadToHeads.entity";
import ClientProjectionEventShows from "../../../../entities/spr/clientProjectionEventShows.entity";
import ClientProjectionEventPodiums from "../../../../entities/spr/clientProjectionEventPodiums.entity";
import ClientPropBets from "../../../../entities/spr/clientPropBets.entity";

import QueueModule from "../../../system/queue/queue.module";

@Module({
  imports: [
    CacheModule.registerAsync({
      useClass: CacheConfigService,
    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([
      Events,
      Tours,
      RoundHeats,
      Athletes,
      Scores,
      EventParticipants,
      EventRounds,
      ProjectionEventOutcome,
      ProjectionEventHeatOutcome,
      PlayerHeadToHeads,
      PropBets,
      ClientProjectionEventOutcome,
      ClientProjectionEventHeatOutcome,
      ClientPlayerHeadToHeads,
      ProjectionEventShows,
      ProjectionEventPodiums,
      ClientProjectionEventShows,
      ClientProjectionEventPodiums,
      ClientPropBets,
    ]),
    QueueModule,
  ],
  providers: [TradersService],
  controllers: [TraderController],
  exports: [TradersService],
})
export default class TraderModule {}

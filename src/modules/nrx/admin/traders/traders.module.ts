import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { CacheModule } from "@nestjs/cache-manager";

import CacheConfigService from "../../../../factory/cache.factory";

import TradersService from "./traders.service";

import TraderController from "./traders.controller";

import Events from "../../../../entities/nrx/events.entity";
import Tours from "../../../../entities/nrx/tours.entity";
import Rounds from "../../../../entities/nrx/rounds.entity";
import RoundHeats from "../../../../entities/nrx/roundHeats.entity";
import Athletes from "../../../../entities/nrx/athletes.entity";
import Scores from "../../../../entities/nrx/scores.entity";
import EventParticipants from "../../../../entities/nrx/eventParticipants.entity";
import EventRounds from "../../../../entities/nrx/eventRounds.entity";
import ProjectionEventOutcome from "../../../../entities/nrx/projectionEventOutcome.entity";
import ProjectionEventHeatOutcome from "../../../../entities/nrx/projectionEventHeatOutcome.entity";
import PropBets from "../../../../entities/nrx/propBets.entity";
import PlayerHeadToHeads from "../../../../entities/nrx/playerHeadToHeads.entity";
import ProjectionEventPodiums from "../../../../entities/nrx/projectionEventPodiums.entity";
import ProjectionEventShows from "../../../../entities/nrx/projectionEventShows.entity";

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
      Rounds,
      RoundHeats,
      Athletes,
      Scores,
      EventParticipants,
      EventRounds,
      ProjectionEventOutcome,
      ProjectionEventHeatOutcome,
      PropBets,
      PlayerHeadToHeads,
      ProjectionEventPodiums,
      ProjectionEventShows,
    ]),
    QueueModule,
  ],
  providers: [TradersService],
  controllers: [TraderController],
  exports: [TradersService],
})
export default class TraderModule {}

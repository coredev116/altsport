import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { CacheModule } from "@nestjs/cache-manager";

import CacheConfigService from "../../../../factory/cache.factory";

import TradersService from "./traders.service";

import TraderController from "./traders.controller";

import Events from "../../../../entities/sls/events.entity";
import Leagues from "../../../../entities/sls/leagues.entity";
import Rounds from "../../../../entities/sls/rounds.entity";
import RoundHeats from "../../../../entities/sls/roundHeats.entity";
import Athletes from "../../../../entities/sls/athletes.entity";
import Scores from "../../../../entities/sls/scores.entity";
import EventParticipants from "../../../../entities/sls/eventParticipants.entity";
import EventRounds from "../../../../entities/sls/eventRounds.entity";
import PlayerHeadToHeads from "../../../../entities/sls/playerHeadToHeads.entity";
import ProjectionEventOutcome from "../../../../entities/sls/projectionEventOutcome.entity";
import ProjectionEventHeatOutcome from "../../../../entities/sls/projectionEventHeatOutcome.entity";
import PropBets from "../../../../entities/sls/propBets.entity";

import QueueModule from "../../../system/queue/queue.module";

@Module({
  imports: [
    CacheModule.registerAsync({
      useClass: CacheConfigService,
    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([
      Events,
      Leagues,
      Rounds,
      RoundHeats,
      Athletes,
      Scores,
      EventParticipants,
      EventRounds,
      PlayerHeadToHeads,
      ProjectionEventOutcome,
      ProjectionEventHeatOutcome,
      PropBets,
    ]),
    QueueModule,
  ],
  providers: [TradersService],
  controllers: [TraderController],
})
export default class TraderModule {}

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { CacheModule } from "@nestjs/cache-manager";

import CacheConfigService from "../../../../factory/cache.factory";

import TradersService from "./traders.service";

import TraderController from "./traders.controller";

import Events from "../../../../entities/wsl/events.entity";
import Tours from "../../../../entities/wsl/tours.entity";
import Rounds from "../../../../entities/wsl/rounds.entity";
import RoundHeats from "../../../../entities/wsl/roundHeats.entity";
import Athletes from "../../../../entities/wsl/athletes.entity";
import Scores from "../../../../entities/wsl/scores.entity";
import EventParticipants from "../../../../entities/wsl/eventParticipants.entity";
import EventRounds from "../../../../entities/wsl/eventRounds.entity";
import PlayerHeadToHeads from "../../../../entities/wsl/playerHeadToHeads.entity";
import ProjectionEventOutcome from "../../../../entities/wsl/projectionEventOutcome.entity";
import ProjectionEventHeatOutcome from "../../../../entities/wsl/projectionEventHeatOutcome.entity";
import PropBets from "../../../../entities/wsl/propBets.entity";
import SimulationWeights from "../../../../entities/wsl/simulationWeights.entity";

import QueueModule from "../../../system/queue/queue.module";
import WslService from "../../../../services/wsl.service";
import WSLSyncHelperService from "../../../system/sync/wsl/sync.wsl.helpers.service";

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
      PlayerHeadToHeads,
      ProjectionEventOutcome,
      ProjectionEventHeatOutcome,
      PropBets,
      SimulationWeights,
    ]),
    QueueModule,
  ],
  providers: [TradersService, WslService, WSLSyncHelperService],
  controllers: [TraderController],
})
export default class TraderModule {}

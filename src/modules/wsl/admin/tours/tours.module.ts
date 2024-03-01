import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { CacheModule } from "@nestjs/cache-manager";

import CacheConfigService from "../../../../factory/cache.factory";

import Tour from "../../../../entities/wsl/tours.entity";
import TourYears from "../../../../entities/wsl/tourYears.entity";
import Events from "../../../../entities/wsl/events.entity";
import Athletes from "../../../../entities/wsl/athletes.entity";
import EventRounds from "../../../../entities/wsl/eventRounds.entity";
import RoundHeats from "../../../../entities/wsl/roundHeats.entity";
import Scores from "../../../../entities/wsl/scores.entity";
import EventParticipants from "../../../../entities/wsl/eventParticipants.entity";
import SimulationWeights from "../../../../entities/wsl/simulationWeights.entity";

import WSLHelperService from "../../../system/sync/wsl/sync.wsl.helpers.service";
import WSLService from "../../../../services/wsl.service";

import TourService from "./tours.service";

import TourController from "./tours.controller";

import QueueModule from "../../../system/queue/queue.module";

@Module({
  imports: [
    CacheModule.registerAsync({
      useClass: CacheConfigService,
    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([
      Tour,
      TourYears,
      Events,
      Athletes,
      EventRounds,
      RoundHeats,
      Scores,
      EventParticipants,
      SimulationWeights,
    ]),
    QueueModule,
  ],
  providers: [TourService, WSLService, WSLHelperService],
  controllers: [TourController],
})
export default class TourModule {}

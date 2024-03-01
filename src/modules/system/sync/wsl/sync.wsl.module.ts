import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import WSLSyncService from "./sync.wsl.service";
import WSLHelperService from "./sync.wsl.helpers.service";
import WSLService from "../../../../services/wsl.service";

import TourYears from "../../../../entities/wsl/tourYears.entity";
import Tours from "../../../../entities/wsl/tours.entity";
import Events from "../../../../entities/wsl/events.entity";
import Rounds from "../../../../entities/wsl/rounds.entity";
import EventRounds from "../../../../entities/wsl/eventRounds.entity";
import RoundHeats from "../../../../entities/wsl/roundHeats.entity";
import Athletes from "../../../../entities/wsl/athletes.entity";
import EventParticipants from "../../../../entities/wsl/eventParticipants.entity";
import Scores from "../../../../entities/wsl/scores.entity";
// import SimulationWeights from "../../../../entities/wsl/simulationWeights.entity";
import Futures from "../../../../entities/wsl/futures.entity";

import OpenbetAPIService from "../../../../services/openbet-api.service";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([
      Events,
      Rounds,
      EventRounds,
      RoundHeats,
      Athletes,
      EventParticipants,
      Scores,
      TourYears,
      Tours,
      // SimulationWeights,
      Futures,
    ]),
  ],
  providers: [WSLSyncService, WSLService, WSLHelperService, OpenbetAPIService],
  controllers: [],
  exports: [WSLSyncService, WSLHelperService],
})
export default class SyncWSLModule {}

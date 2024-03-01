import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import SLSyncService from "./sync.sls.service";
import SLSAPIService from "../../../../services/sls.service";

import LeagueYears from "../../../../entities/sls/leagueYears.entity";
import Leagues from "../../../../entities/sls/leagues.entity";
import Events from "../../../../entities/sls/events.entity";
import Rounds from "../../../../entities/sls/rounds.entity";
import EventRounds from "../../../../entities/sls/eventRounds.entity";
import RoundHeats from "../../../../entities/sls/roundHeats.entity";
import Athletes from "../../../../entities/sls/athletes.entity";
import EventParticipants from "../../../../entities/sls/eventParticipants.entity";
import Scores from "../../../../entities/sls/scores.entity";

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
      LeagueYears,
      Leagues,
    ]),
  ],
  providers: [SLSyncService, SLSAPIService],
  controllers: [],
  exports: [SLSyncService],
})
export default class SyncSLSModule {}

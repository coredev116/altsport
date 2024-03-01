import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import MaslSyncService from "./sync.masl.service";
import MaslService from "../../../../services/masl.service";
import SlackbotService from "../../../../services/slackbot.service";

import Events from "../../../../entities/masl/events.entity";
import Rounds from "../../../../entities/masl/rounds.entity";
import EventRounds from "../../../../entities/masl/eventRounds.entity";
import EventTeams from "../../../../entities/masl/eventTeams.entity";
import Scores from "../../../../entities/masl/scores.entity";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Events, Rounds, EventRounds, EventTeams, Scores]),
  ],
  providers: [MaslSyncService, MaslService, SlackbotService],
  controllers: [],
  exports: [MaslSyncService],
})
export default class SyncMaslModule {}

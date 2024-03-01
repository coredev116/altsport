import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import { OddsService } from "./odds.service";

import { OddsController } from "./odds.controller";

import Event from "../../../../entities/fdrift/events.entity";
import Scores from "../../../../entities/fdrift/scores.entity";
import RoundHeats from "../../../../entities/fdrift/roundHeats.entity";
import Rounds from "../../../../entities/fdrift/rounds.entity";
import Athletes from "../../../../entities/fdrift/athletes.entity";
import EventParticipants from "../../../../entities/fdrift/eventParticipants.entity";
import EventRounds from "../../../../entities/fdrift/eventRounds.entity";
import ClientProjectionEventOutcome from "../../../../entities/fdrift/clientProjectionEventOutcome.entity";
import ClientPlayerHeadToHeads from "../../../../entities/fdrift/clientPlayerHeadToHeads.entity";
import ClientProjectionEventHeatOutcome from "../../../../entities/fdrift/clientProjectionEventHeatOutcome.entity";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([
      Event,
      Scores,
      RoundHeats,
      EventRounds,
      Rounds,
      Athletes,
      EventParticipants,
      ClientProjectionEventOutcome,
      ClientPlayerHeadToHeads,
      ClientProjectionEventHeatOutcome,
    ]),
  ],
  controllers: [OddsController],
  providers: [OddsService],
})
export default class OddsModule {}

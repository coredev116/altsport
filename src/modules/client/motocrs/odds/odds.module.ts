import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import { OddsService } from "./odds.service";

import { OddsController } from "./odds.controller";

import Event from "../../../../entities/motocrs/events.entity";
import Scores from "../../../../entities/motocrs/scores.entity";
import RoundHeats from "../../../../entities/motocrs/roundHeats.entity";
import EventRounds from "../../../../entities/motocrs/eventRounds.entity";
import ClientPropBets from "../../../../entities/motocrs/clientPropBets.entity";
import ClientProjectionEventOutcome from "../../../../entities/motocrs/clientProjectionEventOutcome.entity";
import ClientPlayerHeadToHeads from "../../../../entities/motocrs/clientPlayerHeadToHeads.entity";
import ClientProjectionEventHeatOutcome from "../../../../entities/motocrs/clientProjectionEventHeatOutcome.entity";
import ClientProjectionEventPodiums from "../../../../entities/motocrs/clientProjectionEventPodiums.entity";
import EventParticipants from "../../../../entities/motocrs/eventParticipants.entity";
import Athletes from "../../../../entities/motocrs/athletes.entity";
import Rounds from "../../../../entities/motocrs/rounds.entity";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([
      Event,
      Scores,
      RoundHeats,
      EventRounds,
      ClientPropBets,
      ClientProjectionEventOutcome,
      ClientPlayerHeadToHeads,
      ClientProjectionEventHeatOutcome,
      ClientProjectionEventPodiums,
      EventParticipants,
      Athletes,
      Rounds,
    ]),
  ],
  controllers: [OddsController],
  providers: [OddsService],
})
export default class OddsModule {}

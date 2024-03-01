import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import { OddsService } from "./odds.service";

import { OddsController } from "./odds.controller";

import PropBets from "../../../../entities/wsl/clientPropBets.entity";
import ProjectionEventOutcome from "../../../../entities/wsl/clientProjectionEventOutcome.entity";
import ProjectionEventHeatOutcome from "../../../../entities/wsl/clientProjectionEventHeatOutcome.entity";
import PlayerHeadToHeads from "../../../../entities/wsl/clientPlayerHeadToHeads.entity";
import ProjectionEventShows from "../../../../entities/wsl/clientProjectionEventShows.entity";
import ProjectionEventPodiums from "../../../../entities/wsl/clientProjectionEventPodiums.entity";
import Event from "../../../../entities/wsl/events.entity";
import Rounds from "../../../../entities/wsl/rounds.entity";
import RoundHeats from "../../../../entities/wsl/roundHeats.entity";
import Scores from "../../../../entities/wsl/scores.entity";
import EventRounds from "../../../../entities/wsl/eventRounds.entity";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([
      PropBets,
      ProjectionEventOutcome,
      ProjectionEventHeatOutcome,
      ProjectionEventShows,
      ProjectionEventPodiums,
      PlayerHeadToHeads,
      Event,
      Rounds,
      RoundHeats,
      EventRounds,
      Scores,
    ]),
  ],
  controllers: [OddsController],
  providers: [OddsService],
})
export default class OddsModule {}

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import { OddsService } from "./odds.service";

import { OddsController } from "./odds.controller";

import PropBets from "../../../../entities/nrx/clientPropBets.entity";
import ProjectionEventOutcome from "../../../../entities/nrx/clientProjectionEventOutcome.entity";
import ProjectionEventShows from "../../../../entities/nrx/clientProjectionEventShows.entity";
import ProjectionEventPodiums from "../../../../entities/nrx/clientProjectionEventPodiums.entity";
import ProjectionEventHeatOutcome from "../../../../entities/nrx/clientProjectionEventHeatOutcome.entity";
import PlayerHeadToHeads from "../../../../entities/nrx/clientPlayerHeadToHeads.entity";
import Event from "../../../../entities/nrx/events.entity";
import RoundHeats from "../../../../entities/nrx/roundHeats.entity";
import Rounds from "../../../../entities/nrx/rounds.entity";
import Scores from "../../../../entities/nrx/scores.entity";
import EventRounds from "../../../../entities/nrx/eventRounds.entity";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([
      PropBets,
      ProjectionEventOutcome,
      ProjectionEventShows,
      ProjectionEventPodiums,
      ProjectionEventHeatOutcome,
      PlayerHeadToHeads,
      Event,
      RoundHeats,
      Rounds,
      Scores,
      EventRounds,
    ]),
  ],
  controllers: [OddsController],
  providers: [OddsService],
})
export default class OddsModule {}

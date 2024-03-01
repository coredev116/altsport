import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import { OddsService } from "./odds.service";

import { OddsController } from "./odds.controller";

import PropBets from "../../../../entities/sls/clientPropBets.entity";
import ProjectionEventOutcome from "../../../../entities/sls/clientProjectionEventOutcome.entity";
import ProjectionEventHeatOutcome from "../../../../entities/sls/clientProjectionEventHeatOutcome.entity";
import PlayerHeadToHeads from "../../../../entities/sls/clientPlayerHeadToHeads.entity";
import ProjectionEventShows from "../../../../entities/sls/clientProjectionEventShows.entity";
import ProjectionEventPodiums from "../../../../entities/sls/clientProjectionEventPodiums.entity";
import Rounds from "../../../../entities/sls/rounds.entity";
import RoundHeats from "../../../../entities/sls/roundHeats.entity";
import Event from "../../../../entities/sls/events.entity";
import Scores from "../../../../entities/sls/scores.entity";
import EventRounds from "../../../../entities/sls/eventRounds.entity";

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

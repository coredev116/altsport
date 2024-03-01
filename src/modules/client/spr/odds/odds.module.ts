import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import { OddsService } from "./odds.service";

import { OddsController } from "./odds.controller";

import PropBets from "../../../../entities/spr/clientPropBets.entity";
import ProjectionEventOutcome from "../../../../entities/spr/clientProjectionEventOutcome.entity";
import ProjectionEventShows from "../../../../entities/spr/clientProjectionEventShows.entity";
import ProjectionEventPodiums from "../../../../entities/spr/clientProjectionEventPodiums.entity";
import ProjectionEventHeatOutcome from "../../../../entities/spr/clientProjectionEventHeatOutcome.entity";
import PlayerHeadToHeads from "../../../../entities/spr/clientPlayerHeadToHeads.entity";
import Event from "../../../../entities/spr/events.entity";
import RoundHeats from "../../../../entities/spr/roundHeats.entity";
import Rounds from "../../../../entities/spr/rounds.entity";

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
    ]),
  ],
  controllers: [OddsController],
  providers: [OddsService],
})
export default class OddsModule {}

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import HooksController from "./hooks.controller";
import HooksService from "./hooks.service";

import SlackService from "../../../services/slack.service";

import Athlete from "../../../entities/nrx/athletes.entity";
import Events from "../../../entities/nrx/events.entity";
import TourYears from "../../../entities/nrx/tourYears.entity";
import Scores from "../../../entities/nrx/scores.entity";
import Rounds from "../../../entities/nrx/rounds.entity";
import RoundHeats from "../../../entities/nrx/roundHeats.entity";
import EventRounds from "../../../entities/nrx/eventRounds.entity";
import PlayerHeadToHeads from "../../../entities/nrx/playerHeadToHeads.entity";
import ProjectionEventHeatOutcome from "../../../entities/nrx/projectionEventHeatOutcome.entity";
import ProjectionEventOutcome from "../../../entities/nrx/projectionEventOutcome.entity";
import EventParticipants from "../../../entities/nrx/eventParticipants.entity";
import PropBets from "../../../entities/nrx/propBets.entity";

import NRXTraderModule from "../../nrx/admin/traders/traders.module";
import QueueModule from "../../system/queue/queue.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([
      Athlete,
      Scores,
      Events,
      TourYears,
      Events,
      Rounds,
      RoundHeats,
      EventRounds,
      PlayerHeadToHeads,
      ProjectionEventHeatOutcome,
      ProjectionEventOutcome,
      EventParticipants,
      PropBets,
    ]),
    NRXTraderModule,
    QueueModule,
  ],
  controllers: [HooksController],
  providers: [SlackService, HooksService],
})
export default class HooksModule {}

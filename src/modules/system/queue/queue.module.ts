import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import QueueService from "./queue.service";

import SLSProjectionEventOutcome from "../../../entities/sls/projectionEventOutcome.entity";
import SLSProjectionHeatOutcome from "../../../entities/sls/projectionEventHeatOutcome.entity";
import SLSEventRounds from "../../../entities/sls/eventRounds.entity";
import SLSEvents from "../../../entities/sls/events.entity";
import SLSEventParticipants from "../../../entities/sls/eventParticipants.entity";
import SLSPlayerHeadToHeads from "../../../entities/sls/playerHeadToHeads.entity";
import SLSProjectionEventShows from "../../../entities/sls/projectionEventShows.entity";
import SLSProjectionEventPodiums from "../../../entities/sls/projectionEventPodiums.entity";

import WSLProjectionEventOutcome from "../../../entities/wsl/projectionEventOutcome.entity";
import WSLProjectionEventHeatOutcome from "../../../entities/wsl/projectionEventHeatOutcome.entity";
import WSLEventParticipants from "../../../entities/wsl/eventParticipants.entity";
import WSLEventRounds from "../../../entities/wsl/eventRounds.entity";
import WSLRoundHeats from "../../../entities/wsl/roundHeats.entity";
import WSLEvents from "../../../entities/wsl/events.entity";
import WSLPlayerHeadToHeads from "../../../entities/wsl/playerHeadToHeads.entity";
import WSLProjectionEventShows from "../../../entities/wsl/projectionEventShows.entity";
import WSLProjectionEventPodiums from "../../../entities/wsl/projectionEventPodiums.entity";

import NRXProjectionEventOutcome from "../../../entities/nrx/projectionEventOutcome.entity";
import NRXProjectionEventHeatOutcome from "../../../entities/nrx/projectionEventHeatOutcome.entity";
import NRXProjectionEventPodiums from "../../../entities/nrx/projectionEventPodiums.entity";
import NRXProjectionEventShows from "../../../entities/nrx/projectionEventShows.entity";
import NRXEventRounds from "../../../entities/nrx/eventRounds.entity";
import NRXEventParticipants from "../../../entities/nrx/eventParticipants.entity";
import NRXEvents from "../../../entities/nrx/events.entity";
import NRXRoundHeats from "../../../entities/nrx/roundHeats.entity";
import NRXPlayerHeadToHeads from "../../../entities/nrx/playerHeadToHeads.entity";
import NRXScores from "../../../entities/nrx/scores.entity";

import MASLEvents from "../../../entities/masl/events.entity";

import MASLSyncModule from "../sync/masl/sync.masl.module";
import WSLSyncModule from "../sync/wsl/sync.wsl.module";
import SLSSyncModule from "../sync/sls/sync.sls.module";

import NotificationsModule from "../notifications/notifications.module";

import SlackService from "../../../services/slack.service";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([
      SLSEventRounds,
      SLSProjectionEventOutcome,
      SLSProjectionHeatOutcome,
      SLSEventParticipants,
      SLSEvents,
      SLSPlayerHeadToHeads,
      SLSProjectionEventShows,
      SLSProjectionEventPodiums,

      WSLProjectionEventOutcome,
      WSLProjectionEventHeatOutcome,
      WSLEvents,
      WSLEventParticipants,
      WSLEventRounds,
      WSLRoundHeats,
      WSLPlayerHeadToHeads,
      WSLProjectionEventShows,
      WSLProjectionEventPodiums,

      NRXProjectionEventOutcome,
      NRXProjectionEventHeatOutcome,
      NRXProjectionEventPodiums,
      NRXProjectionEventShows,
      NRXEventRounds,
      NRXEventParticipants,
      NRXEvents,
      NRXRoundHeats,
      NRXPlayerHeadToHeads,
      NRXScores,

      MASLEvents,
    ]),
    MASLSyncModule,
    WSLSyncModule,
    SLSSyncModule,
    NotificationsModule,
  ],
  controllers: [],
  providers: [QueueService, SlackService],
  exports: [QueueService],
})
export default class QueueModule {}

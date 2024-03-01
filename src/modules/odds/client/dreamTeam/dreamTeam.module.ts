import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import DreamTeamController from "./dreamTeam.controller";
import { DreamTeamService } from "./dreamTeam.service";

import F1Events from "../../../../entities/f1/events.entity";
import MotoGPEvents from "../../../../entities/mg/events.entity";
import MXGPEvents from "../../../../entities/mxgp/events.entity";

import F1ProjectionDreamTeam from "../../../../entities/f1/projectionDreamTeam.entity";
import F1ClientProjectionDreamTeam from "../../../../entities/f1/clientProjectionDreamTeam.entity";
import MGProjectionDreamTeam from "../../../../entities/mg/projectionDreamTeam.entity";
import MGClientProjectionDreamTeam from "../../../../entities/mg/clientProjectionDreamTeam.entity";
import MXGPProjectionDreamTeam from "../../../../entities/mxgp/projectionDreamTeam.entity";
import MXGPClientProjectionDreamTeam from "../../../../entities/mxgp/clientProjectionDreamTeam.entity";

import F1ProjectionDreamTeamParticipants from "../../../../entities/f1/projectionDreamTeamParticipants.entity";
import MGProjectionDreamTeamParticipants from "../../../../entities/mg/projectionDreamTeamParticipants.entity";
import MXGPProjectionDreamTeamParticipants from "../../../../entities/mxgp/projectionDreamTeamParticipants.entity";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([
      F1ProjectionDreamTeam,
      F1ClientProjectionDreamTeam,
      MGProjectionDreamTeam,
      MGClientProjectionDreamTeam,
      MXGPProjectionDreamTeam,
      MXGPClientProjectionDreamTeam,
      F1ProjectionDreamTeamParticipants,
      MGProjectionDreamTeamParticipants,
      MXGPProjectionDreamTeamParticipants,
      F1Events,
      MotoGPEvents,
      MXGPEvents,
    ]),
  ],
  controllers: [DreamTeamController],
  providers: [DreamTeamService],
})
export default class DreamTeamModule {}

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import OddsService from "./odds.service";
import ClientService from "../../../client/client.service";

import OddsController from "./odds.controller";

import ProjectionEventOutcome from "../../../../entities/wsl/projectionEventOutcome.entity";
import ProjectionEventHeatOutcome from "../../../../entities/wsl/projectionEventHeatOutcome.entity";
import ClientApiKey from "../../../../entities/clientApiKeys.entity";
import PropBets from "../../../../entities/wsl/propBets.entity";
import PlayerHeadToHeads from "../../../../entities/wsl/playerHeadToHeads.entity";
import ProjectionEventShows from "../../../../entities/wsl/projectionEventShows.entity";
import ProjectionEventPodiums from "../../../../entities/wsl/projectionEventPodiums.entity";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([
      ProjectionEventOutcome,
      ProjectionEventHeatOutcome,
      ClientApiKey,
      PropBets,
      PlayerHeadToHeads,
      ProjectionEventShows,
      ProjectionEventPodiums,
    ]),
  ],
  providers: [OddsService, ClientService],
  controllers: [OddsController],
})
export default class OddsModule {}

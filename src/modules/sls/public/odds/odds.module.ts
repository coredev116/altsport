import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import OddsService from "./odds.service";
import ClientService from "../../../client/client.service";

import OddsController from "./odds.controller";

import ProjectionEventOutcome from "../../../../entities/sls/projectionEventOutcome.entity";
import ProjectionEventHeatOutcome from "../../../../entities/sls/projectionEventHeatOutcome.entity";
import ClientApiKey from "../../../../entities/clientApiKeys.entity";
import PlayerHeadToHeads from "../../../../entities/sls/playerHeadToHeads.entity";
import PropBets from "../../../../entities/sls/propBets.entity";
import ProjectionEventShows from "../../../../entities/sls/projectionEventShows.entity";
import ProjectionEventPodiums from "../../../../entities/sls/projectionEventPodiums.entity";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([
      ProjectionEventOutcome,
      ProjectionEventHeatOutcome,
      ClientApiKey,
      PlayerHeadToHeads,
      PropBets,
      ProjectionEventShows,
      ProjectionEventPodiums,
    ]),
  ],
  providers: [OddsService, ClientService],
  controllers: [OddsController],
})
export default class OddsModule {}

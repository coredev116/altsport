import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import OddsService from "./odds.service";
import ClientService from "../../../client/client.service";

import OddsController from "./odds.controller";

import ProjectionEventOutcome from "../../../../entities/nrx/projectionEventOutcome.entity";
import ProjectionEventShows from "../../../../entities/nrx/projectionEventShows.entity";
import ProjectionEventPodiums from "../../../../entities/nrx/projectionEventPodiums.entity";
import ProjectionEventHeatOutcome from "../../../../entities/nrx/projectionEventHeatOutcome.entity";
import PlayerHeadToHeads from "../../../../entities/nrx/playerHeadToHeads.entity";
import ClientApiKey from "../../../../entities/clientApiKeys.entity";
import PropBets from "../../../../entities/nrx/propBets.entity";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([
      ProjectionEventOutcome,
      ProjectionEventShows,
      ProjectionEventPodiums,
      ProjectionEventHeatOutcome,
      ClientApiKey,
      PropBets,
      PlayerHeadToHeads,
    ]),
  ],
  providers: [OddsService, ClientService],
  controllers: [OddsController],
})
export default class OddsModule {}

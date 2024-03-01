import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import OddsService from "./odds.service";
import ClientService from "../../../client/client.service";

import OddsController from "./odds.controller";

import ProjectionEventOutcome from "../../../../entities/spr/projectionEventOutcome.entity";
import ProjectionEventShows from "../../../../entities/spr/projectionEventShows.entity";
import ProjectionEventPodiums from "../../../../entities/spr/projectionEventPodiums.entity";
import ProjectionEventHeatOutcome from "../../../../entities/spr/projectionEventHeatOutcome.entity";
import PlayerHeadToHeads from "../../../../entities/spr/playerHeadToHeads.entity";
import ClientApiKey from "../../../../entities/clientApiKeys.entity";
import PropBets from "../../../../entities/spr/propBets.entity";

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

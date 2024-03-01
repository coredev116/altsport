import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { CacheModule } from "@nestjs/cache-manager";

import CacheConfigService from "../../../../factory/cache.factory";

import Event from "../../../../entities/sls/events.entity";
import League from "../../../../entities/sls/leagues.entity";
import ClientApiKey from "../../../../entities/clientApiKeys.entity";
import EventParticipants from "../../../../entities/sls/eventParticipants.entity";
import Scores from "../../../../entities/sls/scores.entity";
import RoundHeats from "../../../../entities/sls/roundHeats.entity";

import EventService from "./events.service";
import ClientService from "../../../client/client.service";

import EventController from "./events.controller";

@Module({
  imports: [
    CacheModule.registerAsync({
      useClass: CacheConfigService,
    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Event, League, EventParticipants, Scores, RoundHeats, ClientApiKey]),
  ],
  providers: [EventService, ClientService],
  controllers: [EventController],
})
export default class EventModule {}

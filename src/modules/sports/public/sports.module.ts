import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { CacheModule } from "@nestjs/cache-manager";

import CacheConfigService from "../../../factory/cache.factory";

import SportsController from "./sports.controller";

import NrxEventService from "../../nrx/public/events/events.service";
import SprEventService from "../../spr/public/events/events.service";
import WslEventService from "../../wsl/public/events/events.service";
import SlsEventService from "../../sls/public/events/events.service";

import Event from "../../../entities/nrx/events.entity";
import EventParticipants from "../../../entities/nrx/eventParticipants.entity";
import Scores from "../../../entities/nrx/scores.entity";
import RoundHeats from "../../../entities/nrx/roundHeats.entity";

import SprEvent from "../../../entities/spr/events.entity";
import SprEventParticipants from "../../../entities/spr/eventParticipants.entity";
import SprScores from "../../../entities/spr/scores.entity";
import SprRoundHeats from "../../../entities/spr/roundHeats.entity";

import WslEvent from "../../../entities/wsl/events.entity";
import WslEventParticipants from "../../../entities/wsl/eventParticipants.entity";
import WslScores from "../../../entities/wsl/scores.entity";
import WslRoundHeats from "../../../entities/wsl/roundHeats.entity";

import SlsEvent from "../../../entities/sls/events.entity";
import SlsEventParticipants from "../../../entities/sls/eventParticipants.entity";
import SlsScores from "../../../entities/sls/scores.entity";
import SlsRoundHeats from "../../../entities/sls/roundHeats.entity";

import ClientService from "../../client/client.service";
import ClientApiKey from "../../../entities/clientApiKeys.entity";

@Module({
  imports: [
    CacheModule.registerAsync({
      useClass: CacheConfigService,
    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([
      Event,
      EventParticipants,
      Scores,
      RoundHeats,
      SprEvent,
      SprEventParticipants,
      SprScores,
      SprRoundHeats,
      WslEvent,
      WslEventParticipants,
      WslScores,
      WslRoundHeats,
      SlsEvent,
      SlsEventParticipants,
      SlsScores,
      SlsRoundHeats,
      ClientApiKey,
    ]),
  ],
  providers: [NrxEventService, SprEventService, WslEventService, SlsEventService, ClientService],
  controllers: [SportsController],
})
export default class SportsModule {}

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { CacheModule } from "@nestjs/cache-manager";

import CacheConfigService from "../../../factory/cache.factory";

import WslEvent from "../../../entities/wsl/events.entity";
import SlsEvent from "../../../entities/sls/events.entity";
import NrxEvent from "../../../entities/nrx/events.entity";
import SprEvent from "../../../entities/spr/events.entity";
import MotocrsEvent from "../../../entities/motocrs/events.entity";
import FdriftEvent from "../../../entities/fdrift/events.entity";
import MaslEvent from "../../../entities/masl/events.entity";
import F1Event from "../../../entities/f1/events.entity";
import MGEvent from "../../../entities/mg/events.entity";

import WslScore from "../../../entities/wsl/scores.entity";
import SlsScore from "../../../entities/sls/scores.entity";
import NrxScore from "../../../entities/nrx/scores.entity";
import SprScore from "../../../entities/spr/scores.entity";

import WslRoundHeat from "../../../entities/wsl/roundHeats.entity";
import SlsRoundHeat from "../../../entities/sls/roundHeats.entity";
import NrxRoundHeat from "../../../entities/nrx/roundHeats.entity";
import SprRoundHeat from "../../../entities/spr/roundHeats.entity";

import F1ProjectionDreamTeam from "../../../entities/f1/projectionDreamTeam.entity";
import MGProjectionDreamTeam from "../../../entities/mg/projectionDreamTeam.entity";
import MXGPProjectionDreamTeam from "../../../entities/mxgp/projectionDreamTeam.entity";

import MOTOCRSProjectionExactas from "../../../entities/motocrs/projectionExactas.entity";

import EventService from "./events.service";

import EventController from "./events.controller";

import ClientService from "../../client/client.service";
import ClientApiKey from "../../../entities/clientApiKeys.entity";

@Module({
  imports: [
    CacheModule.registerAsync({
      useClass: CacheConfigService,
    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([
      ClientApiKey,
      WslEvent,
      SlsEvent,
      NrxEvent,
      SprEvent,
      MotocrsEvent,
      FdriftEvent,
      MaslEvent,
      F1Event,
      MGEvent,
      WslScore,
      SlsScore,
      NrxScore,
      SprScore,
      WslRoundHeat,
      SlsRoundHeat,
      NrxRoundHeat,
      SprRoundHeat,
      F1ProjectionDreamTeam,
      MGProjectionDreamTeam,
      MXGPProjectionDreamTeam,
      MOTOCRSProjectionExactas,
    ]),
  ],
  providers: [EventService, ClientService],
  controllers: [EventController],
})
export default class EventModule {}

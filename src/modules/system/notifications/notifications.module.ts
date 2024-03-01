import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import NotificationsService from "./notifications.service";

import TwilioService from "../../../services/twilio.service";

import WSLEvents from "../../../entities/wsl/events.entity";
import SLSEvents from "../../../entities/sls/events.entity";
import MASLEvents from "../../../entities/masl/events.entity";
import NRXEvents from "../../../entities/nrx/events.entity";
import SPREvents from "../../../entities/spr/events.entity";
import MOTOCRSEvents from "../../../entities/motocrs/events.entity";
import FDRIFTEvents from "../../../entities/fdrift/events.entity";
import F1Events from "../../../entities/f1/events.entity";
import MGEvents from "../../../entities/mg/events.entity";
import MXGPEvents from "../../../entities/mxgp/events.entity";

import WSLFutures from "../../../entities/wsl/futures.entity";
import SLSFutures from "../../../entities/sls/futures.entity";
import MASLFutures from "../../../entities/masl/futures.entity";
import NRXFutures from "../../../entities/nrx/futures.entity";
import SPRFutures from "../../../entities/spr/futures.entity";
import MOTOCRSFutures from "../../../entities/motocrs/futures.entity";
import FDRIFTFutures from "../../../entities/fdrift/futures.entity";
import F1Futures from "../../../entities/f1/futures.entity";
import MGFutures from "../../../entities/mg/futures.entity";
import MXGPFutures from "../../../entities/mxgp/futures.entity";

import WSLRoundHeats from "../../../entities/wsl/roundHeats.entity";

import WSLClientProjectionEventOutcome from "../../../entities/wsl/clientProjectionEventOutcome.entity";
import WSLClientProjectionEventHeatOutcome from "../../../entities/wsl/clientProjectionEventHeatOutcome.entity";
import WSLClientPlayerHeadToHeads from "../../../entities/wsl/clientPlayerHeadToHeads.entity";

import ClientMarketNotifications from "../../../entities/clientMarketNotifications.entity";
import OddMarkets from "../../../entities/oddMarkets.entity";

import OpenbetHelperService from "./openbet.service";
import OpenbetAPIService from "../../../services/openbet-api.service";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([
      WSLEvents,
      SLSEvents,
      MASLEvents,
      NRXEvents,
      SPREvents,
      MOTOCRSEvents,
      FDRIFTEvents,
      F1Events,
      MGEvents,
      MXGPEvents,

      WSLFutures,
      SLSFutures,
      MASLFutures,
      NRXFutures,
      SPRFutures,
      MOTOCRSFutures,
      FDRIFTFutures,
      F1Futures,
      MGFutures,
      MXGPFutures,

      ClientMarketNotifications,
      OddMarkets,

      WSLClientProjectionEventOutcome,
      WSLClientProjectionEventHeatOutcome,
      WSLClientPlayerHeadToHeads,
      WSLRoundHeats,
    ]),
  ],
  providers: [NotificationsService, TwilioService, OpenbetHelperService, OpenbetAPIService],
  controllers: [],
  exports: [NotificationsService],
})
export default class SyncMaslModule {}

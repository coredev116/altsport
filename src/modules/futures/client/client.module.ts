import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import ClientController from "./client.controller";
import { ClientService } from "./client.service";

import WSLTourYears from "../../../entities/wsl/tourYears.entity";
import SLSTourYears from "../../../entities/sls/leagueYears.entity";
import NRXTourYears from "../../../entities/nrx/tourYears.entity";
import SPRTourYears from "../../../entities/spr/tourYears.entity";
import MASLTourYears from "../../../entities/masl/leagueYears.entity";
import FdriftTourYears from "../../../entities/fdrift/tourYears.entity";
import MOTOCRSTourYears from "../../../entities/motocrs/tourYears.entity";
import F1TourYears from "../../../entities/f1/tourYears.entity";
import MGTourYears from "../../../entities/mg/tourYears.entity";
import MXGPTourYears from "../../../entities/mxgp/tourYears.entity";
import JATourYears from "../../../entities/ja/tourYears.entity";

import WSLFutures from "../../../entities/wsl/futures.entity";
import SLSFutures from "../../../entities/sls/futures.entity";
import NRXFutures from "../../../entities/nrx/futures.entity";
import SPRFutures from "../../../entities/spr/futures.entity";
import MASLFutures from "../../../entities/masl/futures.entity";
import FdriftFutures from "../../../entities/fdrift/futures.entity";
import MOTOCRSFutures from "../../../entities/motocrs/futures.entity";
import F1Futures from "../../../entities/f1/futures.entity";
import MGFutures from "../../../entities/mg/futures.entity";
import MXGPFutures from "../../../entities/mxgp/futures.entity";
import JAFutures from "../../../entities/ja/futures.entity";

import WSLClientFutureOdds from "../../../entities/wsl/clientFutureOdds.entity";
import SLSClientFutureOdds from "../../../entities/sls/clientFutureOdds.entity";
import NRXClientFutureOdds from "../../../entities/nrx/clientFutureOdds.entity";
import SPRClientFutureOdds from "../../../entities/spr/clientFutureOdds.entity";
import MASLClientFutureOdds from "../../../entities/masl/clientFutureOdds.entity";
import FdriftClientFutureOdds from "../../../entities/fdrift/clientFutureOdds.entity";
import MOTOCRSClientFutureOdds from "../../../entities/motocrs/clientFutureOdds.entity";
import F1ClientFutureOdds from "../../../entities/f1/clientFutureOdds.entity";
import MGClientFutureOdds from "../../../entities/mg/clientFutureOdds.entity";
import MXGPClientFutureOdds from "../../../entities/mxgp/clientFutureOdds.entity";
import JAClientFutureOdds from "../../../entities/ja/clientFutureOdds.entity";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([
      WSLTourYears,
      SLSTourYears,
      NRXTourYears,
      SPRTourYears,
      MASLTourYears,
      FdriftTourYears,
      F1TourYears,
      MGTourYears,
      MXGPTourYears,
      MOTOCRSTourYears,
      JATourYears,

      WSLFutures,
      SLSFutures,
      NRXFutures,
      SPRFutures,
      MASLFutures,
      FdriftFutures,
      MOTOCRSFutures,
      F1Futures,
      MGFutures,
      MXGPFutures,
      JAFutures,

      WSLClientFutureOdds,
      SLSClientFutureOdds,
      NRXClientFutureOdds,
      SPRClientFutureOdds,
      MASLClientFutureOdds,
      FdriftClientFutureOdds,
      MOTOCRSClientFutureOdds,
      F1ClientFutureOdds,
      MGClientFutureOdds,
      MXGPClientFutureOdds,
      JAClientFutureOdds,
    ]),
  ],
  controllers: [ClientController],
  providers: [ClientService],
})
export default class ClientModule {}

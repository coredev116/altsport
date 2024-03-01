import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { CacheModule } from "@nestjs/cache-manager";

import AdminController from "./admin.controller";
import { AdminService } from "./admin.service";

import CacheConfigService from "../../../factory/cache.factory";

import QueueModule from "../../system/queue/queue.module";

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

import WSLFutureOdds from "../../../entities/wsl/futureOdds.entity";
import SLSFutureOdds from "../../../entities/sls/futureOdds.entity";
import NRXFutureOdds from "../../../entities/nrx/futureOdds.entity";
import SPRFutureOdds from "../../../entities/spr/futureOdds.entity";
import MASLFutureOdds from "../../../entities/masl/futureOdds.entity";
import FdriftFutureOdds from "../../../entities/fdrift/futureOdds.entity";
import MOTOCRSFutureOdds from "../../../entities/motocrs/futureOdds.entity";
import F1FutureOdds from "../../../entities/f1/futureOdds.entity";
import MGFutureOdds from "../../../entities/mg/futureOdds.entity";
import MXGPFutureOdds from "../../../entities/mxgp/futureOdds.entity";
import JAFutureOdds from "../../../entities/ja/futureOdds.entity";

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

// import WSLClientFuture from "../../../entities/wsl/futures.entity";
// import SLSClientFuture from "../../../entities/sls/futures.entity";
// import NRXClientFuture from "../../../entities/nrx/futures.entity";
// import SPRClientFuture from "../../../entities/spr/futures.entity";
// import MASLClientFuture from "../../../entities/masl/futures.entity";
// import FdriftClientFuture from "../../../entities/fdrift/futures.entity";
// import MOTOCRSClientFuture from "../../../entities/motocrs/futures.entity";
// import F1ClientFuture from "../../../entities/f1/futures.entity";
// import MGClientFuture from "../../../entities/mg/futures.entity";
// import MXGPClientFuture from "../../../entities/mxgp/futures.entity";
// import JAClientFuture from "../../../entities/ja/futures.entity";

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.registerAsync({
      useClass: CacheConfigService,
    }),
    QueueModule,
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

      WSLFutureOdds,
      SLSFutureOdds,
      NRXFutureOdds,
      SPRFutureOdds,
      MASLFutureOdds,
      FdriftFutureOdds,
      MOTOCRSFutureOdds,
      F1FutureOdds,
      MGFutureOdds,
      MXGPFutureOdds,
      JAFutureOdds,

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

      // WSLClientFuture,
      // SLSClientFuture,
      // NRXClientFuture,
      // SPRClientFuture,
      // MASLClientFuture,
      // FdriftClientFuture,
      // MOTOCRSClientFuture,
      // F1ClientFuture,
      // MGClientFuture,
      // MXGPClientFuture,
      // JAClientFuture,
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export default class AdminModule {}

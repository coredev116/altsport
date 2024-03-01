import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { CacheModule } from "@nestjs/cache-manager";

import CacheConfigService from "../../../factory/cache.factory";

import { AdminToursService } from "./admin.tours.service";

import { AdminToursController } from "./admin.tours.controller";

import SLSTours from "../../../entities/sls/leagues.entity";
import WSLTours from "../../../entities/wsl/tours.entity";
import NRXTours from "../../../entities/nrx/tours.entity";
import SPRTours from "../../../entities/spr/tours.entity";
import MASLTours from "../../../entities/masl/leagues.entity";
import MotocrossTours from "../../../entities/motocrs/tours.entity";
import FormulaDriftTours from "../../../entities/fdrift/tours.entity";
import F1Tours from "../../../entities/f1/tours.entity";
import MGTours from "../../../entities/mg/tours.entity";
import MXGPTours from "../../../entities/mxgp/tours.entity";
import JATours from "../../../entities/ja/tours.entity";

@Module({
  imports: [
    CacheModule.registerAsync({
      useClass: CacheConfigService,
    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([
      SLSTours,
      WSLTours,
      NRXTours,
      SPRTours,
      MASLTours,
      Event,
      MotocrossTours,
      FormulaDriftTours,
      F1Tours,
      MGTours,
      MXGPTours,
      JATours,
    ]),
  ],
  controllers: [AdminToursController],
  providers: [AdminToursService],
})
export default class AdminToursModule {}

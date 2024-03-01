import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { CacheModule } from "@nestjs/cache-manager";

import CacheConfigService from "../../../factory/cache.factory";

import WSLTours from "../../../entities/wsl/tours.entity";
import SLSLeagues from "../../../entities/sls/leagues.entity";
import NRXTours from "../../../entities/nrx/tours.entity";
import SPRTours from "../../../entities/spr/tours.entity";
import MASLEvents from "../../../entities/masl/events.entity";
import MASLLeagueYears from "../../../entities/masl/leagueYears.entity";
import MASLLeagues from "../../../entities/masl/leagues.entity";
import FDriftTours from "../../../entities/fdrift/tours.entity";
import MotocrossTours from "../../../entities/motocrs/tours.entity";
import F1Tours from "../../../entities/f1/tours.entity";
import MGTours from "../../../entities/mg/tours.entity";
import MXGPTours from "../../../entities/mxgp/tours.entity";
import JATours from "../../../entities/ja/tours.entity";

import JAEvents from "../../../entities/ja/events.entity";
import JAEventTeams from "../../../entities/ja/eventTeams.entity";
import JATeams from "../../../entities/ja/teams.entity";

import SportsService from "./sports.service";

import SportsController from "./sports.controller";

@Module({
  imports: [
    CacheModule.registerAsync({
      useClass: CacheConfigService,
    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([
      WSLTours,
      SLSLeagues,
      NRXTours,
      SPRTours,
      MASLEvents,
      MASLLeagueYears,
      MASLLeagues,
      FDriftTours,
      MotocrossTours,
      F1Tours,
      MGTours,
      MXGPTours,
      JATours,
      JAEvents,
      JAEventTeams,
      JATeams,
    ]),
  ],
  providers: [SportsService],
  controllers: [SportsController],
})
export default class SportsModule {}

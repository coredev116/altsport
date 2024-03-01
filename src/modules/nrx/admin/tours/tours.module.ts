import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { CacheModule } from "@nestjs/cache-manager";

import CacheConfigService from "../../../../factory/cache.factory";

import Tour from "../../../../entities/nrx/tours.entity";
import TourYears from "../../../../entities/nrx/tourYears.entity";

import TourService from "./tours.service";

import TourController from "./tours.controller";

@Module({
  imports: [
    CacheModule.registerAsync({
      useClass: CacheConfigService,
    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Tour, TourYears]),
  ],
  providers: [TourService],
  controllers: [TourController],
})
export default class TourModule {}

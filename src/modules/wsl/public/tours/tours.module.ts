import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { CacheModule } from "@nestjs/cache-manager";

import CacheConfigService from "../../../../factory/cache.factory";

import Tour from "../../../../entities/wsl/tours.entity";
import Sport from "../../../../entities/sports.entity";
import TourYears from "../../../../entities/wsl/tourYears.entity";
import ClientApiKey from "../../../../entities/clientApiKeys.entity";

import TourService from "./tours.service";
import ClientService from "../../../client/client.service";

import TourController from "./tours.controller";

@Module({
  imports: [
    CacheModule.registerAsync({
      useClass: CacheConfigService,
    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Tour, Sport, TourYears, ClientApiKey]),
  ],
  providers: [TourService, ClientService],
  controllers: [TourController],
})
export default class TourModule {}

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { CacheModule } from "@nestjs/cache-manager";

import CacheConfigService from "../../../../factory/cache.factory";

import AthleteController from "./athletes.controller";

import ClientApiKey from "../../../../entities/clientApiKeys.entity";

import AthletesStats from "../../../../entities/motocrs/athletesStats.entity";
import Tours from "../../../../entities/motocrs/tours.entity";

import ClientService from "../../../client/client.service";
import AthleteService from "./athletes.service";

@Module({
  imports: [
    CacheModule.registerAsync({
      useClass: CacheConfigService,
    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([ClientApiKey, AthletesStats, Tours]),
  ],
  providers: [AthleteService, ClientService],
  controllers: [AthleteController],
})
export default class AthleteModule {}

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { CacheModule } from "@nestjs/cache-manager";

import CacheConfigService from "../../../../factory/cache.factory";

import AthleteController from "./athletes.controller";

import Athletes from "../../../../entities/sls/athletes.entity";
import ClientApiKey from "../../../../entities/clientApiKeys.entity";
import Scores from "../../../../entities/sls/scores.entity";
import Events from "../../../../entities/sls/events.entity";

import ClientService from "../../../client/client.service";
import AthleteService from "./athletes.service";

@Module({
  imports: [
    CacheModule.registerAsync({
      useClass: CacheConfigService,
    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Athletes, ClientApiKey, Scores, Events]),
  ],
  providers: [AthleteService, ClientService],
  controllers: [AthleteController],
})
export default class AthleteModule {}

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { CacheModule } from "@nestjs/cache-manager";

import CacheConfigService from "../../../../factory/cache.factory";

import AthleteController from "./athletes.controller";

import Athletes from "../../../../entities/nrx/athletes.entity";
import Scores from "../../../../entities/nrx/scores.entity";
import ClientApiKey from "../../../../entities/clientApiKeys.entity";
import Events from "../../../../entities/nrx/events.entity";

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

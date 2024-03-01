import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CacheModule } from "@nestjs/cache-manager";

import CacheConfigService from "../../../../factory/cache.factory";

import AthleteController from "./athletes.controller";

import Athletes from "../../../../entities/wsl/athletes.entity";
import Scores from "../../../../entities/wsl/scores.entity";
import ClientApiKey from "../../../../entities/clientApiKeys.entity";
import Events from "../../../../entities/wsl/events.entity";

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

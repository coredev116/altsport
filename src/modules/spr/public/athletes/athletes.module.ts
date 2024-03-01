import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { CacheModule } from "@nestjs/cache-manager";

import CacheConfigService from "../../../../factory/cache.factory";

import AthleteController from "./athletes.controller";

// import Athletes from "../../../../entities/spr/athletes.entity";
// import Scores from "../../../../entities/spr/scores.entity";
import ClientApiKey from "../../../../entities/clientApiKeys.entity";
// import Events from "../../../../entities/spr/events.entity";
import AthletesStats from "../../../../entities/spr/athletesStats.entity";
import Tours from "../../../../entities/spr/tours.entity";

import ClientService from "../../../client/client.service";
import AthleteService from "./athletes.service";

@Module({
  imports: [
    CacheModule.registerAsync({
      useClass: CacheConfigService,
    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([/* Athletes, Scores, Events, */ ClientApiKey, AthletesStats, Tours]),
  ],
  providers: [AthleteService, ClientService],
  controllers: [AthleteController],
})
export default class AthleteModule {}

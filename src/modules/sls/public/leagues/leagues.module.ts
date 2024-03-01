import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { CacheModule } from "@nestjs/cache-manager";

import CacheConfigService from "../../../../factory/cache.factory";

import League from "../../../../entities/sls/leagues.entity";
import LeaguesYears from "../../../../entities/sls/leagueYears.entity";
import ClientApiKey from "../../../../entities/clientApiKeys.entity";

import LeagueService from "./leagues.service";
import ClientService from "../../../client/client.service";

import LeagueController from "./leagues.controller";

@Module({
  imports: [
    CacheModule.registerAsync({
      useClass: CacheConfigService,
    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([League, LeaguesYears, ClientApiKey]),
  ],
  providers: [LeagueService, ClientService],
  controllers: [LeagueController],
})
export default class LeaguesModule {}

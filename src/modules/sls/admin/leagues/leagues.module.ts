import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CacheModule } from "@nestjs/cache-manager";

import CacheConfigService from "../../../../factory/cache.factory";

import Leagues from "../../../../entities/sls/leagues.entity";
import LeagueYears from "../../../../entities/sls/leagueYears.entity";

import { LeaguesService } from "./leagues.service";

import LeaguesController from "./leagues.controller";

@Module({
  imports: [
    CacheModule.registerAsync({
      useClass: CacheConfigService,
    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Leagues, LeagueYears]),
  ],

  controllers: [LeaguesController],
  providers: [LeaguesService],
})
export default class LeaguesModule {}

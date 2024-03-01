import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CacheModule } from "@nestjs/cache-manager";

import CacheConfigService from "../../../../factory/cache.factory";

import AthleteService from "./athlete.service";

import AthleteController from "./athlete.controller";

import Athletes from "../../../../entities/sls/athletes.entity";

@Module({
  imports: [
    CacheModule.registerAsync({
      useClass: CacheConfigService,
    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Athletes]),
  ],
  controllers: [AthleteController],
  providers: [AthleteService],
})
export default class AthleteModule {}

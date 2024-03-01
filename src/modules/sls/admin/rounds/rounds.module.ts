import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { CacheModule } from "@nestjs/cache-manager";

import CacheConfigService from "../../../../factory/cache.factory";

import EventRounds from "../../../../entities/sls/eventRounds.entity";
import Rounds from "../../../../entities/sls/rounds.entity";

import { RoundsController } from "./rounds.controller";

import { RoundsService } from "./rounds.service";

@Module({
  imports: [
    CacheModule.registerAsync({
      useClass: CacheConfigService,
    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([EventRounds, Rounds]),
  ],

  controllers: [RoundsController],
  providers: [RoundsService],
})
export default class RoundsModule {}

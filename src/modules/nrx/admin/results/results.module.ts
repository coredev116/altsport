import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { CacheModule } from "@nestjs/cache-manager";

import CacheConfigService from "../../../../factory/cache.factory";

import ResultService from "./results.service";

import ResultController from "./results.controller";

import Athletes from "../../../../entities/nrx/athletes.entity";
import Events from "../../../../entities/nrx/events.entity";
import EventResults from "../../../../entities/nrx/eventResults.entity";

@Module({
  imports: [
    CacheModule.registerAsync({
      useClass: CacheConfigService,
    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Athletes, Events, EventResults]),
  ],
  providers: [ResultService],
  controllers: [ResultController],
})
export default class ResultModule {}

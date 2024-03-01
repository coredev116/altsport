import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { CacheModule } from "@nestjs/cache-manager";

import CacheConfigService from "../../../../factory/cache.factory";

import ResultsController from "./results.controller";

import Athletes from "../../../../entities/nrx/athletes.entity";
import ClientApiKey from "../../../../entities/clientApiKeys.entity";
import EventResults from "../../../../entities/nrx/eventResults.entity";

import ClientService from "../../../client/client.service";
import ResultsService from "./results.service";

@Module({
  imports: [
    CacheModule.registerAsync({
      useClass: CacheConfigService,
    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Athletes, ClientApiKey, EventResults]),
  ],
  providers: [ResultsService, ClientService],
  controllers: [ResultsController],
})
export default class ResultModule {}

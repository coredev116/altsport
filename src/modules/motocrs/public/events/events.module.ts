import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { CacheModule } from "@nestjs/cache-manager";

import CacheConfigService from "../../../../factory/cache.factory";

import Event from "../../../../entities/motocrs/events.entity";
import ClientApiKey from "../../../../entities/clientApiKeys.entity";

import EventService from "./events.service";
import ClientService from "../../../client/client.service";

import EventController from "./events.controller";

@Module({
  imports: [
    CacheModule.registerAsync({
      useClass: CacheConfigService,
    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Event, ClientApiKey]),
  ],
  providers: [EventService, ClientService],
  controllers: [EventController],
})
export default class EventModule {}

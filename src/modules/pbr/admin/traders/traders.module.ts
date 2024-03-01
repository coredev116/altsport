import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CacheModule } from "@nestjs/cache-manager";

import CacheConfigService from "../../../../factory/cache.factory";

import TraderController from "./traders.controller";

import PbrSyncModule from "../../../system/sync/pbr/sync.pbr.module";
@Module({
  imports: [
    CacheModule.registerAsync({
      useClass: CacheConfigService,
    }),
    ConfigModule.forRoot(),
    PbrSyncModule,
  ],
  providers: [],
  controllers: [TraderController],
  exports: [],
})
export default class TraderModule {}

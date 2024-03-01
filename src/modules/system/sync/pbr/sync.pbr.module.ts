import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import PbrSyncService from "./sync.pbr.service";

import Events from "../../../../entities/pbr/events.entity";

import PbrService from "../../../../services/pbr.service";

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forFeature([Events])],
  providers: [PbrSyncService, PbrService],
  controllers: [],
  exports: [PbrSyncService],
})
export default class SyncPbrModule {}

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import LogsController from "./logs.controller";

import ClientMarketDownloadLog from "../../../entities/clientMarketDownloadLogs.entity";

import LogsService from "./logs.service";

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forFeature([ClientMarketDownloadLog])],
  providers: [LogsService],
  controllers: [LogsController],
})
export default class LogsModule {}

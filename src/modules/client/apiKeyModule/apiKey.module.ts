import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import ApiKeyController from "./apiKey.controller";

import ClientApiKey from "../../../entities/clientApiKeys.entity";

import ApiKeyService from "./apiKey.service";

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forFeature([ClientApiKey])],
  providers: [ApiKeyService],
  controllers: [ApiKeyController],
})
export default class ApiKeyModule {}

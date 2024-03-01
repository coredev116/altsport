import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import { AuthController } from "./auth.controller";

import Clients from "../../entities/clients.entity";
import ClientApiKey from "../../entities/clientApiKeys.entity";

import Users from "../../entities/users.entity";

import { AuthService } from "./auth.service";
import ClientService from "../client/client.service";

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forFeature([Clients, ClientApiKey, Users])],

  controllers: [AuthController],
  providers: [AuthService, ClientService],
})
export default class AuthModule {}

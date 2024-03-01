import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import { AuthController } from "./auth.controller";

import Clients from "../../../entities/clients.entity";
import ClientMarketNotifications from "../../../entities/clientMarketNotifications.entity";

import { AuthService } from "./auth.service";
import TwilioService from "../../../services/twilio.service";

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forFeature([Clients, ClientMarketNotifications])],
  controllers: [AuthController],
  providers: [AuthService, TwilioService],
})
export default class AuthModule {}

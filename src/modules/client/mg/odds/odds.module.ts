import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import { OddsService } from "./odds.service";

import { OddsController } from "./odds.controller";

import Event from "../../../../entities/mg/events.entity";
import ClientPlayerHeadToHeads from "../../../../entities/mg/clientPlayerHeadToHeads.entity";

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forFeature([Event, ClientPlayerHeadToHeads])],
  controllers: [OddsController],
  providers: [OddsService],
})
export default class OddsModule {}

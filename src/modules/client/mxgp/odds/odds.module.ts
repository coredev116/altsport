import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import { OddsService } from "./odds.service";

import { OddsController } from "./odds.controller";

import Event from "../../../../entities/mxgp/events.entity";
import ClientPlayerHeadToHeads from "../../../../entities/mxgp/clientPlayerHeadToHeads.entity";

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forFeature([Event, ClientPlayerHeadToHeads])],
  controllers: [OddsController],
  providers: [OddsService],
})
export default class OddsModule {}

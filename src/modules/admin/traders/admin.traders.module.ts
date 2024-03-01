import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { CacheModule } from "@nestjs/cache-manager";

import CacheConfigService from "../../../factory/cache.factory";

import { AdminTradersController } from "./admin.traders.controller";

import { AdminTradersService } from "./admin.traders.service";

import SLSEvents from "../../../entities/sls/events.entity";
import WSLEvents from "../../../entities/wsl/events.entity";
import NRXEvents from "../../../entities/nrx/events.entity";
import SPREvents from "../../../entities/spr/events.entity";
import PBREvents from "../../../entities/pbr/events.entity";
import MASLEvents from "../../../entities/masl/events.entity";
import F1Events from "../../../entities/f1/events.entity";
import FDriftEvents from "../../../entities/fdrift/events.entity";
import MotocrossEvents from "../../../entities/motocrs/events.entity";
import MGEvents from "../../../entities/mg/events.entity";
import MXGPEvents from "../../../entities/mxgp/events.entity";
import JAEvents from "../../../entities/ja/events.entity";

@Module({
  imports: [
    CacheModule.registerAsync({
      useClass: CacheConfigService,
    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([
      SLSEvents,
      WSLEvents,
      NRXEvents,
      SPREvents,
      MASLEvents,
      PBREvents,
      F1Events,
      FDriftEvents,
      MotocrossEvents,
      MGEvents,
      MXGPEvents,
      JAEvents,
    ]),
  ],
  controllers: [AdminTradersController],
  providers: [AdminTradersService],
})
export default class AdminTradersModule {}

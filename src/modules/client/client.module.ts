import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import ClientService from "./client.service";
import ClientApiKeys from "../../entities/clientApiKeys.entity";

import AuthModule from "./auth/auth.module";
import ClientSettingsModule from "./settings/settings.module";
import LogsModule from "./clientLogs/logs.module";

import SportsModule from "./sports/sports.module";

import WslClientModule from "./wsl/wsl.module";
import SlsClientModule from "./sls/sls.module";
import NrxClientModule from "./nrx/nrx.module";
import SprClientModule from "./spr/spr.module";
import FDriftClientModule from "./fdrift/fdrift.module";
import MotocrsClientModule from "./motocrs/motocrs.module";
import F1ClientModule from "./f1/f1.module";
import MgClientModule from "./mg/mg.module";
import MxgpClientModule from "./mxgp/mxgp.module";
import JAClientModule from "./ja/ja.module";
import MASLClientModule from "./masl/masl.module";

@Module({
  imports: [
    AuthModule,
    ClientSettingsModule,
    LogsModule,
    SportsModule,
    WslClientModule,
    SlsClientModule,
    NrxClientModule,
    SprClientModule,
    FDriftClientModule,
    MotocrsClientModule,
    F1ClientModule,
    MgClientModule,
    MxgpClientModule,
    JAClientModule,
    MASLClientModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([ClientApiKeys]),
  ],
  controllers: [],
  providers: [ClientService],
})
export default class ClientModule {}

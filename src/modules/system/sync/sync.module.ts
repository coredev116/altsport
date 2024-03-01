import { Module } from "@nestjs/common";

import MASLSyncModule from "./masl/sync.masl.module";
import PBRSyncModule from "./pbr/sync.pbr.module";
import WSLSyncModule from "./wsl/sync.wsl.module";
import SLSSyncModule from "./sls/sync.sls.module";

@Module({
  imports: [MASLSyncModule, WSLSyncModule, PBRSyncModule, SLSSyncModule],
  providers: [],
  controllers: [],
})
export default class SyncModule {}

import { Controller, Get } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";

import { SportsTypes } from "../../../../constants/system";

import PbrSyncService from "../../../system/sync/pbr/sync.pbr.service";

@ApiTags("pbr_traders")
@Controller({
  path: `admin/${SportsTypes.PBR}/traders`,
})
export default class TraderController {
  constructor(private pbrSyncService: PbrSyncService) {}

  @ApiResponse({
    type: Boolean,
    status: 200,
  })
  @Get("sync")
  async sync() {
    await this.pbrSyncService.syncScheduledEvents();
  }

  @ApiResponse({
    type: Boolean,
    status: 200,
  })
  @Get("update-sync")
  async updateSync() {
    await this.pbrSyncService.syncLiveEvents();
  }
}

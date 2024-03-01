import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApiBody, ApiResponse, ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";

import { ClientMarketDownloadLogDto } from "./dto/clientMarketDownloadLog.dto";

import LogsService from "./logs.service";

import * as authExceptions from "../../../exceptions/auth";

import ApiGuard from "../../../guards/clientApi.guard";

import { Client } from "../../../decorators/client.decorator";

@ApiBearerAuth()
@UseGuards(ApiGuard)
@ApiTags("Client Logs")
@Controller({
  path: `client/logs/market/download`,
})
export default class LogController {
  constructor(private readonly logsService: LogsService) {}

  @ApiBody({ type: ClientMarketDownloadLogDto })
  @ApiOperation({
    summary: "Add client market download log entry",
    description: "Add client market download log entry",
  })
  @ApiResponse({
    description: "Success",
    type: Boolean,
    status: 200,
  })
  @Post()
  async createClientMarketDownloadLogs(
    @Body() data: ClientMarketDownloadLogDto,
    @Client("userId") userId: string,
  ): Promise<boolean> {
    if (!userId) throw authExceptions.userIdNotPresent();
    return this.logsService.createClientMarketDownloadLogs(data, userId);
  }
}

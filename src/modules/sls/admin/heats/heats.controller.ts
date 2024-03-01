import { Body, Controller, Post, UseGuards, Inject } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { ApiBody, ApiResponse, ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";

import { HeatDto } from "./dto/heats.dto";

import { HeatsService } from "./heats.service";

import { SportsTypes } from "../../../../constants/system";

import ApiGuard from "../../../../guards/adminApi.guard";

@ApiBearerAuth()
@UseGuards(ApiGuard)
@ApiTags("heats")
@Controller({
  path: `admin/${SportsTypes.SKATEBOARDING}/heats`,
})
export default class HeatController {
  constructor(
    private readonly heatService: HeatsService,
    @Inject(CACHE_MANAGER) protected readonly cacheManager,
  ) {}

  @ApiBody({ type: HeatDto })
  @ApiResponse({
    description: "Success",
    type: Boolean,
    status: 200,
  })
  @ApiOperation({
    summary: "Bulk insert heats",
    description: "API to bulk insert heats",
  })
  @Post()
  async createHeat(@Body() heat: HeatDto): Promise<boolean> {
    const result = await this.heatService.createHeat(heat);

    this.cacheManager.reset();

    return result;
  }
}

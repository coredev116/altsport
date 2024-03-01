import { Body, Controller, Post, UseGuards, Inject } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { ApiBody, ApiResponse, ApiTags, ApiBearerAuth } from "@nestjs/swagger";

import HeatDto from "./dto/heats.dto";

import HeatService from "./heats.service";

import { SportsTypes } from "../../../../constants/system";

import ApiGuard from "../../../../guards/adminApi.guard";

@ApiBearerAuth()
@UseGuards(ApiGuard)
@ApiTags("heats")
@Controller({
  path: `admin/${SportsTypes.SUPERCROSS}/heats`,
})
export default class HeatController {
  constructor(
    private readonly heatService: HeatService,
    @Inject(CACHE_MANAGER) protected readonly cacheManager,
  ) {}

  @ApiBody({ type: HeatDto })
  @ApiResponse({
    description: "Success",
    type: Boolean,
    status: 200,
  })
  @Post()
  async createHeat(@Body() heat: HeatDto): Promise<boolean> {
    const result = await this.heatService.createHeat(heat);

    this.cacheManager.reset();

    return result;
  }
}

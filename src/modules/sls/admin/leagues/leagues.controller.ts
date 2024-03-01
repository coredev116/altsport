import { Body, Controller, Post, UseGuards, Inject } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { ApiBody, ApiResponse, ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";

import { SportsTypes } from "../../../../constants/system";

import LeagueDto from "./dto/leagues.dto";

import { LeaguesService } from "./leagues.service";

import ApiGuard from "../../../../guards/adminApi.guard";

@ApiBearerAuth()
@UseGuards(ApiGuard)
@ApiTags("leagues")
@Controller({
  path: `admin/${SportsTypes.SKATEBOARDING}/leagues`,
})
export default class LeagueController {
  constructor(
    private readonly leagueService: LeaguesService,
    @Inject(CACHE_MANAGER) protected readonly cacheManager,
  ) {}

  @ApiBody({ type: LeagueDto })
  @ApiOperation({
    summary: "Bulk insert leagues",
    description: "API to bulk insert leagues",
  })
  @ApiResponse({
    description: "Success",
    type: Boolean,
    status: 200,
  })
  @Post()
  async create(@Body() league: LeagueDto): Promise<boolean> {
    const result = await this.leagueService.createLeague(league);

    this.cacheManager.reset();

    return result;
  }
}

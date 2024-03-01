import { Body, Controller, Post, UseGuards, Inject } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { ApiBody, ApiResponse, ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";

import { RoundDto } from "./dto/rounds.dto";

import { SportsTypes } from "../../../../constants/system";

import { RoundsService } from "./rounds.service";

import ApiGuard from "../../../../guards/adminApi.guard";

@ApiBearerAuth()
@UseGuards(ApiGuard)
@ApiTags("rounds")
@Controller({
  path: `admin/${SportsTypes.SKATEBOARDING}/rounds`,
})
export class RoundsController {
  constructor(
    private readonly roundsService: RoundsService,
    @Inject(CACHE_MANAGER) protected readonly cacheManager,
  ) {}

  @ApiBody({ type: RoundDto })
  @ApiResponse({
    description: "Success",
    type: Boolean,
    status: 200,
  })
  @ApiOperation({
    summary: "Bulk insert rounds",
    description: "API to bulk insert rounds",
  })
  @Post()
  async create(@Body() round: RoundDto): Promise<boolean> {
    const result = await this.roundsService.createRound(round);

    this.cacheManager.reset();

    return result;
  }
}

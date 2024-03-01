import { Body, Controller, Post, UseGuards, Inject } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { ApiBody, ApiResponse, ApiTags, ApiBearerAuth } from "@nestjs/swagger";

import RoundDto from "./dto/rounds.dto";

import RoundService from "./rounds.service";

import { SportsTypes } from "../../../../constants/system";

import ApiGuard from "../../../../guards/adminApi.guard";

@ApiBearerAuth()
@UseGuards(ApiGuard)
@ApiTags("rounds")
@Controller({
  path: `admin/${SportsTypes.SUPERCROSS}/rounds`,
})
export default class RoundController {
  constructor(
    private readonly roundService: RoundService,
    @Inject(CACHE_MANAGER) protected readonly cacheManager,
  ) {}

  @ApiBody({ type: RoundDto })
  @ApiResponse({
    description: "Success",
    type: Boolean,
    status: 200,
  })
  @Post()
  async create(@Body() round: RoundDto): Promise<boolean> {
    const result = await this.roundService.createRound(round);

    this.cacheManager.reset();

    return result;
  }
}

import { Body, Controller, Post, UseGuards, Inject } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { ApiBody, ApiResponse, ApiTags, ApiBearerAuth } from "@nestjs/swagger";

import ResultDto from "./dto/results.dto";

import ResultService from "./results.service";

import { SportsTypes } from "../../../../constants/system";

import ApiGuard from "../../../../guards/adminApi.guard";

@ApiBearerAuth()
@UseGuards(ApiGuard)
@ApiTags("results")
@Controller({
  path: `admin/${SportsTypes.SKATEBOARDING}/results`,
})
export default class ResultController {
  constructor(
    private readonly resultService: ResultService,
    @Inject(CACHE_MANAGER) protected readonly cacheManager,
  ) {}

  @ApiBody({ type: ResultDto })
  @ApiResponse({
    description: "Success",
    type: Boolean,
    status: 200,
  })
  @Post()
  async createResultEvents(@Body() result: ResultDto): Promise<boolean> {
    const r = await this.resultService.createEventResults(result);

    this.cacheManager.reset();

    return r;
  }
}

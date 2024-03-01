import { Body, Controller, Get, Post, Inject } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { ApiBody, ApiResponse, ApiTags, ApiOperation } from "@nestjs/swagger";

import { SportsTypes } from "../../../../constants/system";

import AthleteDto from "./dto/athletes.dto";

import Athletes from "../../../../entities/wsl/athletes.entity";

import AthleteService from "./athletes.service";

@ApiTags("athletes")
@Controller({
  path: `admin/${SportsTypes.SURFING}/athletes`,
})
export default class AthleteController {
  constructor(
    private readonly athleteService: AthleteService,
    @Inject(CACHE_MANAGER) protected readonly cacheManager,
  ) {}

  @Get()
  @ApiOperation({
    summary: "Fetch athletes",
    description: "Fetch athletes",
  })
  @ApiResponse({
    description: "Success",
    type: Athletes,
    status: 200,
  })
  public async fetchAthletes(): Promise<Athletes[]> {
    return this.athleteService.fetchAthletes();
  }

  @ApiBody({ type: AthleteDto })
  @ApiResponse({
    description: "Success",
    type: Boolean,
    status: 200,
  })
  @Post()
  async createAthlete(@Body() athletes: AthleteDto): Promise<boolean> {
    const result = await this.athleteService.createAthlete(athletes);

    this.cacheManager.reset();

    return result;
  }
}

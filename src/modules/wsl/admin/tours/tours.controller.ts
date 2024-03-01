import { Body, Controller, Post, Get, UseGuards, Inject, Param } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { ApiBody, ApiResponse, ApiTags, ApiBearerAuth, ApiParam } from "@nestjs/swagger";

import TourDto from "./dto/tours.dto";
import TourService from "./tours.service";

import { SportsTypes, Gender } from "../../../../constants/system";

import ApiGuard from "../../../../guards/adminApi.guard";

@ApiBearerAuth()
@UseGuards(ApiGuard)
@ApiTags("tours")
@Controller({
  path: `admin/${SportsTypes.SURFING}/tours`,
})
export default class TourController {
  constructor(
    private readonly tourService: TourService,
    @Inject(CACHE_MANAGER) protected readonly cacheManager,
  ) {}

  @ApiBody({ type: TourDto })
  @ApiResponse({
    description: "Success",
    type: Boolean,
    status: 200,
  })
  @Post()
  async create(@Body() tour: TourDto): Promise<boolean> {
    const result = await this.tourService.createTour(tour);

    this.cacheManager.reset();

    return result;
  }

  @ApiResponse({
    description: "Success",
    status: 200,
  })
  @ApiParam({
    name: "gender",
    description: "Gender for which to seed the next event.",
    type: "enum",
    enum: Gender,
  })
  @Get("seed/interim/:gender")
  async interimEventSeed(@Param("gender") gender: Gender) {
    return this.tourService.interimEventSeed(gender);
  }
}

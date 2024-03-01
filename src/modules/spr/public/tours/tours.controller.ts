import { Controller, Get, Query, UseGuards, UseInterceptors } from "@nestjs/common";
import { CacheInterceptor } from "@nestjs/cache-manager";
import { ApiResponse, ApiQuery, ApiTags, ApiOperation, ApiSecurity } from "@nestjs/swagger";

import { TourListingResponse } from "./docs/tourListingResponse";
import { TourListing } from "./dto/tourListing.dto";

import TourService from "./tours.service";

import { SportsTypes } from "../../../../constants/system";

import ApiGuard from "../../../../guards/publicApi.guard";
import { PUBLIC_API_KEY_HEADER } from "../../../../constants/auth";

@ApiSecurity(PUBLIC_API_KEY_HEADER)
@ApiTags("Tours")
@Controller({
  path: `${SportsTypes.SUPERCROSS}/tours`,
})
export default class TourController {
  constructor(private readonly tourService: TourService) {}

  @Get()
  @ApiOperation({
    description: "List all tours",
    summary: "List Tours",
  })
  @ApiQuery({
    name: "year",
    type: "number",
    required: false,
    description: "Year for which the tour array is to be returned",
  })
  @ApiResponse({
    description: "Success",
    type: TourListingResponse,
    isArray: true,
  })
  @UseGuards(ApiGuard)
  @UseInterceptors(CacheInterceptor)
  public async fetchTours(@Query() queryParams: TourListing) {
    const tours = await this.tourService.fetchTours(queryParams.year);

    const parsedTours = tours.map((tour) => ({
      id: tour.id,
      name: tour.name,
      tourGender: tour.gender,
      years: tour.years.map((tourYear) => tourYear.year),
    }));

    return parsedTours;
  }
}

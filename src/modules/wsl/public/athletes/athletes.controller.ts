import { Controller, Get, Query, UseGuards, UseInterceptors, Header } from "@nestjs/common";
import { CacheInterceptor } from "@nestjs/cache-manager";
import AthleteService from "./athletes.service";
import { ApiTags, ApiQuery, ApiResponse, ApiOperation, ApiSecurity } from "@nestjs/swagger";

import { SportsTypes } from "../../../../constants/system";

import { AthleteListing } from "./dto";

import { AthleteListingObject } from "./schemas/response";

import ApiGuard from "../../../../guards/publicApi.guard";

import { PUBLIC_API_KEY_HEADER } from "../../../../constants/auth";
import { API_SORT_ORDER } from "../../../../constants/system";
import { WSLPublicStatsSortColumns } from "../../../../constants/wsl";

@ApiSecurity(PUBLIC_API_KEY_HEADER)
@ApiTags("Athletes")
@Controller({
  path: `${SportsTypes.SURFING}/athletes`,
})
export default class AthleteController {
  constructor(private readonly athleteService: AthleteService) {}

  @ApiOperation({
    description: "List all athletes on the system.",
    summary: "List Athletes",
  })
  @Get()
  @Header("Cache-Control", "public, s-maxage=600, stale-while-revalidate=60")
  @ApiQuery({
    name: "page",
    type: "number",
    required: false,
    description: "Page number for which the results should be returned",
  })
  @ApiQuery({
    name: "sortColumn",
    type: "enum",
    enum: WSLPublicStatsSortColumns,
    required: false,
    description: "Column on which to sort the results.",
  })
  @ApiQuery({
    name: "sortOrder",
    type: "enum",
    enum: API_SORT_ORDER,
    required: false,
    description: "Order in which the results should be sorted",
  })
  @ApiQuery({
    name: "tourIds",
    isArray: true,
    required: false,
    description: "Tour Ids for which to return results.",
  })
  @ApiQuery({
    name: "eventNames",
    type: "string",
    isArray: true,
    required: false,
    description: "Event names to filter.",
  })
  @ApiQuery({
    name: "years",
    type: "number",
    isArray: true,
    required: false,
    description: "Tour Years for which to return results.",
  })
  @ApiQuery({
    name: "eventLocations",
    type: "string",
    isArray: true,
    required: false,
    description: "Event Locations for which to return results.",
  })
  @ApiQuery({
    name: "query",
    type: "string",
    required: false,
    description: "Athlete firstName, lastName, nationality for which to return results.",
  })
  @ApiResponse({
    description: "Success",
    type: AthleteListingObject,
  })
  @UseGuards(ApiGuard)
  @UseInterceptors(CacheInterceptor)
  public async fetchAthletes(@Query() queryParams: AthleteListing): Promise<AthleteListingObject> {
    const data = await this.athleteService.fetchAthletes(
      queryParams.page,
      queryParams.tourIds,
      queryParams.eventNames,
      queryParams.years,
      queryParams.eventLocations,
      queryParams.query,
      queryParams.sortColumn,
      queryParams.sortOrder,
    );

    const parsedData = data.map((athlete) => ({
      id: athlete.athletes_id,
      firstName: athlete.athletes_firstName,
      middleName: athlete.athletes_middleName,
      lastName: athlete.athletes_lastName,
      gender: athlete.athletes_gender,
      averageHeatScore: +Number(athlete.avg_heat_score).toFixed(2),
      heatsSurfed: +athlete.heats_surfed,
      heatsWon: +athlete.heats_won,
      heatsWinPercentage: +athlete.heat_win_percentage,
      maxHeatScore: +athlete.max_heat_score,
      minHeatScore: +athlete.min_heat_score,
    }));

    return {
      page: queryParams.page,
      data: parsedData,
    };
  }
}

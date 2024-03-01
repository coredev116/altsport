import { Controller, Get, Query, UseGuards, UseInterceptors, Header } from "@nestjs/common";
import { CacheInterceptor } from "@nestjs/cache-manager";
import { ApiResponse, ApiQuery, ApiTags, ApiOperation, ApiSecurity } from "@nestjs/swagger";

import { LeagueListingResponse } from "./docs/leagueListingResponse";
import { LeagueListing } from "./dto/leagueListing.dto";

import LeagueService from "./leagues.service";

import { SportsTypes } from "../../../../constants/system";

import ApiGuard from "../../../../guards/publicApi.guard";
import { PUBLIC_API_KEY_HEADER } from "../../../../constants/auth";

@ApiSecurity(PUBLIC_API_KEY_HEADER)
@ApiTags("Leagues")
@Controller({
  path: `${SportsTypes.SKATEBOARDING}/leagues`,
})
export default class LeagueController {
  constructor(private readonly leagueService: LeagueService) {}

  @Get()
  @Header("Cache-Control", "public, s-maxage=600, stale-while-revalidate=60")
  @ApiOperation({
    description: "List all leagues",
    summary: "List leagues",
  })
  @ApiQuery({
    name: "year",
    type: "number",
    required: false,
    description: "Year for which the league array is to be returned",
  })
  @ApiResponse({
    description: "Success",
    type: LeagueListingResponse,
    isArray: true,
  })
  @UseGuards(ApiGuard)
  @UseInterceptors(CacheInterceptor)
  public async fetchLeagues(@Query() queryParams: LeagueListing) {
    const leagues = await this.leagueService.fetchLeagues(queryParams.year);

    const parsedLeagues = leagues.map((league) => ({
      id: league.id,
      name: league.name,
      leagueGender: league.gender,
      years: league.years.map((leagueYear) => leagueYear.year),
    }));

    return parsedLeagues;
  }
}

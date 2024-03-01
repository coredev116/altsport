import { Controller, Get, Query, UseGuards, UseInterceptors } from "@nestjs/common";
import { CacheInterceptor } from "@nestjs/cache-manager";
import { ApiTags, ApiQuery, ApiResponse, ApiOperation, ApiSecurity } from "@nestjs/swagger";

import { SportsTypes } from "../../../../constants/system";
import { PUBLIC_API_KEY_HEADER } from "../../../../constants/auth";

import { ResultListing } from "./dto";

import { ResultListingResponse } from "./schemas/response";

import ResultService from "./results.service";

import ApiGuard from "../../../../guards/publicApi.guard";

@ApiSecurity(PUBLIC_API_KEY_HEADER)
@ApiTags("Results")
@Controller({
  path: `${SportsTypes.SKATEBOARDING}/results`,
})
export default class ResultController {
  constructor(private readonly resultService: ResultService) {}

  @ApiOperation({
    description: "List Results",
    summary: "List Result",
  })
  @Get()
  @ApiQuery({
    name: "startingAfter",
    type: "string",
    required: false,
    description: "The last id that is used as a cursor to obtain the next set of results",
  })
  @ApiQuery({
    name: "limit",
    type: "number",
    required: false,
    description:
      "A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 10.",
  })
  @ApiQuery({
    name: "eventId",
    type: "string",
    required: false,
    description: "Event Id for which to return results.",
  })
  @ApiResponse({
    description: "Success",
    type: ResultListingResponse,
    isArray: true,
  })
  @UseGuards(ApiGuard)
  @UseGuards(ApiGuard)
  @UseInterceptors(CacheInterceptor)
  public async fetchAthletes(
    @Query() queryParams: ResultListing,
  ): Promise<ResultListingResponse[]> {
    const data = await this.resultService.fetchEventResults(
      queryParams.limit,
      queryParams.startingAfter,
      queryParams.eventId,
    );

    const parsedData = data.map((d) => ({
      id: d.eventResults_id,
      firstName: d.athletes_firstName,
      middleName: d.athletes_middleName,
      lastName: d.athletes_lastName,
      eventRank: d.eventResults_eventRank,
      eventPoints: d.eventResults_eventPoints,
    }));

    return parsedData;
  }
}

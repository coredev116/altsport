import { Controller, Get, Query, UseGuards, UseInterceptors } from "@nestjs/common";
import { CacheInterceptor } from "@nestjs/cache-manager";
import AthleteService from "./athletes.service";
import { ApiTags, ApiQuery, ApiResponse, ApiOperation, ApiSecurity } from "@nestjs/swagger";
import { v4 } from "uuid";

import { SportsTypes } from "../../../../constants/system";

import { AthleteListing } from "./dto";

import { AthleteListingObject } from "./schemas/response";

import ApiGuard from "../../../../guards/publicApi.guard";

import { PUBLIC_API_KEY_HEADER } from "../../../../constants/auth";
import { API_SORT_ORDER } from "../../../../constants/system";
import { MOTOCRSPublicStatsSortColumns } from "../../../../constants/motocrs";

@ApiSecurity(PUBLIC_API_KEY_HEADER)
@ApiTags("Athletes")
@Controller({
  path: `${SportsTypes.MOTOCROSS}/athletes`,
})
export default class AthleteController {
  constructor(private readonly athleteService: AthleteService) {}

  @ApiOperation({
    description: "List all athletes",
    summary: "List Athletes",
  })
  @Get()
  @ApiQuery({
    name: "page",
    type: "number",
    required: false,
    description: "Page number for which the results should be returned",
  })
  @ApiQuery({
    name: "sortColumn",
    type: "enum",
    enum: MOTOCRSPublicStatsSortColumns,
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
    type: "string",
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
  @ApiQuery({
    name: "raceCategories",
    type: "string",
    isArray: true,
    required: false,
    description: "Array of Event categoryName for which to return results.",
  })
  @ApiResponse({
    description: "Success",
    type: AthleteListingObject,
  })
  @UseGuards(ApiGuard)
  @UseInterceptors(CacheInterceptor)
  public async fetchAthletes(@Query() queryParams: AthleteListing): Promise<AthleteListingObject> {
    // temporary patch for locations since that data does not exist in the

    const locations = queryParams.eventLocations?.map((location: any) => {
      const split = location.split(",");
      return split[0];
    });

    const data = await this.athleteService.fetchAthleteStats(
      queryParams.page,
      queryParams.tourIds,
      queryParams.eventNames,
      queryParams.years,
      locations,
      queryParams.query,
      queryParams.raceCategories,
      queryParams.sortColumn,
      queryParams.sortOrder,
    );

    const parsedData = data.map((athleteRow) => {
      const nameArray = athleteRow.athlete.split(" "); // split the string into an array of substrings
      const firstName = nameArray[0]; // first name is the first element in the array
      const lastName = nameArray.slice(1).join(" "); // last name is the remaining elements joined by a space

      return {
        id: v4(),
        firstName,
        middleName: null,
        gender: null,
        lastName,
        eventsRaced: Math.round(+Number(athleteRow.events_raced)),
        eventWins: Math.round(+Number(athleteRow.event_wins)),
        avgEventPlace: Math.round(+Number(athleteRow.avg_event_place)),
        avgLapTime: +Number(athleteRow.avg_lap_time),
        avgBestLapTime: +Number(athleteRow.avg_best_lap_time),
        avgQualifyingPlace: Math.round(+Number(athleteRow.avg_qualifying_place)),
        totalMainEventRaces: Math.round(+Number(athleteRow.main_event_app)),
        totalPrelimsRaces: Math.round(+Number(athleteRow.prelim_event_app)),
        avgPrelimsPlace: Math.round(+Number(athleteRow.avg_prelim_place)),
        totalLastChanceRaces: Math.round(+Number(athleteRow.lcq_event_app)),
        avgLastChancePlace: Math.round(+Number(athleteRow.avg_lcq_place)),
      };
    });

    return {
      page: queryParams.page,
      data: parsedData,
    };
  }
}

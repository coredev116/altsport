import { Controller, Get, UseGuards, UseInterceptors, Query } from "@nestjs/common";
import { CacheInterceptor } from "@nestjs/cache-manager";
import { ApiResponse, ApiTags, ApiOperation, ApiSecurity, ApiQuery } from "@nestjs/swagger";

import EventLocationListingResponse from "./docs/eventLocationListingResponse";
import EventResponse from "./docs/eventResponse";
import { EventByNameYearDto } from "./dto/eventByNameYear.dto";

import EventService from "./events.service";

import { SportsTypes, EventStatus, HeatStatus, RoundStatus } from "../../../../constants/system";

import * as eventExceptions from "../../../../exceptions/events";

import ApiGuard from "../../../../guards/publicApi.guard";
import { PUBLIC_API_KEY_HEADER } from "../../../../constants/auth";

@ApiSecurity(PUBLIC_API_KEY_HEADER)
@ApiTags("Events")
@Controller({
  path: `${SportsTypes.MOTOCROSS}/events`,
})
export default class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get("locations")
  @ApiOperation({
    description: "List all event locations",
    summary: "List all event locations",
  })
  @ApiResponse({
    description: "Success",
    type: EventLocationListingResponse,
    isArray: true,
  })
  @UseGuards(ApiGuard)
  @UseInterceptors(CacheInterceptor)
  public async fetchEventLocations(): Promise<EventLocationListingResponse[]> {
    const events = await this.eventService.fetchEventLocations();

    const parsedEvents = events.map((event) => ({
      id: event.id,
      eventLocation: event.eventLocation,
      eventLocationGroup: event.eventLocationGroup,
    }));

    return parsedEvents;
  }

  @Get("by_name_year")
  @ApiOperation({
    description: "Get Event details by Event Name, Year",
    summary: "Get Event details by Event Name, Year",
  })
  @ApiQuery({
    name: "year",
    type: "number",
    required: true,
    description: "Year for which the data is to be returned",
  })
  @ApiQuery({
    name: "eventName",
    type: "string",
    required: true,
    description: "Event Name for which the data is to be returned",
  })
  @ApiQuery({
    name: "categoryName",
    type: "string",
    required: false,
    description: "Category Name for which the data is to be returned",
  })
  @ApiResponse({
    description: "Success",
    type: EventResponse,
  })
  @UseGuards(ApiGuard)
  public async getEventByName(@Query() queryParams: EventByNameYearDto) {
    const event = await this.eventService.getEvent(
      null,
      queryParams.year,
      queryParams.eventName,
      queryParams.categoryName,
    );
    if (!event) throw eventExceptions.eventNotFound();

    return {
      id: event.id,
      name: event.name,
      startDate: event.startDate,
      endDate: event.endDate,
      eventLocation: event.eventLocation,
      eventLocationGroup: event.eventLocationGroup,
      eventNumber: event.eventNumber,
      eventStatus: EventStatus[event.eventStatus],
      year: event.tourYear.year,
      rounds: event.rounds.map((round) => ({
        id: round.id,
        name: round.round.name,
        roundNo: round.round.roundNo,
        startDate: round.startDate,
        endDate: round.endDate,
        roundStatus: RoundStatus[round.roundStatus],
        heats: round.round.heats.map((heat) => ({
          id: heat.id,
          name: heat.heatName,
          heatNo: heat.heatNo,
          startDate: heat.startDate,
          endDate: heat.endDate,
          heatStatus: HeatStatus[heat.heatStatus],
        })),
      })),
    };
  }
}

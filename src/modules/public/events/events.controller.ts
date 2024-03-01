import { Controller, Get, UseGuards, UseInterceptors, Param, Query } from "@nestjs/common";
import { CacheInterceptor } from "@nestjs/cache-manager";
import {
  ApiResponse,
  ApiTags,
  ApiOperation,
  ApiSecurity,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";

import EventService from "./events.service";

import EventListingResponse from "./docs/eventListingResponse";
import EventResponse from "./schemas/response/event.response";
import { RoundScoreResponse } from "./docs/scoresResponse";
import { EventOddsResponse } from "./docs/eventOdds.response";
import { ServerErrorResponse } from "./docs/errorResponse";

import * as eventExceptions from "../../../exceptions/events";

import {
  EventIdParamDto,
  FetchHeatScoreParams,
  FetchOddsParams,
  ExactasTypeDto,
} from "./dto/params.dto";

import ApiGuard from "../../../guards/publicApi.guard";
import { PUBLIC_API_KEY_HEADER } from "../../../constants/auth";
import { EventStatus, ExactasType } from "../../../constants/system";
import { PublicOddTypes } from "../../../constants/odds";

@ApiSecurity(PUBLIC_API_KEY_HEADER)
@UseGuards(ApiGuard)
@ApiTags("Events")
@Controller({
  path: `/public/events`,
})
export default class EventController {
  constructor(private readonly eventService: EventService) {}

  @ApiResponse({
    description: "Success",
    type: RoundScoreResponse,
    isArray: true,
    status: 200,
  })
  @ApiResponse({
    description: "Event/Heat not found",
    type: ServerErrorResponse,
    status: 404,
  })
  @ApiOperation({
    description: "Get heat scores/lap times for a particular event heat",
    summary: "Get Heat Score",
  })
  @ApiParam({
    name: "eventId",
    description: "The id of the event for which the data should be returned.",
  })
  @ApiParam({
    name: "heatId",
    description: "The id of the heat for which the data should be returned.",
  })
  @Get(":eventId/heats/:heatId")
  async fetchHeatScore(@Param() params: FetchHeatScoreParams): Promise<RoundScoreResponse[]> {
    const eventIdCheck: string[] = params.eventId.split(":");
    if (eventIdCheck.length !== 2) throw eventExceptions.eventNotFound();

    return await this.eventService.fetchHeatScore(params.eventId, params.heatId);
  }

  @ApiResponse({
    description: "Success",
    type: EventOddsResponse,
    status: 200,
  })
  @ApiOperation({
    description: "Get Odds for an event",
    summary: "Get Event Odds",
  })
  @ApiParam({
    name: "eventId",
    description: "The id of the event for which the data should be returned.",
  })
  @ApiParam({
    name: "oddType",
    description: "Odd type for which the data should be returned.",
    enum: PublicOddTypes,
  })
  @ApiQuery({
    name: "exactasType",
    description: "Exactas Type",
    required: false,
    enum: ExactasType,
  })
  @ApiResponse({
    description: "Event/Odds not found",
    type: ServerErrorResponse,
    status: 404,
  })
  @Get(":eventId/:oddType")
  async fetchOdds(
    @Param() params: FetchOddsParams,
    @Query() queryParams: ExactasTypeDto,
  ): Promise<EventOddsResponse> {
    const eventIdCheck: string[] = params.eventId.split(":");
    if (eventIdCheck.length !== 2) throw eventExceptions.eventNotFound();

    const result = await this.eventService.fetchOdds(
      params.eventId,
      params.oddType,
      queryParams.exactasType,
    );

    return result;
  }

  @Get(":eventId")
  @ApiResponse({
    description: "Success",
    type: EventResponse,
    status: 200,
  })
  @ApiOperation({
    summary: "Fetch event",
    description: "Fetch event data",
  })
  @ApiResponse({
    description: "Event not found",
    type: ServerErrorResponse,
    status: 404,
  })
  @ApiParam({
    name: "eventId",
    description: "The id of the event for which the data should be returned.",
  })
  async fetchEvent(@Param() params: EventIdParamDto): Promise<EventResponse> {
    const eventIdCheck: string[] = params.eventId.split(":");
    if (eventIdCheck.length !== 2) throw eventExceptions.eventNotFound();

    const event = await this.eventService.fetchEvent(params.eventId);
    if (!event) throw eventExceptions.eventNotFound();

    return event;
  }

  @Get()
  @ApiOperation({
    description: "Fetch all events",
    summary: "Fetch all events",
  })
  @ApiResponse({
    description: "Success",
    type: EventListingResponse,
    isArray: true,
    status: 200,
  })
  @UseInterceptors(CacheInterceptor)
  public async fetchEvents(): Promise<EventListingResponse[]> {
    const events = await this.eventService.fetchEvents();

    const parsedEvents = events.map((event) => ({
      id: event.id,
      name: event.name,
      tourName: event.tourName,
      startDate: event.startDate,
      endDate: event.endDate,
      eventLocation: event.eventLocation,
      eventLocationGroup: event.eventLocationGroup,
      eventNumber: event.eventNumber,
      eventStatus: EventStatus[event.eventStatus],
      year: event.year,
    }));

    return parsedEvents;
  }
}

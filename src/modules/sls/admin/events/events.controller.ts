import { Body, Controller, Post, Get, Param, UseGuards, Inject, Query } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import {
  ApiBody,
  ApiResponse,
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";

import SLSEvent from "../../../../entities/sls/events.entity";

import { SportsTypes, EventStatus } from "../../../../constants/system";

import EventsResponse from "./schemas/responses/events.response";
import EventResponse from "./schemas/responses/event.response";

import EventService from "./events.service";

import * as eventExceptions from "../../../../exceptions/events";

import EventSLSDto from "./dto/events.dto";
import UpdateEventDto from "./dto/updateEvent.dto";
import { EventIdParamDto } from "./dto/params.dto";
import { EventListing } from "./dto";

import ApiGuard from "../../../../guards/adminApi.guard";

@ApiBearerAuth()
@UseGuards(ApiGuard)
@ApiTags("events")
@Controller({
  path: `admin/${SportsTypes.SKATEBOARDING}/events`,
})
export default class EventController {
  constructor(
    private readonly eventService: EventService,
    @Inject(CACHE_MANAGER) protected readonly cacheManager,
  ) {}

  @ApiBody({ type: EventSLSDto })
  @ApiResponse({
    description: "Success",
    type: SLSEvent,
    status: 200,
    isArray: true,
  })
  @ApiOperation({
    summary: "Bulk insert events",
    description: "API to bulk insert events",
  })
  @Post()
  async create(@Body() payload: EventSLSDto): Promise<SLSEvent[]> {
    const result = await this.eventService.createEvent(payload);

    this.cacheManager.reset();

    return result;
  }

  @ApiBody({ type: UpdateEventDto })
  @ApiResponse({
    description: "Success",
    type: Boolean,
    status: 200,
  })
  @ApiParam({
    name: "eventId",
    description: "The id of the event.",
  })
  @Post(":eventId")
  async update(
    @Param() params: EventIdParamDto,
    @Body() payload: UpdateEventDto,
  ): Promise<boolean> {
    const result = await this.eventService.updateEvent(params.eventId, payload);

    this.cacheManager.reset();

    return result;
  }

  @ApiResponse({
    description: "Success",
    type: EventsResponse,
    status: 200,
    isArray: true,
  })
  @ApiOperation({
    summary: "Fetch all events",
    description: "API to fetch all events",
  })
  @ApiQuery({
    name: "eventStatus",
    type: "number",
    enum: EventStatus,
    isArray: true,
    required: false,
    description: "Event statuses for which to return results.",
  })
  @Get()
  async fetchEvents(@Query() queryParams?: EventListing): Promise<EventsResponse[]> {
    const events = await this.eventService.fetchEvents(queryParams?.eventStatus);

    const parsedPayload = events.map((event) => {
      return {
        id: event.id,
        sportType: SportsTypes.SKATEBOARDING,
        name: event.name,
        startDate: event.startDate,
        endDate: event.endDate,
        eventStatus: event.eventStatus,
        eventNumber: event.eventNumber,
        eventLocation: event.eventLocation,
        eventLocationGroup: event.eventLocationGroup,
        isSimulationEnabled: event.isSimulationEnabled,

        year: event.leagueYear.year,
        league: {
          id: event.leagueYear.league.id,
          name: event.leagueYear.league.name,
          gender: event.leagueYear.league.gender,
        },
      };
    });

    return parsedPayload;
  }

  @Get(":eventId")
  @ApiResponse({
    description: "Success",
    type: EventResponse,
    status: 200,
  })
  @ApiOperation({
    summary: "Fetch event",
    description: "API to fetch an event",
  })
  @ApiParam({
    name: "eventId",
    description: "Id of the event.",
  })
  @Get()
  async fetchEvent(@Param() params: EventIdParamDto): Promise<EventResponse> {
    const event = await this.eventService.fetchEvent(params.eventId);
    if (!event) throw eventExceptions.eventNotFound();

    return {
      id: event.id,
      name: event.name,
      sportType: SportsTypes.SKATEBOARDING,
      startDate: event.startDate,
      endDate: event.endDate,
      eventStatus: event.eventStatus,
      eventNumber: event.eventNumber,
      eventLocation: event.eventLocation,
      eventLocationGroup: event.eventLocationGroup,
      isSimulationEnabled: event.isSimulationEnabled,
      year: event.leagueYear.year,
      league: {
        id: event.leagueYear.league.id,
        name: event.leagueYear.league.name,
        gender: event.leagueYear.league.gender,
      },
      rounds: event.rounds.map(({ round, startDate, endDate, roundStatus }) => {
        return {
          id: round.id,
          name: round.name,
          roundNo: round.roundNo,
          startDate,
          endDate,
          roundStatus,
          heats: round.heats.map((heat) => ({
            id: heat.id,
            heatName: heat.heatName,
            heatNo: heat.heatNo,
            heatStatus: heat.heatStatus,
            startDate: heat.startDate || null,
            endDate: heat.endDate || null,
          })),
        };
      }),
    };
  }
}

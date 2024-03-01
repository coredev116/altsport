import { Body, Controller, Post, Get, Param, UseGuards, Inject, Query } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { ApiBody, ApiResponse, ApiTags, ApiBearerAuth, ApiParam, ApiQuery } from "@nestjs/swagger";

import Event from "../../../../entities/mg/events.entity";

import { SportsTypes, EventStatus } from "../../../../constants/system";

import EventDto from "./dto/events.dto";
import UpdateEventDto from "./dto/updateEvent.dto";
import { EventIdParamDto } from "./dto/params.dto";
import { EventListing } from "./dto";

import EventsResponse from "./schemas/responses/events.response";

import EventService from "./events.service";

import * as eventExceptions from "../../../../exceptions/events";

import ApiGuard from "../../../../guards/adminApi.guard";

@ApiBearerAuth()
@UseGuards(ApiGuard)
@ApiTags("events")
@Controller({
  path: `admin/${SportsTypes.MotoGP}/events`,
})
export default class EventController {
  constructor(
    private readonly eventService: EventService,
    @Inject(CACHE_MANAGER) protected readonly cacheManager,
  ) {}

  @ApiBody({ type: EventDto })
  @ApiResponse({
    description: "Success",
    type: Event,
    status: 201,
    isArray: true,
  })
  @Post()
  async create(@Body() payload: EventDto): Promise<Event[]> {
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
        name: event.name,
        sportType: SportsTypes.MotoGP,
        startDate: event.startDate,
        endDate: event.endDate,
        eventNumber: event.eventNumber,
        eventStatus: event.eventStatus,
        eventLocation: event.eventLocation,
        eventLocationGroup: event.eventLocationGroup,
        isSimulationEnabled: event.isSimulationEnabled,
        year: event.tourYear.year,
        tour: {
          id: event.tourYear.tour.id,
          name: event.tourYear.tour.name,
          gender: event.tourYear.tour.gender,
        },
      };
    });

    return parsedPayload;
  }

  @Get(":eventId")
  @ApiResponse({
    description: "Success",
    type: EventsResponse,
    status: 200,
  })
  @ApiParam({
    name: "eventId",
    required: true,
  })
  @Get()
  async fetchEvent(@Param() params: EventIdParamDto): Promise<EventsResponse> {
    const event = await this.eventService.fetchEvent(params.eventId);
    if (!event) throw eventExceptions.eventNotFound();

    return {
      id: event.id,
      name: event.name,
      sportType: SportsTypes.MotoGP,
      startDate: event.startDate,
      endDate: event.endDate,
      eventNumber: event.eventNumber,
      eventStatus: event.eventStatus,
      eventLocation: event.eventLocation,
      eventLocationGroup: event.eventLocationGroup,
      isSimulationEnabled: event.isSimulationEnabled,
      year: event.tourYear.year,
      tour: {
        id: event.tourYear.tour.id,
        name: event.tourYear.tour.name,
        gender: event.tourYear.tour.gender,
      },
    };
  }
}

import { Body, Controller, Post, Get, Param, UseGuards, Inject, Query } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { ApiBody, ApiResponse, ApiTags, ApiBearerAuth, ApiParam, ApiQuery } from "@nestjs/swagger";

import { SportsTypes, EventStatus } from "../../../../constants/system";

import UpdateEventDto from "./dto/updateEvent.dto";
import { EventIdParamDto } from "./dto/params.dto";
import { EventListing } from "./dto";

import EventsResponse from "./schemas/responses/events.response";
import EventResponse from "./schemas/responses/event.response";

import EventService from "./events.service";

import * as eventExceptions from "../../../../exceptions/events";

import ApiGuard from "../../../../guards/adminApi.guard";

@ApiBearerAuth()
@UseGuards(ApiGuard)
@ApiTags("events")
@Controller({
  path: `admin/${SportsTypes.MOTOCROSS}/events`,
})
export default class EventController {
  constructor(
    private readonly eventService: EventService,
    @Inject(CACHE_MANAGER) protected readonly cacheManager,
  ) {}

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
        sportType: SportsTypes.MOTOCROSS,
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
    type: EventResponse,
    status: 200,
  })
  @ApiParam({
    name: "eventId",
    required: true,
  })
  @Get()
  async fetchEvent(@Param() params: EventIdParamDto): Promise<EventResponse> {
    const event = await this.eventService.fetchEvent(params.eventId);
    if (!event) throw eventExceptions.eventNotFound();

    return {
      id: event.id,
      name: event.name,
      sportType: SportsTypes.MOTOCROSS,
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
      rounds: event.rounds.map(({ round, startDate, endDate, roundStatus }) => {
        return {
          id: round.id,
          name: round.name,
          roundNo: round.roundNo,
          startDate,
          endDate,
          roundStatus,
          heats: round.heats
            // this is done because typeorm is unable to apply where clause on relations
            .filter((heat) => heat.eventId === event.id)
            .map((heat) => ({
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

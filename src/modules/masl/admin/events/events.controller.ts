import { Controller, UseGuards, Get, Query } from "@nestjs/common";
import { ApiResponse, ApiTags, ApiBearerAuth, ApiQuery } from "@nestjs/swagger";

import { SportsTypes, EventStatus } from "../../../../constants/system";

import EventsResponse from "./schemas/responses/events.response";

import EventService from "./events.service";

import ApiGuard from "../../../../guards/adminApi.guard";

import { EventListing } from "./dto";

@ApiBearerAuth()
@UseGuards(ApiGuard)
@ApiTags("events")
@Controller({
  path: `admin/${SportsTypes.MASL}/events`,
})
export default class EventController {
  constructor(private readonly eventService: EventService) {}

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
    return this.eventService.fetchEvents(queryParams?.eventStatus);
  }
}

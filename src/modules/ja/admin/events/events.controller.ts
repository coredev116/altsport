import { Controller, UseGuards, Get, Query, Sse } from "@nestjs/common";
import { fromEvent } from "rxjs";
import { ApiResponse, ApiTags, ApiBearerAuth, ApiQuery } from "@nestjs/swagger";
import { EventEmitter2 } from "@nestjs/event-emitter";

import { SportsTypes, EventStatus } from "../../../../constants/system";

import EventsResponse from "./schemas/responses/events.response";

import EventService from "./events.service";

import ApiGuard from "../../../../guards/adminApi.guard";

import { EventListing } from "./dto";

@ApiBearerAuth()
@UseGuards(ApiGuard)
@ApiTags("events")
@Controller({
  path: `admin/${SportsTypes.JA}/events`,
})
export default class EventController {
  constructor(private readonly eventService: EventService, private eventEmitter: EventEmitter2) {}

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

  @Sse("sse")
  sse() {
    return fromEvent(this.eventEmitter, `${SportsTypes.JA}Event`);
  }
}

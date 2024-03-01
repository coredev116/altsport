import { Controller, Get, Query, UseGuards, UseInterceptors, Header } from "@nestjs/common";
import { CacheInterceptor } from "@nestjs/cache-manager";
import { ApiResponse, ApiQuery, ApiTags, ApiOperation, ApiSecurity } from "@nestjs/swagger";
import orderBy from "lodash.orderby";
import EventListingResponse from "./docs/eventListingResponse";

import { EventListing } from "./dto/eventListing";

import NrxEventService from "../../nrx/public/events/events.service";
import SprEventService from "../../spr/public/events/events.service";
import WslEventService from "../../wsl/public/events/events.service";
import SlsEventService from "../../sls/public/events/events.service";

import { EventStatus } from "../../../constants/system";

import { SportsTypes } from "../../../constants/system";

import ApiGuard from "../../../guards/publicApi.guard";
import { PUBLIC_API_KEY_HEADER } from "../../../constants/auth";

@ApiSecurity(PUBLIC_API_KEY_HEADER)
@UseGuards(ApiGuard)
@ApiTags("sports")
@Controller({
  path: "sports",
})
export default class SportsController {
  constructor(
    private readonly nrxEventService: NrxEventService,
    private readonly sprEventService: SprEventService,
    private readonly wslEventService: WslEventService,
    private readonly slsEventService: SlsEventService,
  ) {}

  @Get("events")
  @Header("Cache-Control", "public, s-maxage=600, stale-while-revalidate=60")
  @ApiOperation({
    description: "List all events",
    summary: "List Events",
  })
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
      "A limit on the number of objects to be returned for each sport. Limit can range between 1 and 100, and the default is 100 for each sport.",
  })
  @ApiQuery({
    name: "eventStatuses",
    type: "string",
    isArray: true,
    required: false,
    description: "Event Statuses for which the result is to be returned. Defaults to [UPCOMING]",
  })
  @ApiResponse({
    description: "Success",
    type: EventListingResponse,
    isArray: true,
  })
  @UseGuards(ApiGuard)
  @UseInterceptors(CacheInterceptor)
  public async fetchEvents(@Query() queryParams: EventListing): Promise<EventListingResponse[]> {
    const nrxEvents = await this.nrxEventService.fetchEvents(
      queryParams.limit,
      queryParams.startingAfter,
      null,
      queryParams.eventStatuses,
      null,
      null,
      null,
    );

    const parsedNrxEvents = nrxEvents.map((event) => ({
      id: event.id,
      name: event.name,
      tourId: event.tourYear.tour.id,
      tourName: event.tourYear.tour.name,
      startDate: event.startDate,
      endDate: event.endDate,
      eventLocation: event.eventLocation,
      eventLocationGroup: event.eventLocationGroup,
      eventNumber: event.eventNumber,
      eventStatus: EventStatus[event.eventStatus],
      year: event.tourYear.year,
      sportType: SportsTypes.RALLYCROSS,
    }));

    const sprEvents = await this.sprEventService.fetchEvents(
      queryParams.limit,
      queryParams.startingAfter,
      null,
      queryParams.eventStatuses,
      null,
      null,
      null,
    );

    const parsedSprEvents = sprEvents.map((event) => ({
      id: event.id,
      name: event.name,
      tourId: event.tourYear.tour.id,
      tourName: event.tourYear.tour.name,
      startDate: event.startDate,
      endDate: event.endDate,
      eventLocation: event.eventLocation,
      eventLocationGroup: event.eventLocationGroup,
      eventNumber: event.eventNumber,
      eventStatus: EventStatus[event.eventStatus],
      year: event.tourYear.year,
      sportType: SportsTypes.SUPERCROSS,
    }));

    const wslEvents = await this.wslEventService.fetchEvents(
      queryParams.limit,
      queryParams.startingAfter,
      null,
      queryParams.eventStatuses,
      null,
      null,
      null,
    );

    const parsedWslEvents = wslEvents.map((event) => ({
      id: event.id,
      name: event.name,
      tourId: event.tourYear.tour.id,
      tourName: event.tourYear.tour.name,
      startDate: event.startDate,
      endDate: event.endDate,
      eventLocation: event.eventLocation,
      eventLocationGroup: event.eventLocationGroup,
      eventNumber: event.eventNumber,
      eventStatus: EventStatus[event.eventStatus],
      year: event.tourYear.year,
      sportType: SportsTypes.SURFING,
    }));

    const slsEvents = await this.slsEventService.fetchEvents(
      queryParams.limit,
      queryParams.startingAfter,
      null,
      queryParams.eventStatuses,
      null,
      null,
      null,
    );

    const parsedSlsEvents = slsEvents.map((event) => ({
      id: event.id,
      name: event.name,
      tourId: event.leagueYear.league.id,
      tourName: event.leagueYear.league.name,
      startDate: event.startDate,
      endDate: event.endDate,
      eventLocation: event.eventLocation,
      eventLocationGroup: event.eventLocationGroup,
      eventNumber: null,
      eventStatus: EventStatus[event.eventStatus],
      year: event.leagueYear.year,
      sportType: SportsTypes.SKATEBOARDING,
    }));

    const events = orderBy(
      [...parsedWslEvents, ...parsedSlsEvents, ...parsedNrxEvents, ...parsedSprEvents],
      ["startDate"],
      "asc",
    );
    return events;
  }
}

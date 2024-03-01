import { Controller, Get, Query, UseGuards, Param, UseInterceptors, Header } from "@nestjs/common";
import { CacheInterceptor } from "@nestjs/cache-manager";
import {
  ApiResponse,
  ApiQuery,
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiSecurity,
} from "@nestjs/swagger";

import EventListingRes from "./docs/eventListingRes";
import EventResponse from "./docs/eventResponse";
import EventLocationListingResponse from "./docs/eventLocationListingResponse";
import { EventParticipantListingRes } from "./docs/eventParticipantListingRes";
import { RoundScoreResponse } from "./docs/scoresResponse";

import { EventListing } from "./dto/eventListing";
import { EventByNameYearDto } from "./dto/eventByNameYear.dto";
import { EventIdParamDto, FetchHeatScoreParams } from "./dto/params.dto";

import EventService from "./events.service";

import { SportsTypes, EventStatus, HeatStatus, RoundStatus } from "../../../../constants/system";

import * as eventExceptions from "../../../../exceptions/events";
import * as heatExceptions from "../../../../exceptions/heats";

import ApiGuard from "../../../../guards/publicApi.guard";
import { PUBLIC_API_KEY_HEADER } from "../../../../constants/auth";

@ApiSecurity(PUBLIC_API_KEY_HEADER)
@ApiTags("Events")
@Controller({
  path: `${SportsTypes.SKATEBOARDING}/events`,
})
export default class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get("locations")
  @Header("Cache-Control", "public, s-maxage=600, stale-while-revalidate=60")
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

  @Get()
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
      "A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 10.",
  })
  @ApiQuery({
    name: "year",
    type: "number",
    required: false,
    description: "Year for which the league array is to be returned",
  })
  @ApiQuery({
    name: "eventStatuses",
    type: "string",
    isArray: true,
    required: false,
    description: "Event Statuses for which the league array is to be returned",
  })
  @ApiQuery({
    name: "leagueId",
    type: "string",
    required: false,
    description: "leagueId for which the league array is to be returned",
  })
  @ApiQuery({
    name: "eventLocation",
    type: "string",
    required: false,
    description: "Event Location for which the league array is to be returned",
  })
  @ApiQuery({
    name: "query",
    type: "string",
    required: false,
    description: "Event Name for which the league array is to be returned",
  })
  @ApiResponse({
    description: "Success",
    status: 200,
    type: EventListingRes,
    isArray: true,
  })
  @UseGuards(ApiGuard)
  @UseInterceptors(CacheInterceptor)
  public async fetchEvents(@Query() queryParams: EventListing): Promise<EventListingRes[]> {
    const events = await this.eventService.fetchEvents(
      queryParams.limit,
      queryParams.startingAfter,
      queryParams.year,
      queryParams.eventStatuses,
      queryParams.leagueId,
      queryParams.eventLocation,
      queryParams.query,
    );

    const parsedEvents = events.map((event) => ({
      id: event.id,
      name: event.name,
      leagueId: event.leagueYear.league.id,
      leagueName: event.leagueYear.league.name,
      eventNumber: null,
      startDate: event.startDate,
      endDate: event.endDate,
      eventLocation: event.eventLocation,
      eventLocationGroup: event.eventLocationGroup,
      eventStatus: EventStatus[event.eventStatus],
      year: event.leagueYear.year,
    }));

    return parsedEvents;
  }

  @Get(":eventId/eventParticipants")
  @ApiOperation({
    description: "Fetch a list of participants for the event",
    summary: "List Event Participants",
  })
  @ApiParam({
    name: "eventId",
    description: "The id of the event for which the data should be returned.",
  })
  @ApiResponse({
    description: "Success",
    status: 200,
    type: EventParticipantListingRes,
    isArray: true,
  })
  @UseGuards(ApiGuard)
  public async fetchEventParticipants(@Param() params: EventIdParamDto) {
    return this.eventService.fetchEventParticipants(params.eventId);
  }

  @ApiResponse({
    description: "Success",
    type: RoundScoreResponse,
    isArray: true,
    status: 200,
  })
  @ApiOperation({
    description: "Get the scores for a heat",
    summary: "List Heat Scores",
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
  @UseGuards(ApiGuard)
  async fetchHeatScore(@Param() params: FetchHeatScoreParams): Promise<RoundScoreResponse[]> {
    const { heat, scores = [] } = await this.eventService.fetchHeatScore(
      params.eventId,
      params.heatId,
    );
    if (!heat) throw heatExceptions.heatNotFound();

    const parsedScores = scores.map((score) => ({
      ...score,
      roundSeed: +score.roundSeed,
      roundScore: +score.roundScore,
      lineScore1: +score.lineScore1,
      lineScore2: +score.lineScore2,
      trick1Score: +score.trick1Score,
      trick2Score: +score.trick2Score,
      trick3Score: +score.trick3Score,
      trick4Score: +score.trick4Score,
      trick5Score: +score.trick5Score,
      trick6Score: +score.trick6Score,
      athlete: {
        id: score.athlete?.id,
        firstName: score.athlete?.firstName,
        middleName: score.athlete?.middleName,
        lastName: score.athlete?.lastName,
        nationality: score.athlete?.nationality,
        stance: score.athlete?.stance,
      },
    }));

    return parsedScores;
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
  @ApiResponse({
    description: "Success",
    type: EventResponse,
  })
  @UseGuards(ApiGuard)
  public async getEventByName(@Query() queryParams: EventByNameYearDto) {
    const event = await this.eventService.fetchEvent(null, queryParams.year, queryParams.eventName);
    if (!event) throw eventExceptions.eventNotFound();

    return {
      id: event.id,
      name: event.name,
      startDate: event.startDate,
      endDate: event.endDate,
      eventLocation: event.eventLocation,
      eventStatus: EventStatus[event.eventStatus],
      year: event.leagueYear.year,
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

  @Get(":eventId")
  @ApiOperation({
    description: "Get Event details",
    summary: "Get Event details",
  })
  @ApiParam({
    name: "eventId",
    description: "The id of the event for which the data should be returned.",
  })
  @ApiResponse({
    description: "Success",
    type: EventResponse,
  })
  @UseGuards(ApiGuard)
  public async fetchEvent(@Param() params: EventIdParamDto) {
    const event = await this.eventService.fetchEvent(params.eventId);
    if (!event) throw eventExceptions.eventNotFound();

    return {
      id: event.id,
      name: event.name,
      startDate: event.startDate,
      endDate: event.endDate,
      eventLocation: event.eventLocation,
      eventStatus: EventStatus[event.eventStatus],
      year: event.leagueYear.year,
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

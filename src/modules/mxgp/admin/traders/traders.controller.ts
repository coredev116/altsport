import { Controller, Param, Get, Query, UseGuards, Inject, Put, Body } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import {
  ApiBody,
  ApiResponse,
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiBearerAuth,
  ApiParam,
} from "@nestjs/swagger";

import EventParticipantsQuery from "./dto/EventParticipantsQuery.dto";
import { EventIdParamDto } from "./dto/params.dto";
import OddGoLiveDto from "./dto/oddGoLive.dto";

import { SportsTypes } from "../../../../constants/system";

import EventParticipantResponse from "./schemas/responses/eventParticipant.response";

import TraderService from "./traders.service";

import ApiGuard from "../../../../guards/adminApi.guard";

@ApiBearerAuth()
@UseGuards(ApiGuard)
@ApiTags("traders")
@Controller({
  path: `admin/${SportsTypes.MXGP}/traders`,
})
export default class TraderController {
  constructor(
    private readonly traderService: TraderService,
    @Inject(CACHE_MANAGER) protected readonly cacheManager,
  ) {}

  @ApiResponse({
    description: "Success",
    type: EventParticipantResponse,
    status: 200,
    isArray: true,
  })
  @ApiOperation({
    description: "Get event participants by event id",
  })
  @ApiQuery({
    name: "archived",
    type: "number",
    required: false,
    description: "Send 1 to include archived athletes or skip or 0 to return active athletes only",
  })
  @ApiParam({
    name: "eventId",
    description: "The id of the event.",
  })
  @Get("/events/:eventId/participants")
  async fetchEventParticipants(
    @Param() params: EventIdParamDto,
    @Query() queryParams: EventParticipantsQuery,
  ): Promise<EventParticipantResponse[]> {
    const eventParticipants = await this.traderService.fetchEventParticipant(
      params.eventId,
      queryParams.archived === 1,
    );

    return eventParticipants.map((eP) => ({
      id: eP.id,
      seedNo: eP.seedNo,
      baseProjection: eP.baseProjection,
      status: eP.status,
      athlete: {
        id: eP.athlete.id,
        firstName: eP.athlete.firstName,
        middleName: eP.athlete.middleName,
        lastName: eP.athlete.lastName,
        nationality: eP.athlete.nationality,
        stance: eP.athlete.stance,
        gender: eP.athlete.gender,
      },
      event: {
        id: eP.event.id,
        eventStatus: eP.event.eventStatus,
        name: eP.event.name,
        tourId: eP.event.tourYear.tourId,
        tourYearId: eP.event.tourYear.id,
        tourYear: eP.event.tourYear.year,
        tourGender: eP.event.tourYear.tour.gender,
      },
    }));
  }

  @ApiBody({ type: OddGoLiveDto })
  @ApiResponse({
    description: "Success",
    type: Boolean,
    status: 200,
  })
  @ApiOperation({
    description: "Update client odds",
  })
  @ApiParam({
    name: "eventId",
    description: "The id of the event.",
  })
  @Put("events/:eventId/odds/public")
  async oddsGoLive(
    @Body() payload: OddGoLiveDto,
    @Param() params: EventIdParamDto,
  ): Promise<boolean> {
    const result = await this.traderService.oddsGoLive(params.eventId, payload.projectionType);

    this.cacheManager.reset();

    return result;
  }
}

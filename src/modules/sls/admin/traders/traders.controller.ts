import { Body, Controller, Post, Param, Get, Put, Query, UseGuards, Inject } from "@nestjs/common";
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

import TraderScoresDto from "./dto/traderScores.dto";
import TraderLiveScoresDto from "./dto/traderLiveScores.dto";
import EventSeedDto from "./dto/eventSeed.dto";
import EventParticipantsQuery from "./dto/EventParticipantsQuery.dto";
import OddGoLiveDto from "./dto/oddGoLive.dto";
import { EventIdParamDto, HeatIdParamDto, FetchEventHeatsParams } from "./dto/params.dto";
// import EventResetQuery from "./dto/EventResetQuery.dto";

import { SportsTypes, HeatStatus } from "../../../../constants/system";

import EventParticipantResponse from "./schemas/responses/eventParticipant.response";
import { ScoreHeatResponse } from "./schemas/responses/scores.response";
import HeatsResponse from "./schemas/responses/heats.response";

import * as heatExceptions from "../../../../exceptions/heats";

import TraderService from "./traders.service";

import ApiGuard from "../../../../guards/adminApi.guard";

@ApiBearerAuth()
@UseGuards(ApiGuard)
@ApiTags("traders")
@Controller({
  path: `admin/${SportsTypes.SKATEBOARDING}/traders`,
})
export default class TraderController {
  constructor(
    private readonly traderService: TraderService,
    @Inject(CACHE_MANAGER) protected readonly cacheManager,
  ) {}

  @ApiBody({ type: TraderLiveScoresDto })
  @ApiResponse({
    description: "Success",
    type: Boolean,
    status: 200,
    isArray: true,
  })
  @ApiOperation({
    summary: "Update the data for a particular heat",
    description: "Update the scores for a heat",
  })
  @ApiParam({
    name: "heatId",
    description: "Id of the heat.",
  })
  @Post("scores/heats/:heatId")
  async saveLiveHeatDetails(
    @Body() payload: TraderLiveScoresDto,
    @Param() params: HeatIdParamDto,
  ): Promise<boolean> {
    // check to see that the same player does not exist more than once
    const seen = new Set();
    const hasDuplicates = payload.athletes.some((athlete) => {
      if (!athlete || !athlete.athleteId) return false;

      if (seen.has(athlete.athleteId)) return true;
      else seen.add(athlete.athleteId);

      return false;
    });
    if (hasDuplicates) throw heatExceptions.cannotHaveDuplicatePlayers;

    // check to make sure that all heat scores are not 0
    const seenAthletePositions = new Set();
    const hasDuplicatePositions = payload.athletes.some((athlete) => {
      if (!athlete || !athlete?.heatPosition) return false;

      if (seenAthletePositions.has(athlete.heatPosition)) return true;
      else seenAthletePositions.add(athlete.heatPosition);

      return false;
    });

    if (hasDuplicatePositions && payload.hasHeatEnded) {
      // cannot end heat with no valid winner
      throw heatExceptions.cannotEndHeatWithNoWinnersError;
    }

    if ([HeatStatus.LIVE].includes(payload.heatStatus) && !payload.startDate) {
      // live and start date needs to exist
      throw heatExceptions.missingHeatStartDate;
    } else if (
      [HeatStatus.COMPLETED].includes(payload.heatStatus) &&
      (!payload.startDate || !payload.startDate)
    ) {
      // cannot end without completed
      throw heatExceptions.missingHeatStartEndForCompletedHeat;
    } else if (![HeatStatus.COMPLETED].includes(payload.heatStatus) && payload.hasHeatEnded) {
      // status needs to be completed when ending a heat
      throw heatExceptions.missingHeatStartEndForCompletedHeat;
    }

    const result = await this.traderService.saveLiveHeatDetails(
      payload,
      params.heatId,
      payload.eventId,
    );

    this.cacheManager.reset();

    return result;
  }

  @ApiResponse({
    description: "Success",
    type: ScoreHeatResponse,
    status: 200,
    isArray: true,
  })
  @ApiOperation({
    summary: "Get the data for a particular heat",
    description: "Get the scores for a heat",
  })
  @ApiParam({
    name: "heatId",
    description: "Id of the heat.",
  })
  @Get("scores/heats/:heatId")
  async fetchHeatScore(@Param() params: HeatIdParamDto): Promise<ScoreHeatResponse> {
    const { heat, scores = [] } = await this.traderService.fetchHeatScore(params.heatId);
    if (!heat) throw heatExceptions.heatNotFound();

    const parsedScores = scores.map((score) => ({
      ...score,
      roundSeed: +score.roundSeed,
      roundScore: score.roundScore,
      lineScore1: score.lineScore1,
      lineScore2: score.lineScore2,
      trick1Score: score.trick1Score,
      trick2Score: score.trick2Score,
      trick3Score: score.trick3Score,
      trick4Score: score.trick4Score,
      trick5Score: score.trick5Score,
      trick6Score: score.trick6Score,
    }));

    return {
      heat,
      scores: parsedScores,
    };
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
    description: "Id of the event.",
  })
  @Put("events/:eventId/odds/public")
  async oddsGoLive(
    @Body() payload: OddGoLiveDto,
    @Param() params: EventIdParamDto,
  ): Promise<boolean> {
    const result = await this.traderService.oddsGoLive(
      params.eventId,
      payload.projectionType,
      payload.roundHeatId,
      payload.roundId,
    );

    this.cacheManager.reset();

    return result;
  }

  @ApiResponse({
    description: "Success",
    type: EventParticipantResponse,
    status: 200,
    isArray: true,
  })
  @ApiOperation({
    summary: "Get event participants",
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
    description: "Id of the event.",
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
      baseRoundScore: eP.baseRoundScore,
      baseRunScore: eP.baseRunScore,
      baseTrickScore: eP.baseTrickScore,
      trickCompletion: eP.trickCompletion,
      status: eP.status,
      notes: eP.notes,
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
        leagueId: eP.event.leagueYear.leagueId,
        leagueYearId: eP.event.leagueYear.id,
        leagueYear: eP.event.leagueYear.year,
        leagueGender: eP.event.leagueYear.league.gender,
      },
    }));
  }

  @ApiBody({ type: TraderScoresDto })
  @ApiResponse({
    description: "Success",
    type: Boolean,
    status: 200,
  })
  @ApiOperation({
    summary: "Bulk save past events data",
    description: "Save past event data",
  })
  @Post("scores")
  async saveScores(@Body() scores: TraderScoresDto): Promise<boolean> {
    const result = await this.traderService.saveScores(scores);

    this.cacheManager.reset();

    return result;
  }

  @ApiBody({ type: EventSeedDto })
  @ApiResponse({
    type: Boolean,
    status: 200,
  })
  @ApiOperation({
    summary: "Bulk save event seed",
    description: "Save event seed",
  })
  @Post("events/seeds")
  async saveEventSeed(@Body() payload: EventSeedDto): Promise<boolean> {
    const result = await this.traderService.saveEventSeed(payload);

    this.cacheManager.reset();

    return result;
  }

  @ApiResponse({
    type: Boolean,
    status: 200,
  })
  @ApiOperation({
    description: "Reset an event back to the opening round",
  })
  // @ApiQuery({
  //   name: "baseReset",
  //   type: "number",
  //   required: false,
  //   description:
  //     "Indicates if the event should be reset back to in window state with no participants",
  // })
  @ApiParam({
    name: "eventId",
    description: "Id of the event.",
  })
  @Post("events/:eventId/reset")
  async resetEvent(@Param() params: EventIdParamDto /* @Query() queryParams: EventResetQuery */) {
    const result = await this.traderService.resetEvent(
      params.eventId /* queryParams.baseReset === 1 */,
    );

    this.cacheManager.reset();

    return result;
  }

  @ApiResponse({
    description: "Success",
    type: HeatsResponse,
    isArray: true,
    status: 200,
  })
  @ApiOperation({
    description: "Get the heats for an event",
  })
  @ApiParam({
    name: "eventId",
    description: "Id of the event.",
  })
  @ApiParam({
    name: "roundId",
    description: "Id of the round.",
  })
  @Get("events/:eventId/rounds/:roundId/heats")
  async fetchEventHeats(@Param() params: FetchEventHeatsParams): Promise<HeatsResponse[]> {
    const result = await this.traderService.fetchEventHeats(params.eventId, params.roundId);

    this.cacheManager.reset();

    return result;
  }
}

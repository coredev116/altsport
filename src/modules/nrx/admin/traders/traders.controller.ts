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
import groupBy from "lodash.groupby";
import { v4 as uuidv4 } from "uuid";

import TraderScoresDto from "./dto/traderScores.dto";
import EventSeedDto from "./dto/eventSeed.dto";
import TraderLiveScoresDto from "./dto/traderLiveScores.dto";
import OddGoLiveDto from "./dto/oddGoLive.dto";

import { EventIdParamDto, HeatIdParamDto, FetchEventHeatsParams } from "./dto/params.dto";

import Scores from "../../../../entities/nrx/scores.entity";

import EventParticipantsQuery from "./dto/EventParticipantsQuery.dto";

import EventParticipantResponse from "./schemas/responses/eventParticipant.response";
import { ScoreHeatResponse } from "./schemas/responses/scores.response";
import HeatsResponse from "./schemas/responses/heats.response";

import * as heatExceptions from "../../../../exceptions/heats";

import { SportsTypes } from "../../../../constants/system";

import ApiGuard from "../../../../guards/adminApi.guard";

import TraderService from "./traders.service";

@ApiBearerAuth()
@UseGuards(ApiGuard)
@ApiTags("traders")
@Controller({
  path: `admin/${SportsTypes.RALLYCROSS}/traders`,
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
  })
  @ApiOperation({
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
    // const seen = new Set();
    // const hasDuplicates = payload.athletes.some((athlete) => {
    //   if (seen.has(athlete.athleteId)) return true;
    //   else seen.add(athlete.athleteId);

    //   return false;
    // });
    // if (hasDuplicates) throw heatExceptions.cannotHaveDuplicatePlayers;

    const result = await this.traderService.saveLiveHeatDetails(
      payload,
      params.heatId,
      payload.eventId,
    );

    this.cacheManager.reset();

    return result;
  }

  @ApiBody({ type: TraderScoresDto })
  @ApiResponse({
    description: "Success",
    type: Boolean,
    status: 200,
  })
  @ApiOperation({
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
    description: "Save event seed",
  })
  @Post("events/seeds")
  async saveEventSeed(@Body() payload: EventSeedDto): Promise<boolean> {
    const result = await this.traderService.saveEventSeed(payload);

    this.cacheManager.reset();

    return result;
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
    type: ScoreHeatResponse,
    status: 200,
  })
  @ApiOperation({
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

    // create an object that contains the lap statuses that are required
    // so it can be easily fetched later
    const lapObj: {
      [key: string]: string;
    } = {};

    // get max laps that exist at the same time
    let maxLaps = 1;
    let isZeroBased = false;

    scores.forEach((row) => {
      if (row.lapNumber > maxLaps) maxLaps = row.lapNumber;
      if (row.lapNumber === 0) isZeroBased = true;
    });

    scores
      .filter((row) => row.status)
      .forEach((row) => {
        const key = `${row.roundHeatId}_${row.athlete.id}`;
        lapObj[key] = row.status;
      });

    // certain type of data when uploaded from the past
    // only has specific athlete data or specific lap so this is to handle the situation
    // where missing laps are created for the athletes

    // group users based on the scores and then check if each one of them has the same number of laps
    const userScores: {
      [athleteId: string]: Scores[];
    } = groupBy(scores, "athlete.id");

    // create the missing laps for the athletes if any
    Object.keys(userScores).forEach((key: string) => {
      const userLaps: Scores[] = userScores[key];

      const createdLaps: Scores[] = [];
      const singleLap: Scores = userLaps?.[0] || null;

      for (let lap = isZeroBased ? 0 : 1; lap <= maxLaps; lap++) {
        const isLapExists: boolean = userLaps.some((lapItem) => lapItem.lapNumber === lap);

        if (!isLapExists && singleLap)
          createdLaps.push({
            ...singleLap,
            id: uuidv4(),
            lapNumber: lap,
            lapTime: 0,
            isJoker: false,
          });
      }

      if (createdLaps.length) userScores[key] = [...userLaps, ...createdLaps];
    });

    const parsedScores = Object.values(userScores)
      .flat()
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .map(({ athleteId, ...score }) => {
        const key = `${score.roundHeatId}_${score.athlete.id}`;

        return {
          ...score,
          roundSeed: +score.roundSeed,
          lapTime: +score.lapTime,
          jokerLapTime: +score.jokerLapTime,
          heatPosition: +score.heatPosition,
          lapNumber: +score.lapNumber,
          penaltyTime: +score.penaltyTime,
          status: lapObj[key] || null,
        };
      });

    return {
      heat,
      scores: parsedScores,
    };
  }

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
      seedNo: +eP.seedNo,
      baseProjection: +Number(eP.baseProjection).toFixed(3),
      // baseLapTime: +Number(eP.baseLapTime).toFixed(3),
      soloCrashRate: +Number(eP.soloCrashRate).toFixed(3),
      baseHeadLapTime: +Number(eP.baseHeadLapTime).toFixed(3),
      headCrashRate: +Number(eP.headCrashRate).toFixed(3),
      raceCrashRate: +Number(eP.raceCrashRate).toFixed(3),
      // baseJokerLapTime: +Number(eP.baseJokerLapTime).toFixed(3),
      baseNonJokerLapTime: +Number(eP.baseNonJokerLapTime).toFixed(3),
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
        tourId: eP.event.tourYear.tourId,
        tourYearId: eP.event.tourYear.id,
        tourYear: eP.event.tourYear.year,
        tourGender: eP.event.tourYear.tour.gender,
      },
    }));
  }

  @ApiResponse({
    type: Boolean,
    status: 200,
  })
  @ApiOperation({
    description: "Reset an event back to the first round",
  })
  @ApiParam({
    name: "eventId",
    description: "Id of the event.",
  })
  @Post("events/:eventId/reset")
  async resetEvent(@Param() params: EventIdParamDto) {
    const result = await this.traderService.resetEvent(params.eventId);

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
    return this.traderService.fetchEventHeats(params.eventId, params.roundId);
  }
}

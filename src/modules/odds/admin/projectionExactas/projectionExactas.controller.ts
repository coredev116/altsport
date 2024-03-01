import { Controller, Get, Param, Post, Put, Body, UseGuards } from "@nestjs/common";
import {
  ApiResponse,
  ApiOperation,
  ApiBody,
  ApiBearerAuth,
  ApiTags,
  ApiParam,
} from "@nestjs/swagger";
import { ExactasService } from "./projectionExactas.service";

import { CreateExactasDto } from "./dto/createExactas.dto";
import { UpdateExactasDto } from "./dto/updateExactas.dto";
import { UpdateExactasPayoutDto } from "./dto/updateExactasPayout.dto";
import {
  SportsTypeEventHeatParamDto,
  SportsTypeEventParamDto,
  SportsTypeExactasTypeParamDto,
} from "./dto/params.dto";
import OddGoLiveDto from "./dto/oddGoLive.dto";

import * as exactasExceptions from "../../../../exceptions/exactas";

import ProjectionExactasResponse from "./schemas/response/projectionExactas.response";
import { ProjectionExactasHeatResponse } from "./schemas/response/projectionExactasHeat.response";

import { SportsTypes, ExactasType } from "../../../../constants/system";

import ApiGuard from "../../../../guards/adminApi.guard";

@ApiBearerAuth()
@UseGuards(ApiGuard)
@ApiTags("odds")
@Controller({
  path: `admin/:sportsType/events`,
})
export default class ExactasController {
  constructor(private readonly exactasService: ExactasService) {}

  @ApiBody({ type: UpdateExactasDto })
  @ApiResponse({
    type: Boolean,
    status: 200,
  })
  @ApiOperation({
    summary: "Update exactas odds",
    description: "Update exactas odds",
  })
  @ApiParam({
    name: "eventId",
    description: "Id of the event.",
  })
  @ApiParam({
    name: "sportsType",
    description: "Sports Type",
    enum: SportsTypes,
  })
  @Put(":eventId/exactas/odds")
  async updateExactasOdds(
    @Param() params: SportsTypeEventParamDto,
    @Body() payload: UpdateExactasDto,
  ): Promise<boolean> {
    const result = await this.exactasService.updateExactasProjections(params.sportsType, payload);

    return result;
  }

  @ApiResponse({
    type: Boolean,
    status: 200,
  })
  @ApiOperation({
    summary: "Update heat market voided state",
    description: "Call this api to mark a heat as voided",
  })
  @ApiParam({
    name: "sportsType",
    description: "Sports Type",
    enum: SportsTypes,
  })
  @ApiParam({
    name: "eventId",
    description: "Id of the event.",
  })
  @ApiParam({
    name: "heatId",
    description: "Id of the heat.",
  })
  @Put(":eventId/exactas/heats/:heatId/odds/void")
  async updateHeatVoided(@Param() params: SportsTypeEventHeatParamDto): Promise<boolean> {
    const result = await this.exactasService.updateRoundHeatVoid(
      params.sportsType,
      params.eventId,
      params.heatId,
    );

    return result;
  }

  @ApiBody({ type: UpdateExactasPayoutDto })
  @ApiResponse({
    type: Boolean,
    status: 200,
  })
  @ApiOperation({
    summary: "Update exactas payout details",
    description: "Update exactas payout details",
  })
  @ApiParam({
    name: "sportsType",
    description: "Sports Type",
    enum: SportsTypes,
  })
  @ApiParam({
    name: "eventId",
    description: "Id of the event.",
  })
  @Put(":eventId/exactas/odds/payout")
  async updateExactasPayout(
    @Param() params: SportsTypeEventParamDto,
    @Body() payload: UpdateExactasPayoutDto,
  ): Promise<boolean> {
    const isInvalid = payload.items.some((item) => {
      let count = 0;
      if (item?.draw !== undefined) count++;
      if (item?.voided !== undefined) count++;

      if (count !== 1) return true;
    });
    if (isInvalid) throw exactasExceptions.voidAndWinnerRequest;

    const result = await this.exactasService.updateExactasPayout(
      params.sportsType,
      params.eventId,
      payload,
    );

    return result;
  }

  @ApiBody({ type: CreateExactasDto })
  @ApiResponse({
    type: Boolean,
    status: 200,
  })
  @ApiOperation({
    summary: "Create exactas",
    description: "Create exactas",
  })
  @ApiParam({
    name: "sportsType",
    description: "Sports Type",
    enum: SportsTypes,
  })
  @ApiParam({
    name: "eventId",
    description: "Id of the event.",
  })
  @ApiParam({
    name: "exactasType",
    description: "Exactas Type",
    enum: ExactasType,
  })
  @Post(":eventId/exactas/odds/:exactasType")
  async createExactas(
    @Param() params: SportsTypeExactasTypeParamDto,
    @Body() payload: CreateExactasDto,
  ): Promise<boolean> {
    const result = await this.exactasService.createProjectionExactas(
      params.sportsType,
      params.exactasType,
      params.eventId,
      payload,
    );

    return result;
  }

  // @ApiBody({ type: OddGoLiveDto })
  // @ApiResponse({
  //   description: "Success",
  //   type: Boolean,
  //   status: 200,
  // })
  // @ApiOperation({
  //   description: "Publish exactas odds to the client",
  // })
  // @ApiParam({
  //   name: "eventId",
  //   description: "Id of the event.",
  // })
  // @ApiParam({
  //   name: "heatId",
  //   description: "Id of the heat.",
  // })
  // @ApiParam({
  //   name: "sportsType",
  //   description: "Sports Type",
  //   enum: SportsTypes,
  // })
  // @Put(":eventId/exactas/heats/:heatId/odds/public")
  // async exactasHeatOddsGoLive(
  //   @Param() params: SportsTypeEventHeatParamDto,
  //   @Body() payload: OddGoLiveDto,
  // ) {
  //   const result = await this.exactasService.exactasOddsGoLive(
  //     params.sportsType,
  //     params.eventId,
  //     params.heatId,
  //     payload.projectionType,
  //   );

  //   return result;
  // }

  @ApiBody({ type: OddGoLiveDto })
  @ApiResponse({
    description: "Success",
    type: Boolean,
    status: 200,
  })
  @ApiOperation({
    description: "Publish exactas odds to the client",
  })
  @ApiParam({
    name: "eventId",
    description: "Id of the event.",
  })
  @ApiParam({
    name: "sportsType",
    description: "Sports Type",
    enum: SportsTypes,
  })
  @Put(":eventId/exactas/odds/public")
  async exactasGoLive(@Param() params: SportsTypeEventParamDto, @Body() payload: OddGoLiveDto) {
    const result = await this.exactasService.exactasOddsGoLive(
      params.sportsType,
      params.eventId,
      payload.roundHeatId,
      payload.projectionType,
    );

    return result;
  }

  @ApiResponse({
    description: "Success",
    type: ProjectionExactasHeatResponse,
    status: 200,
    isArray: true,
  })
  @ApiOperation({
    summary: "Get Exactas Projection with heat",
    description: "Get Exactas Projection with heat",
  })
  @ApiParam({
    name: "eventId",
    description: "Id of the event.",
  })
  @ApiParam({
    name: "sportsType",
    description: "Sports Type",
    enum: SportsTypes,
  })
  @ApiParam({
    name: "exactasType",
    description: "Exactas Type",
    enum: ExactasType,
  })
  @Get(":eventId/exactas/odds/heat/:exactasType")
  async fetchProjectionExactasHeat(
    @Param() params: SportsTypeExactasTypeParamDto,
    @Param("eventId") eventId: string,
  ): Promise<ProjectionExactasHeatResponse> {
    const [result, roundsResult, clientResult, lastUpdatedProjectionExactas] = await Promise.all([
      this.exactasService.fetchProjectionExactasHeat(
        params.sportsType,
        eventId,
        params.exactasType,
        true,
      ),
      this.exactasService.fetchRoundHeats(params.sportsType, eventId),
      this.exactasService.getLastUpdatedClientProjectionExactas(params.sportsType, eventId, true),
      this.exactasService.getLastUpdatedProjectionExactas(params.sportsType, eventId, true),
    ]);

    return {
      odds: roundsResult.map((round) => {
        const eventRound = round.eventRounds.find(
          (eventRoundItem) => eventRoundItem.roundId === round.id,
        );
        return {
          id: round.id,
          name: round.name,
          roundNo: round.roundNo,
          roundStatus: eventRound?.roundStatus || null,
          heats: round.heats.map((heat) => {
            // const clientOdd = clientResult.find((clientEOdd) => clientEOdd.roundHeatId === heat.id);
            return {
              id: heat.id,
              name: heat.name,
              heatNo: heat.heatNo,
              isHeatWinnerMarketVoided: heat.isHeatWinnerMarketVoided,
              isHeatWinnerMarketOpen: heat.isHeatWinnerMarketOpen,
              heatStatus: heat.heatStatus,
              // clientUpdatedAtDate: clientOdd?.updatedAt || null,
              clientUpdatedAtDate: clientResult?.updatedAt || null,
              traderUpdatedAtDate: lastUpdatedProjectionExactas?.updatedAt || null,
              athletes: result.filter((odd) => odd.roundHeatId === heat.id) || [],
            };
          }),
        };
      }),
    };
  }

  @ApiResponse({
    description: "Success",
    type: ProjectionExactasResponse,
    status: 200,
    isArray: true,
  })
  @ApiOperation({
    summary: "Get Exactas Projection",
    description: "Get Exactas Projection",
  })
  @ApiParam({
    name: "eventId",
    description: "Id of the event.",
  })
  @ApiParam({
    name: "sportsType",
    description: "Sports Type",
    enum: SportsTypes,
  })
  @ApiParam({
    name: "exactasType",
    description: "Exactas Type",
    enum: ExactasType,
  })
  @Get(":eventId/exactas/odds/:exactasType")
  async fetchProjectionExactasEvent(
    @Param() params: SportsTypeExactasTypeParamDto,
    @Param("eventId") eventId: string,
  ): Promise<ProjectionExactasResponse> {
    const [result, clientResult, lastUpdatedProjectionExactas] = await Promise.all([
      this.exactasService.fetchProjectionExactas(
        params.sportsType,
        eventId,
        params.exactasType,
        false,
      ),
      this.exactasService.getLastUpdatedClientProjectionExactas(params.sportsType, eventId, false),
      this.exactasService.getLastUpdatedProjectionExactas(params.sportsType, eventId, false),
    ]);

    const parsedResult = result.map((row) => ({
      id: row.id,
      eventId: row.eventId,
      roundHeatId: row.roundHeatId,
      position: row.position,
      voided: row.voided,
      draw: row.draw,
      holdingPercentage: +Number(row.holdingPercentage).toFixed(2),
      odds: +Number(row.odds).toFixed(2),
      probability: +Number(row.probability).toFixed(2),
      trueProbability: +Number(row.trueProbability).toFixed(2),
      hasModifiedProbability: row.hasModifiedProbability,
      participants: row.participants,
    }));

    return {
      clientUpdatedAtDate: clientResult?.updatedAt || null,
      traderUpdatedAtDate: lastUpdatedProjectionExactas?.updatedAt || null,
      // eventWinnerAthleteId: null,
      odds: parsedResult,
    };
  }
}

import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { ApiResponse, ApiOperation, ApiBearerAuth, ApiTags, ApiParam } from "@nestjs/swagger";
import { ExactasService } from "./projectionExactas.service";

import {
  SportsTypeEventParamDto,
  SportsTypeEventRoundParamDto,
  SportsTypeExactasTypeParamDto,
} from "./dto/params.dto";

import ProjectionExactasResponse from "./schemas/response/projectionExactas.response";
import ProjectionExactasHeatResponse from "./schemas/response/projectionExactasHeat.response";
import EventExactasDownloadResponse from "./schemas/response/projectionExactasDownload.response";
import EventExactasHeatsDownloadResponse from "./schemas/response/projectionExactasHeatDownload.response";

import { SportsTypes, ExactasType } from "../../../../constants/system";

import ApiGuard from "../../../../guards/clientApi.guard";

@ApiBearerAuth()
@UseGuards(ApiGuard)
@ApiTags("odds")
@Controller({
  path: `client/:sportsType/events`,
})
export default class ExactasController {
  constructor(private readonly exactasService: ExactasService) {}

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
  ): Promise<ProjectionExactasHeatResponse[]> {
    const result = await this.exactasService.fetchProjectionExactasHeat(
      params.sportsType,
      params.eventId,
      params.exactasType,
      true,
    );
    const roundObj: {
      [key: string]: ProjectionExactasHeatResponse;
    } = {};

    result.forEach((eventOdd) => {
      if (!roundObj[eventOdd.heat.round.id]) {
        const eventRound = eventOdd.heat.round.eventRounds.find(
          (eventRoundItem) => eventRoundItem.roundId === eventOdd.heat.round.id,
        );
        roundObj[eventOdd.heat.round.id] = {
          id: eventOdd.id,
          roundId: eventOdd.heat.round.id,
          name: eventOdd.heat.round.name,
          roundNo: eventOdd.heat.round.roundNo,
          roundStatus: eventRound.roundStatus,
          heats: [],
          createdAt: eventOdd.createdAt,
          updatedAt: eventOdd.updatedAt,
        };
      }

      // find heat where the id matches
      const heat = roundObj[eventOdd.heat.round.id].heats.find(
        (heatItem) => heatItem.id === eventOdd.heat.id,
      );

      if (!heat)
        roundObj[eventOdd.heat.round.id].heats.push({
          id: eventOdd.heat.id,
          name: `${eventOdd.heat.heatName} ${eventOdd.heat.heatNo}`,
          heatNo: +eventOdd.heat.heatNo,
          // isHeatWinnerMarketVoided: eventOdd.heat.isHeatWinnerMarketVoided,
          // isHeatWinnerMarketOpen: eventOdd.heat.isHeatWinnerMarketOpen,
          // heatWinnerAthleteId: eventOdd.heat.winnerAthleteId,
          heatStatus: eventOdd.heat.heatStatus,
          athletes: [
            {
              heatOddId: eventOdd.id,
              voided: eventOdd.voided,
              draw: eventOdd.draw,
              holdingPercentage: +Number(eventOdd.holdingPercentage).toFixed(2),
              odds: +Number(eventOdd.odds).toFixed(2),
              probability: +Number(eventOdd.probability).toFixed(2),
              trueProbability: +Number(eventOdd.trueProbability).toFixed(2),
              hasModifiedProbability: eventOdd.hasModifiedProbability,
              participants: eventOdd.participants,
            },
          ],
        });
      else {
        heat.athletes.push({
          heatOddId: eventOdd.id,
          voided: eventOdd.voided,
          draw: eventOdd.draw,
          holdingPercentage: +Number(eventOdd.holdingPercentage).toFixed(2),
          odds: +Number(eventOdd.odds).toFixed(2),
          probability: +Number(eventOdd.probability).toFixed(2),
          trueProbability: +Number(eventOdd.trueProbability).toFixed(2),
          hasModifiedProbability: eventOdd.hasModifiedProbability,
          participants: eventOdd.participants,
        });

        roundObj[eventOdd.heat.round.id].heats = [
          ...roundObj[eventOdd.heat.round.id].heats.filter((heatRound) => heatRound.id !== heat.id),
          heat,
        ];
      }

      return eventOdd;
    });

    const parsedData = Object.values(roundObj).sort((a, b) => a.roundNo - b.roundNo);

    return parsedData;
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
  @Get(":eventId/exactas/odds")
  async fetchProjectionExactas(
    @Param() params: SportsTypeEventParamDto,
  ): Promise<ProjectionExactasResponse[]> {
    const result = await this.exactasService.fetchProjectionExactas(
      params.sportsType,
      params.eventId,
      false,
    );
    const parsedResult = result.map((row) => {
      return {
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
      };
    });

    return parsedResult;
  }

  @ApiOperation({
    description: "Returns the exactas odds with heat for a particular event",
  })
  @ApiResponse({
    type: EventExactasDownloadResponse,
    status: 200,
  })
  @ApiParam({
    name: "eventId",
    description: "Id of the event.",
  })
  @ApiParam({
    name: "roundId",
    description: "Id of the round.",
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
  @Get(":eventId/rounds/:roundId/exactas/heats/:exactasType/download")
  async downloadExactasOddsHeat(
    @Param() params: SportsTypeEventRoundParamDto,
  ): Promise<EventExactasHeatsDownloadResponse> {
    return this.exactasService.downloadExactasOddsHeat(
      params.sportsType,
      params.eventId,
      params.roundId,
      params.exactasType,
    );
  }

  @ApiOperation({
    description: "Returns the exactas odds for a particular event",
  })
  @ApiResponse({
    type: EventExactasDownloadResponse,
    status: 200,
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
  @Get(":eventId/exactas/:exactasType/download")
  async downloadExactasOdds(
    @Param() params: SportsTypeExactasTypeParamDto,
  ): Promise<EventExactasDownloadResponse> {
    return this.exactasService.downloadExactasOdds(
      params.sportsType,
      params.eventId,
      params.exactasType,
    );
  }
}

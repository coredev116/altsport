import { Controller, Get, Param, Put, Body, UseGuards } from "@nestjs/common";
import {
  ApiResponse,
  ApiOperation,
  ApiBody,
  ApiBearerAuth,
  ApiTags,
  ApiParam,
} from "@nestjs/swagger";
import { DreamTeamService } from "./dreamTeam.service";

import { UpdateDreamTeamPayoutDto } from "./dto/updateDreamTeamPayout.dto";
import { UpdateDreamTeamDto } from "./dto/updateDreamTeam.dto";
import { SportsTypeEventParamDto, SportsTypeEventIdParamDto } from "./dto/params.dto";
import OddGoLiveDto from "./dto/oddGoLive.dto";

import ProjectionDreamTeamResponse from "./schemas/response/dreamTeam.response";

import * as dreamTeamExceptions from "../../../../exceptions/dreamTeam";

import { SportsTypes } from "../../../../constants/system";

import ApiGuard from "../../../../guards/adminApi.guard";

@ApiBearerAuth()
@UseGuards(ApiGuard)
@ApiTags("odds")
@Controller({
  path: `admin/:sportsType/events`,
})
export default class DreamTeamController {
  constructor(private readonly dreamTeamService: DreamTeamService) {}

  @ApiBody({ type: UpdateDreamTeamPayoutDto })
  @ApiResponse({
    type: Boolean,
    status: 200,
  })
  @ApiOperation({
    summary: "Update dream team payout details",
    description: "Update dream team payout details",
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
  @Put(":eventId/dreamTeam/odds/payout")
  async updateDreamTeamPayout(
    @Param() params: SportsTypeEventParamDto,
    @Body() payload: UpdateDreamTeamPayoutDto,
  ): Promise<boolean> {
    const isInvalid = payload.items.some((item) => {
      let count = 0;
      if (item?.draw !== undefined) count++;
      if (item?.voided !== undefined) count++;

      if (count !== 1) return true;
    });
    if (isInvalid) throw dreamTeamExceptions.voidAndWinnerRequest;

    const result = await this.dreamTeamService.updateProjectionDreamTeamPayout(
      params.sportsType,
      params.eventId,
      payload,
    );

    return result;
  }

  @ApiBody({ type: UpdateDreamTeamDto })
  @ApiResponse({
    type: Boolean,
    status: 200,
  })
  @ApiOperation({
    summary: "Update dream team odds",
    description: "Update dream team odds",
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
    name: "dreamTeamId",
    description: "ID of the dream team.",
  })
  @Put(":eventId/dreamTeam/:dreamTeamId")
  async updateDreamTeamOdds(
    @Param() params: SportsTypeEventParamDto,
    @Body() payload: UpdateDreamTeamDto,
  ): Promise<boolean> {
    const result = await this.dreamTeamService.updateDreamTeamProjections(
      params.sportsType,
      params.dreamTeamId,
      payload,
    );

    return result;
  }

  @ApiResponse({
    description: "Success",
    type: ProjectionDreamTeamResponse,
    status: 200,
    isArray: true,
  })
  @ApiOperation({
    summary: "Get Dream Team Projection",
    description: "Get Dream Team Projection",
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
  @Get(":eventId/dreamTeam/odds")
  async fetchProjectionDreamTeam(
    @Param() params: SportsTypeEventParamDto,
    @Param("eventId") eventId: string,
  ): Promise<ProjectionDreamTeamResponse[]> {
    const [result, clientResult, lastUpdatedProjectionDreamTeam] = await Promise.all([
      this.dreamTeamService.fetchProjectionDreamTeam(params.sportsType, eventId),
      this.dreamTeamService.fetchClientProjectionDreamTeam(params.sportsType, eventId),
      this.dreamTeamService.getLastUpdatedProjectionDreamTeam(params.sportsType, eventId),
    ]);

    const parsedResult = result.map((row) => {
      return {
        clientUpdatedAtDate: clientResult?.updatedAt || null,
        traderUpdatedAtDate: lastUpdatedProjectionDreamTeam?.updatedAt || null,
        id: row.id,
        eventId: row.eventId,
        voided: row.voided,
        draw: row.draw,
        teams: row.participants.map((participant) => ({
          id: participant.id,
          team: participant.team,
          odds: +Number(participant.odds).toFixed(2),
          probability: +Number(participant.probability).toFixed(2),
          trueProbability: +Number(participant.trueProbability).toFixed(2),
          hasModifiedProbability: participant.hasModifiedProbability,
          participants: participant.participants,
        })),
      };
    });

    return parsedResult;
  }

  @ApiBody({ type: OddGoLiveDto })
  @ApiResponse({
    description: "Success",
    type: Boolean,
    status: 200,
  })
  @ApiOperation({
    description: "Publish dream team odds to the client",
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
  @Put(":eventId/dreamTeam/odds/public")
  async dreamTeamOddsGoLive(
    @Param() params: SportsTypeEventIdParamDto,
    @Body() payload: OddGoLiveDto,
  ) {
    const result = await this.dreamTeamService.dreamTeamOddsGoLive(
      params.sportsType,
      params.eventId,
      payload.projectionType,
    );

    return result;
  }
}

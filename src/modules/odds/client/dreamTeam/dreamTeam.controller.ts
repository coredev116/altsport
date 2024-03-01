import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { ApiResponse, ApiOperation, ApiBearerAuth, ApiTags, ApiParam } from "@nestjs/swagger";
import { DreamTeamService } from "./dreamTeam.service";

import { SportsTypeEventParamDto } from "./dto/params.dto";

import ProjectionDreamTeamResponse from "./schemas/response/dreamTeam.response";
import EventDreamTeamDownloadResponse from "./schemas/response/dreamTeamDownload.response";

import { SportsTypes } from "../../../../constants/system";

import ApiGuard from "../../../../guards/clientApi.guard";

@ApiBearerAuth()
@UseGuards(ApiGuard)
@ApiTags("odds")
@Controller({
  path: `client/:sportsType/events`,
})
export default class DreamTeamController {
  constructor(private readonly dreamTeamService: DreamTeamService) {}

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
  ): Promise<ProjectionDreamTeamResponse[]> {
    const result = await this.dreamTeamService.fetchProjectionDreamTeam(
      params.sportsType,
      params.eventId,
    );
    const parsedResult = result.map((row) => {
      return {
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

  @ApiOperation({
    description: "Returns the dream team odds for a particular event",
  })
  @ApiResponse({
    type: EventDreamTeamDownloadResponse,
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
  @Get(":eventId/dreamTeam/download")
  async downloadDreamTeamOdds(
    @Param() params: SportsTypeEventParamDto,
  ): Promise<EventDreamTeamDownloadResponse> {
    return this.dreamTeamService.downloadDreamTeamOdds(params.sportsType, params.eventId);
  }
}

import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { ApiTags, ApiResponse, ApiBearerAuth, ApiParam, ApiOperation } from "@nestjs/swagger";

import { SportsTypes } from "../../../../constants/system";

import { OddsService } from "./odds.service";

import { EventIdParamDto } from "./dto/params.dto";

import EventResponse from "./schemas/response/event.response";
import PlayerHeadToHeadsResponse from "./schemas/response/playerHeadToHeads.response";
import PlayerHeadToHeadsDownloadResponse from "./schemas/response/playerHeadToHeadsDownload.response";

import * as eventExceptions from "../../../../exceptions/events";

import ApiGuard from "../../../../guards/clientApi.guard";

@ApiBearerAuth()
@UseGuards(ApiGuard)
@ApiTags("MXGP")
@Controller({
  path: `client/${SportsTypes.MXGP}/events`,
})
export class OddsController {
  constructor(private readonly oddsService: OddsService) {}

  @ApiResponse({
    description: "Success",
    type: PlayerHeadToHeadsResponse,
    status: 200,
    isArray: true,
  })
  @ApiOperation({
    summary: "Get head to head matches",
    description: "Get head to head matches",
  })
  @ApiParam({
    name: "eventId",
    description: "The id of the event for which the data should be returned.",
  })
  @Get(":eventId/headToHead/odds")
  async fetchPlayerHeadToHeads(
    @Param() params: EventIdParamDto,
  ): Promise<PlayerHeadToHeadsResponse[]> {
    const event = await this.oddsService.fetchEvent(params.eventId);
    if (!event) throw eventExceptions.eventNotFound();

    const result = await this.oddsService.fetchPlayerHeadToHeads(params.eventId);

    const parsedResult = result.map((row) => {
      return {
        id: row.id,
        startDate: event.startDate,
        eventId: row.eventId,
        voided: row.voided,
        draw: row.draw,
        holdingPercentage: +row.holdingPercentage,
        eventParticipant1: {
          id: row.eventParticipant1.id,
          position: row.player1Position,
          odds: +Number(row.player1Odds).toFixed(2),
          probability: +Number(row.player1Probability).toFixed(2),
          trueProbability: +Number(row.player1TrueProbability).toFixed(2),
          hasModifiedProbability: row.player1HasModifiedProbability,
          athlete: {
            id: row.eventParticipant1.athlete.id,
            firstName: row.eventParticipant1.athlete.firstName,
            middleName: row.eventParticipant1.athlete.middleName,
            lastName: row.eventParticipant1.athlete.lastName,
            nationality: row.eventParticipant1.athlete.nationality,
            stance: row.eventParticipant1.athlete.stance,
            seedNo: row.eventParticipant1.seedNo,
          },
        },
        eventParticipant2: {
          id: row.eventParticipant2.id,
          position: row.player2Position,
          odds: +Number(row.player2Odds).toFixed(2),
          probability: +Number(row.player2Probability).toFixed(2),
          trueProbability: +Number(row.player2TrueProbability).toFixed(2),
          hasModifiedProbability: row.player2HasModifiedProbability,
          athlete: {
            id: row.eventParticipant2.athlete.id,
            firstName: row.eventParticipant2.athlete.firstName,
            middleName: row.eventParticipant2.athlete.middleName,
            lastName: row.eventParticipant2.athlete.lastName,
            nationality: row.eventParticipant2.athlete.nationality,
            stance: row.eventParticipant2.athlete.stance,
            seedNo: row.eventParticipant2.seedNo,
          },
        },
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        winnerParticipantId: row.eventParticipantWinnerId,
      };
    });

    return parsedResult;
  }

  @ApiResponse({
    description: "Success",
    type: EventResponse,
    status: 200,
  })
  @ApiParam({
    name: "eventId",
    description: "The id of the event for which the data should be returned.",
  })
  @Get(":eventId")
  async fetchEvent(@Param() params: EventIdParamDto): Promise<EventResponse> {
    const event = await this.oddsService.fetchEvent(params.eventId);
    if (!event) throw eventExceptions.eventNotFound();

    const markets = await this.oddsService.getMarkets(params.eventId);

    return {
      id: event.id,
      name: event.name,
      sportType: SportsTypes.MXGP,
      startDate: event.startDate,
      endDate: event.endDate,
      eventNumber: event.eventNumber,
      eventStatus: event.eventStatus,
      eventLocation: event.eventLocation,
      eventLocationGroup: event.eventLocationGroup,
      year: event.tourYear.year,
      markets,
      tour: {
        id: event.tourYear.tour.id,
        name: event.tourYear.tour.name,
        gender: event.tourYear.tour.gender,
      },
    };
  }

  @ApiOperation({
    description: "Returns the head to head odds for a particular event",
  })
  @ApiResponse({
    type: PlayerHeadToHeadsDownloadResponse,
    status: 200,
  })
  @ApiParam({
    name: "eventId",
    description: "The id of the event for which the data should be returned",
  })
  @Get(":eventId/headToHead/download")
  async downloadPlayerHeadToHeadsOdds(
    @Param() params: EventIdParamDto,
  ): Promise<PlayerHeadToHeadsDownloadResponse> {
    return this.oddsService.downloadHeadToHeadOdds(params.eventId);
  }
}

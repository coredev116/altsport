import { Controller, Get, Param, UseGuards, Query } from "@nestjs/common";
import {
  ApiTags,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiOperation,
  ApiQuery,
} from "@nestjs/swagger";

import { SportsTypes, API_SORT_ORDER } from "../../../../constants/system";

import { OddsService } from "./odds.service";

import { EventIdParamDto, EventIdRoundIdParamDto } from "./dto/params.dto";
import { EventOddsDto, PlayerHeadToHeadListing } from "./dto/odds.dto";

import { FDRIFTPublicStatsSortColumns } from "../../../../constants/fdrift";

import EventResponse from "./schemas/response/event.response";
import EventOddsResponse from "./schemas/response/eventOdds.response";
import EventHeatOddsResponse from "./schemas/response/eventHeatOdds.response";
import PlayerHeadToHeadsResponse, {
  PlayerHeadToHeadsPageResponse,
} from "./schemas/response/playerHeadToHeads.response";
import PlayerHeadToHeadsDownloadResponse from "./schemas/response/playerHeadToHeadsDownload.response";
import EventOddsDownloadResponse from "./schemas/response/eventOddsDownload.response";
import EventHeatOddsDownloadResponse from "./schemas/response/eventHeatOddsDownload.response";

import * as eventExceptions from "../../../../exceptions/events";

import ApiGuard from "../../../../guards/clientApi.guard";

@ApiBearerAuth()
@UseGuards(ApiGuard)
@ApiTags("Formula Drift")
@Controller({
  path: `client/${SportsTypes.FDRIFT}/events`,
})
export class OddsController {
  constructor(private readonly oddsService: OddsService) {}

  @ApiQuery({
    name: "position",
    type: "number",
    required: true,
    description: "Position for which the odds should be fetched",
  })
  @ApiParam({
    name: "eventId",
    description: "The id of the event for which the data should be returned.",
  })
  @ApiOperation({
    description: "Returns the event winner and second place odds for a particular event.",
  })
  @ApiResponse({
    type: EventOddsResponse,
    status: 200,
    isArray: true,
  })
  @Get(":eventId/odds")
  async fetchEventodds(
    @Param() params: EventIdParamDto,
    @Query() queryParams: EventOddsDto,
  ): Promise<EventOddsResponse[]> {
    const [event, eventOdds] = await Promise.all([
      this.oddsService.fetchEventMinimal(params.eventId),
      this.oddsService.fetchEventOdds(params.eventId, queryParams.position),
    ]);

    let positionParticipantId: string;
    if (queryParams.position !== 1)
      positionParticipantId = await this.oddsService.fetchEventPositionParticipant(
        params.eventId,
        queryParams.position,
      );

    return eventOdds.map((eventOdd) => ({
      id: eventOdd.id,
      startDate: event.startDate,
      eventParticipantId: eventOdd.eventParticipantId,
      eventWinnerAthleteId:
        queryParams.position !== 1 ? positionParticipantId : event.winnerAthleteId,
      odds: +Number(eventOdd.odds).toFixed(2),
      position: +eventOdd.position,
      probability: +Number(eventOdd.probability).toFixed(2),
      trueProbability: +Number(eventOdd.trueProbability).toFixed(2),
      hasModifiedProbability: eventOdd.hasModifiedProbability,
      athlete: {
        id: eventOdd.participant.athlete.id,
        firstName: eventOdd.participant.athlete.firstName,
        middleName: eventOdd.participant.athlete.middleName,
        lastName: eventOdd.participant.athlete.lastName,
        gender: eventOdd.participant.athlete.gender,
        nationality: eventOdd.participant.athlete.nationality,
        stance: eventOdd.participant.athlete.stance,
        seedNo: +eventOdd.participant.seedNo,
      },
      createdAt: eventOdd.createdAt,
      updatedAt: eventOdd.updatedAt,
    }));
  }

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
  @ApiQuery({
    name: "page",
    type: "number",
    required: false,
    description: "Page number for which the results should be returned",
  })
  @ApiQuery({
    name: "sortColumn",
    type: "enum",
    enum: FDRIFTPublicStatsSortColumns,
    required: false,
    description: "Column on which to sort the results.",
  })
  @ApiQuery({
    name: "sortOrder",
    type: "enum",
    enum: API_SORT_ORDER,
    required: false,
    description: "Order in which the results should be sorted",
  })
  @ApiQuery({
    name: "query",
    type: "string",
    required: false,
    description: "Athlete firstName, lastName for which to return results.",
  })
  @Get(":eventId/headToHead/odds/page")
  async fetchPlayerHeadToHeadsPage(
    @Param() params: EventIdParamDto,
    @Query() queryParams: PlayerHeadToHeadListing,
  ): Promise<PlayerHeadToHeadsPageResponse> {
    return this.oddsService.fetchPlayerHeadToHeadsPagination(
      params.eventId,
      queryParams.page,
      queryParams.query,
      queryParams.sortColumn,
      queryParams.sortOrder,
    );
  }

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
    const event = await this.oddsService.fetchEventMinimal(params.eventId);
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

  @ApiOperation({
    description: "Returns the heat odds for a particular event.",
  })
  @ApiResponse({
    type: EventHeatOddsResponse,
    status: 200,
    isArray: true,
  })
  @ApiParam({
    name: "eventId",
    description: "The id of the event for which the data should be returned.",
  })
  @Get(":eventId/heats/odds")
  async fetchHeatOdds(@Param() params: EventIdParamDto): Promise<EventHeatOddsResponse[]> {
    const eventOdds = await this.oddsService.fetchHeatOdds(params.eventId);

    const roundObj: {
      [key: string]: EventHeatOddsResponse;
    } = {};

    eventOdds.forEach((eventOdd) => {
      if (!roundObj[eventOdd.heat.round.id]) {
        const eventRound = eventOdd.heat.round.eventRounds.find(
          (eventRoundItem) => eventRoundItem.roundId === eventOdd.heat.round.id,
        );
        roundObj[eventOdd.heat.round.id] = {
          id: eventOdd.id,
          // FIXME: this needs to actually be the upcoming heat start time
          startDate: null,
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
          isHeatWinnerMarketVoided: eventOdd.heat.isHeatWinnerMarketVoided,
          isHeatWinnerMarketOpen: eventOdd.heat.isHeatWinnerMarketOpen,
          heatWinnerAthleteId: eventOdd.heat.winnerAthleteId,
          heatStatus: eventOdd.heat.heatStatus,
          athletes: [
            {
              id: eventOdd.participant.athlete.id,
              heatOddId: eventOdd.id,
              eventParticipantId: eventOdd.eventParticipantId,
              firstName: eventOdd.participant.athlete.firstName,
              middleName: eventOdd.participant.athlete.middleName,
              lastName: eventOdd.participant.athlete.lastName,
              gender: eventOdd.participant.athlete.gender,
              nationality: eventOdd.participant.athlete.nationality,
              stance: eventOdd.participant.athlete.stance,
              odds: +Number(eventOdd.odds).toFixed(2),
              probability: +Number(eventOdd.probability).toFixed(2),
              trueProbability: +Number(eventOdd.trueProbability).toFixed(2),
              hasModifiedProbability: eventOdd.hasModifiedProbability,
              seedNo: +eventOdd.participant.seedNo,
            },
          ],
        });
      else {
        heat.athletes.push({
          id: eventOdd.participant.athlete.id,
          heatOddId: eventOdd.id,
          eventParticipantId: eventOdd.eventParticipantId,
          firstName: eventOdd.participant.athlete.firstName,
          middleName: eventOdd.participant.athlete.middleName,
          lastName: eventOdd.participant.athlete.lastName,
          gender: eventOdd.participant.athlete.gender,
          nationality: eventOdd.participant.athlete.nationality,
          stance: eventOdd.participant.athlete.stance,
          odds: +Number(eventOdd.odds).toFixed(2),
          probability: +Number(eventOdd.probability).toFixed(2),
          trueProbability: +Number(eventOdd.trueProbability).toFixed(2),
          hasModifiedProbability: eventOdd.hasModifiedProbability,
          seedNo: +eventOdd.participant.seedNo,
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
      sportType: SportsTypes.FDRIFT,
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

  @ApiOperation({
    description: "Returns the odds for a particular event, position",
  })
  @ApiResponse({
    type: EventOddsDownloadResponse,
    status: 200,
  })
  @ApiParam({
    name: "eventId",
    description: "The id of the event for which the data should be returned",
  })
  @ApiQuery({
    name: "position",
    type: "number",
    required: true,
    description: "Position for which the odds should be fetched",
  })
  @Get(":eventId/odds/download")
  async downloadEventOdds(
    @Param() params: EventIdParamDto,
    @Query() queryParams: EventOddsDto,
  ): Promise<EventOddsDownloadResponse> {
    return this.oddsService.downloadEventOdds(params.eventId, queryParams.position);
  }

  @ApiOperation({
    description: "Returns the heat odds for a particular event, round.",
  })
  @ApiResponse({
    type: EventHeatOddsDownloadResponse,
    status: 200,
  })
  @ApiParam({
    name: "eventId",
    description: "The id of the event for which the data should be returned.",
  })
  @ApiParam({
    name: "roundId",
    description: "The id of the round for which the data should be returned.",
  })
  @Get(":eventId/rounds/:roundId/heats/odds/download")
  async downloadHeatOdds(
    @Param() params: EventIdRoundIdParamDto,
  ): Promise<EventHeatOddsDownloadResponse> {
    return this.oddsService.downloadHeatOdds(params.eventId, params.roundId);
  }
}

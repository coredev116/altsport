import {
  Controller,
  Get,
  Param,
  Query,
  Put,
  Post,
  Body,
  UseGuards,
  Sse,
  Inject,
} from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { fromEvent } from "rxjs";
import { EventEmitter2 } from "@nestjs/event-emitter";
import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
} from "@nestjs/swagger";

import { SportsTypes, API_SORT_ORDER, OddMarkets } from "../../../../constants/system";

import { EventOddsDto, UpdateEventOddDto, UpdateEventHeatOddDto } from "./dto/odds.dto";
import { EventIdParamDto, UpdateHeatVoidedParams } from "./dto/params.dto";
import {
  createPlayerHeadToHeadsDto,
  updatePlayerHeadToHeadsDto,
  updatePlayerHeadToHeadsPayoutDto,
  PlayerHeadToHeadListing,
} from "../odds/dto/playerHeadToHeads.dto";

import { OddsService } from "./odds.service";

import { EventHeatOdds, EventHeatOddsResponse } from "./schemas/response/eventHeatOdds.response";
import EventOddsResponse from "./schemas/response/eventOdds.response";
import PlayerHeadToHeadsResponse, {
  PlayerHeadToHeadsPageListingResponse,
} from "./schemas/response/playerHeadToHeads.response";

import QueueService from "../../../system/queue/queue.service";
import EventsService from "../events/events.service";

import { FDRIFTPublicStatsSortColumns } from "../../../../constants/fdrift";

import * as headToHeadExceptions from "../../../../exceptions/playerHeadToHeads";

import ApiGuard from "../../../../guards/adminApi.guard";

@ApiBearerAuth()
@UseGuards(ApiGuard)
@ApiTags("odds")
@Controller({
  path: `admin/${SportsTypes.FDRIFT}/events`,
})
export class OddsController {
  constructor(
    private eventEmitter: EventEmitter2,
    @Inject(CACHE_MANAGER) protected readonly cacheManager,
    private readonly oddsService: OddsService,
    private readonly queueService: QueueService,
    private readonly eventsService: EventsService,
  ) {}

  @Sse("odds/sse")
  sse() {
    return fromEvent(this.eventEmitter, `${SportsTypes.FDRIFT}OddEvent`);
  }

  @ApiQuery({
    name: "position",
    type: "number",
    required: true,
    description: "Position for which the odds should be fetched",
  })
  @ApiOperation({
    description: "Returns the event winner and second place odds for a particular event.",
  })
  @ApiResponse({
    type: EventOddsResponse,
    status: 200,
    isArray: true,
  })
  @ApiParam({
    name: "eventId",
    description: "Id of the event.",
  })
  @Get(":eventId/odds")
  async fetchEventodds(
    @Param() params: EventIdParamDto,
    @Query() queryParams: EventOddsDto,
  ): Promise<EventOddsResponse> {
    const [event, eventOdds, clientEventOdd] = await Promise.all([
      this.eventsService.fetchEventMinimal(params.eventId),
      this.oddsService.fetchEventOdds(params.eventId, queryParams.position),
      this.oddsService.fetchClientEventOdd(params.eventId, queryParams.position),
    ]);

    let positionParticipantId: string;
    if (queryParams.position !== 1)
      positionParticipantId = await this.eventsService.fetchEventPositionParticipant(
        params.eventId,
        queryParams.position,
      );

    return {
      eventWinnerAthleteId:
        queryParams.position !== 1 ? positionParticipantId : event.winnerAthleteId,
      clientUpdatedAtDate: clientEventOdd?.updatedAt || null,
      traderUpdatedAtDate: eventOdds[0]?.updatedAt || null,
      odds: eventOdds.map((eventOdd) => ({
        id: eventOdd.id,
        eventParticipantId: eventOdd.eventParticipantId,
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
      })),
    };
  }

  @ApiOperation({
    description: "Returns the heat odds for a particular event.",
  })
  @ApiResponse({
    type: EventHeatOddsResponse,
    status: 200,
  })
  @ApiParam({
    name: "eventId",
    description: "Id of the event.",
  })
  @Get(":eventId/heats/odds")
  async fetchHeatOdds(@Param() params: EventIdParamDto): Promise<EventHeatOddsResponse> {
    const [eventOdds, clientEventOdds] = await Promise.all([
      this.oddsService.fetchHeatOdds(params.eventId),
      this.oddsService.fetchClientHeatOdds(params.eventId),
    ]);

    const roundObj: {
      [key: string]: EventHeatOdds;
    } = {};

    eventOdds.forEach((eventOdd) => {
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
        };
      }

      // find heat where the id matches
      const heat = roundObj[eventOdd.heat.round.id].heats.find(
        (heatItem) => heatItem.id === eventOdd.heat.id,
      );

      if (!heat) {
        const clientOdd = clientEventOdds.find(
          (clientEOdd) => clientEOdd.roundHeatId === eventOdd.heat.id,
        );

        roundObj[eventOdd.heat.round.id].heats.push({
          id: eventOdd.heat.id,
          name: `${eventOdd.heat.heatName} ${eventOdd.heat.heatNo}`,
          heatNo: +eventOdd.heat.heatNo,
          isHeatWinnerMarketVoided: eventOdd.heat.isHeatWinnerMarketVoided,
          isHeatWinnerMarketOpen: eventOdd.heat.isHeatWinnerMarketOpen,
          heatWinnerAthleteId: eventOdd.heat.winnerAthleteId,
          heatStatus: eventOdd.heat.heatStatus,
          clientUpdatedAtDate: clientOdd?.updatedAt || null,
          traderUpdatedAtDate: eventOdd.updatedAt,
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
      } else {
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

    return {
      odds: parsedData,
    };
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
    name: "eventId",
    description: "Id of the event.",
  })
  @ApiParam({
    name: "heatId",
    description: "Id of the heat.",
  })
  @Put(":eventId/heats/:heatId/odds/void")
  async updateHeatVoided(@Param() params: UpdateHeatVoidedParams): Promise<boolean> {
    const result = await this.oddsService.updateRoundHeatVoid(params.eventId, params.heatId);

    this.cacheManager.reset();

    return result;
  }

  @ApiBody({ type: UpdateEventOddDto })
  @ApiResponse({
    type: Boolean,
    status: 200,
  })
  @ApiOperation({
    summary: "Update event odds",
    description: "Update event odds",
  })
  @ApiParam({
    name: "eventId",
    description: "Id of the event.",
  })
  @Put(":eventId/odds")
  async updateProjectionEventOutcome(
    @Body() payload: UpdateEventOddDto,
    @Param() params: EventIdParamDto,
  ): Promise<boolean> {
    const result = await this.oddsService.updateEventOdd(payload, params.eventId);

    this.cacheManager.reset();

    return result;
  }

  @ApiBody({ type: UpdateEventHeatOddDto })
  @ApiResponse({
    type: Boolean,
    status: 200,
  })
  @ApiOperation({
    summary: "Update Heat Odds",
    description: "Update Heat Odds",
  })
  @ApiParam({
    name: "eventId",
    description: "Id of the event.",
  })
  @Put(":eventId/heat/odds")
  async updateProjectionEventHeatOutcome(
    @Body() payload: UpdateEventHeatOddDto,
    @Param() params: EventIdParamDto,
  ): Promise<boolean> {
    const result = await this.oddsService.updateEventHeatOdd(payload, params.eventId);

    this.cacheManager.reset();

    return result;
  }

  @ApiBody({ type: createPlayerHeadToHeadsDto })
  @ApiResponse({
    type: Boolean,
    status: 200,
  })
  @ApiOperation({
    summary: "Create head to head matchup",
    description: "Create head to head matchup",
  })
  @ApiParam({
    name: "eventId",
    description: "Id of the event.",
  })
  @Post(":eventId/headToHead/odds")
  async createPlayerHeadToHeads(
    @Param() params: EventIdParamDto,
    @Body() payload: createPlayerHeadToHeadsDto,
  ): Promise<boolean> {
    const result = await this.oddsService.createPlayerHeadToHeads(params.eventId, payload);

    await this.queueService.notifyEventUpdate({
      eventId: params.eventId,
      delaySeconds: 5,
      sportType: SportsTypes.FDRIFT,
      triggerType: OddMarkets.HEAD_TO_HEAD_PROJECTIONS,
      triggerIds: [result.id],
    });

    this.cacheManager.reset();

    return result !== null;
  }

  @ApiBody({ type: updatePlayerHeadToHeadsPayoutDto })
  @ApiResponse({
    type: Boolean,
    status: 200,
  })
  @ApiOperation({
    summary: "Update head to head payout details",
    description: "Update head to head payout details",
  })
  @ApiParam({
    name: "eventId",
    description: "Id of the event.",
  })
  @Put(":eventId/headToHead/odds/payout")
  async updatePlayerHeadToHeadsPayout(
    @Param() params: EventIdParamDto,
    @Body() payload: updatePlayerHeadToHeadsPayoutDto,
  ): Promise<boolean> {
    const isInvalid = payload.items.some((item) => {
      let count = 0;
      if (item?.eventParticipantWinnerId !== undefined) count++;
      if (item?.draw !== undefined) count++;
      if (item?.voided !== undefined) count++;

      if (count !== 1) return true;
    });
    if (isInvalid) throw headToHeadExceptions.voidAndWinnerRequest;

    const result = await this.oddsService.updatePlayerHeadToHeadsPayout(params.eventId, payload);

    this.cacheManager.reset();

    return result;
  }

  @ApiBody({ type: updatePlayerHeadToHeadsDto })
  @ApiResponse({
    type: Boolean,
    status: 200,
  })
  @ApiOperation({
    summary: "Update head to head matchup details",
    description: "Update head to head matchup details",
  })
  @ApiParam({
    name: "eventId",
    description: "Id of the event.",
  })
  @Put(":eventId/headToHead/odds")
  async updatePlayerHeadToHeads(
    @Param() params: EventIdParamDto,
    @Body() payload: updatePlayerHeadToHeadsDto,
  ): Promise<boolean> {
    await this.oddsService.updatePlayerHeadToHeads(params.eventId, payload);

    this.cacheManager.reset();

    return true;
  }

  @ApiResponse({
    description: "Success",
    type: PlayerHeadToHeadsPageListingResponse,
    status: 200,
    isArray: true,
  })
  @ApiOperation({
    summary: "Get head to head matches",
    description: "Get head to head matches",
  })
  @ApiParam({
    name: "eventId",
    description: "Id of the event.",
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
  ): Promise<PlayerHeadToHeadsPageListingResponse> {
    const [result, clientResult, lastUpdatedPlayerHeadToHead] = await Promise.all([
      this.oddsService.fetchPlayerHeadToHeadsPagination(
        params.eventId,
        queryParams.page,
        queryParams.query,
        queryParams.sortColumn,
        queryParams.sortOrder,
      ),
      this.oddsService.fetchClientPlayerHeadToHeadPage(params.eventId, queryParams.query),
      this.oddsService.getLastUpdatedPlayerHeadToHeadPage(params.eventId, queryParams.query),
    ]);

    return {
      clientUpdatedAtDate: clientResult?.updatedAt || null,
      traderUpdatedAtDate: lastUpdatedPlayerHeadToHead?.updatedAt || null,
      odds: result.data,
      total: result.total,
      page: result.page,
    };
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
    description: "Id of the event.",
  })
  @Get(":eventId/headToHead/odds")
  async fetchPlayerHeadToHeads(
    @Param() params: EventIdParamDto,
  ): Promise<PlayerHeadToHeadsResponse> {
    const [result, clientResult, lastUpdatedPlayerHeadToHead] = await Promise.all([
      this.oddsService.fetchPlayerHeadToHeads(params.eventId),
      this.oddsService.fetchClientPlayerHeadToHead(params.eventId),
      this.oddsService.getLastUpdatedPlayerHeadToHead(params.eventId),
    ]);

    const parsedResult = result.map((row) => {
      return {
        id: row.id,
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
        winnerParticipantId: row.eventParticipantWinnerId,
      };
    });

    return {
      clientUpdatedAtDate: clientResult?.updatedAt || null,
      traderUpdatedAtDate: lastUpdatedPlayerHeadToHead?.updatedAt || null,
      odds: parsedResult,
    };
  }
}

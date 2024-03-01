import { Controller, Get, Param, Put, Post, Body, UseGuards, Sse, Inject } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { fromEvent } from "rxjs";
import { EventEmitter2 } from "@nestjs/event-emitter";
import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
} from "@nestjs/swagger";

import { OddMarkets, SportsTypes } from "../../../../constants/system";

import { EventIdParamDto } from "./dto/params.dto";
import {
  createPlayerHeadToHeadsDto,
  updatePlayerHeadToHeadsDto,
  updatePlayerHeadToHeadsPayoutDto,
} from "../odds/dto/playerHeadToHeads.dto";

import { OddsService } from "./odds.service";

import PlayerHeadToHeadsResponse from "./schemas/response/playerHeadToHeads.response";

import QueueService from "../../../system/queue/queue.service";

import * as headToHeadExceptions from "../../../../exceptions/playerHeadToHeads";

import ApiGuard from "../../../../guards/adminApi.guard";

@ApiBearerAuth()
@UseGuards(ApiGuard)
@ApiTags("odds")
@Controller({
  path: `admin/${SportsTypes.MXGP}/events`,
})
export class OddsController {
  constructor(
    private eventEmitter: EventEmitter2,
    @Inject(CACHE_MANAGER) protected readonly cacheManager,
    private readonly oddsService: OddsService,
    private readonly queueService: QueueService,
  ) {}

  @Sse("odds/sse")
  sse() {
    return fromEvent(this.eventEmitter, `${SportsTypes.MXGP}OddEvent`);
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
      sportType: SportsTypes.MXGP,
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

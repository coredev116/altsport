import { Controller, Get, Param, UseGuards, Query } from "@nestjs/common";
import OddsService from "./odds.service";
import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiSecurity,
} from "@nestjs/swagger";

// import { IEventOdds, IEventHeatOdds } from "../../../../interfaces/odds";

import EventShowsResponse from "./schemas/response/eventShows.response";
import EventPodiumsResponse from "./schemas/response/eventPodiums.response";
import EventOddsResponse from "./schemas/response/eventOdds.response";

import { SportsTypes } from "../../../../constants/system";

import PlayerHeadToHeadsListingRes from "./schemas/response/playerHeadToHeads.response";
import PropBetsListingRes from "./schemas/response/propBets.response";

import { EventIdParamDto } from "./dto/params.dto";

import ApiGuard from "../../../../guards/publicApi.guard";
import { PUBLIC_API_KEY_HEADER } from "../../../../constants/auth";

@ApiSecurity(PUBLIC_API_KEY_HEADER)
@ApiTags("Odds")
@Controller({
  path: `${SportsTypes.SKATEBOARDING}/odds`,
})
export default class OddsController {
  constructor(private readonly oddsService: OddsService) {}

  // @Get("events/:eventId/heat/winner")
  // @ApiOperation({
  //   description: "Returns heat winners",
  //   summary: "Heat winners odds",
  // })
  // @ApiHeader({
  //   name: PUBLIC_API_KEY_HEADER,
  //   description: "API Key",
  //   example: "9mRnwDdKchfgCSPalLFRwB2v6e2MFkbO",
  //   required: true,
  // })
  // @ApiParam({
  //   name: "eventId",
  //   description: "The id of the event for which the winner should be returned.",
  // })
  // @ApiResponse({
  //   type: EventHeatOddsResponse,
  //   status: 200,
  //   isArray: true,
  // })
  // @Get()
  // @UseGuards(ApiGuard)
  // async fetchHeatOdds(@Param("eventId") eventId: string) {
  //   const eventOdds = await this.oddsService.fetchHeatWinnerOdds(eventId);

  //   return eventOdds.map((eventOdd) => ({
  //     id: eventOdd.id,
  //     odds: eventOdd.odds,
  //     position: eventOdd.position,
  //     probability: eventOdd.probability,
  //     athlete: {
  //       id: eventOdd.participant.athlete.id,
  //       firstName: eventOdd.participant.athlete.firstName,
  //       middleName: eventOdd.participant.athlete.middleName,
  //       lastName: eventOdd.participant.athlete.lastName,
  //       nationality: eventOdd.participant.athlete.nationality,
  //       stance: eventOdd.participant.athlete.stance,
  //       seedNo: eventOdd.participant.seedNo,
  //     },
  //     heat: {
  //       id: eventOdd.heat.id,
  //       heatNo: eventOdd.heat.heatNo,
  //       heatName: eventOdd.heat.heatName,
  //       heatStatus: HeatStatus[eventOdd.heat.heatStatus],
  //       round: {
  //         id: eventOdd.heat.round.id,
  //         roundNo: eventOdd.heat.round.roundNo,
  //         name: eventOdd.heat.round.name,
  //       },
  //     },
  //   }));
  // }

  @Get("events/:eventId")
  @ApiOperation({
    description: "List odds for event winner or second place",
    summary: "Event Odds Listing",
  })
  @ApiParam({
    name: "eventId",
    description: "The id of the event for which the odds should be returned.",
  })
  @ApiQuery({
    name: "position",
    description: "Position of the athlete",
  })
  @ApiResponse({
    type: EventOddsResponse,
    status: 200,
    isArray: true,
  })
  @Get()
  @UseGuards(ApiGuard)
  async fetchEventodds(
    @Param() params: EventIdParamDto,
    @Query("position") position: number,
  ): Promise<EventOddsResponse[]> {
    const eventOdds = await this.oddsService.fetchEventOdds(params.eventId, position);

    return eventOdds.map((eventOdd) => ({
      id: eventOdd.id,
      odds: +Number(eventOdd.odds).toFixed(2),
      position: +eventOdd.position,
      probability: +Number(eventOdd.probability).toFixed(2),
      athlete: {
        id: eventOdd.participant.athlete.id,
        firstName: eventOdd.participant.athlete.firstName,
        middleName: eventOdd.participant.athlete.middleName,
        lastName: eventOdd.participant.athlete.lastName,
        nationality: eventOdd.participant.athlete.nationality,
        stance: eventOdd.participant.athlete.stance,
        seedNo: +eventOdd.participant.seedNo,
      },
    }));
  }

  @Get("events/:eventId/shows")
  @ApiOperation({
    description: "List event show odds",
    summary: "Event Show Odds Listing",
  })
  @ApiParam({
    name: "eventId",
    description: "The id of the event for which the odds should be returned.",
  })
  @ApiResponse({
    type: EventShowsResponse,
    status: 200,
    isArray: true,
  })
  @Get()
  @UseGuards(ApiGuard)
  async fetchEventShows(@Param() params: EventIdParamDto): Promise<EventShowsResponse[]> {
    const eventOdds = await this.oddsService.fetchEventShows(params.eventId);

    return eventOdds.map((eventOdd) => ({
      id: eventOdd.id,
      odds: +Number(eventOdd.odds).toFixed(2),
      probability: +Number(eventOdd.probability).toFixed(2),
      athlete: {
        id: eventOdd.participant.athlete.id,
        firstName: eventOdd.participant.athlete.firstName,
        middleName: eventOdd.participant.athlete.middleName,
        lastName: eventOdd.participant.athlete.lastName,
        nationality: eventOdd.participant.athlete.nationality,
        stance: eventOdd.participant.athlete.stance,
        seedNo: +eventOdd.participant.seedNo,
      },
    }));
  }

  @Get("events/:eventId/podiums")
  @ApiOperation({
    description: "List event podium odds",
    summary: "Event Podium Odds Listing",
  })
  @ApiParam({
    name: "eventId",
    description: "The id of the event for which the odds should be returned.",
  })
  @ApiResponse({
    type: EventPodiumsResponse,
    status: 200,
    isArray: true,
  })
  @Get()
  @UseGuards(ApiGuard)
  async fetchEventPodiums(@Param() params: EventIdParamDto): Promise<EventPodiumsResponse[]> {
    const eventOdds = await this.oddsService.fetchEventPodiums(params.eventId);

    return eventOdds.map((eventOdd) => ({
      id: eventOdd.id,
      odds: +Number(eventOdd.odds).toFixed(2),
      probability: +Number(eventOdd.probability).toFixed(2),
      athlete: {
        id: eventOdd.participant.athlete.id,
        firstName: eventOdd.participant.athlete.firstName,
        middleName: eventOdd.participant.athlete.middleName,
        lastName: eventOdd.participant.athlete.lastName,
        nationality: eventOdd.participant.athlete.nationality,
        stance: eventOdd.participant.athlete.stance,
        seedNo: +eventOdd.participant.seedNo,
      },
    }));
  }

  @ApiOperation({
    description: "List all head to head matchups for the event",
    summary: "List head to heads",
  })
  @ApiParam({
    name: "eventId",
    description: "The id of the event for which the odds should be returned.",
  })
  @ApiResponse({
    description: "Success",
    status: 200,
    type: PlayerHeadToHeadsListingRes,
    isArray: true,
  })
  @Get("events/:eventId/headToHead")
  @UseGuards(ApiGuard)
  public async fetchPlayerHeadToHeads(
    @Param() params: EventIdParamDto,
  ): Promise<PlayerHeadToHeadsListingRes[]> {
    const result = await this.oddsService.fetchPlayerHeadToHeads(params.eventId);

    const parsedResult = result.map((row) => {
      return {
        eventId: row.eventId,
        voided: row.voided,
        draw: row.draw,
        payout: row.eventParticipantWinnerId !== null,
        eventParticipant1: {
          id: row.eventParticipant1.id,
          position: +row.player1Position,
          odds: +Number(row.player1Odds).toFixed(2),
          probability: +Number(row.player1Probability).toFixed(2),
          athlete: {
            id: row.eventParticipant1.athlete.id,
            firstName: row.eventParticipant1.athlete.firstName,
            middleName: row.eventParticipant1.athlete.middleName,
            lastName: row.eventParticipant1.athlete.lastName,
            nationality: row.eventParticipant1.athlete.nationality,
            stance: row.eventParticipant1.athlete.stance,
            seedNo: +row.eventParticipant1.seedNo,
          },
        },
        eventParticipant2: {
          id: row.eventParticipant2.id,
          position: +row.player2Position,
          odds: +Number(row.player2Odds).toFixed(2),
          probability: +Number(row.player2Probability).toFixed(2),
          athlete: {
            id: row.eventParticipant2.athlete.id,
            firstName: row.eventParticipant2.athlete.firstName,
            middleName: row.eventParticipant2.athlete.middleName,
            lastName: row.eventParticipant2.athlete.lastName,
            nationality: row.eventParticipant2.athlete.nationality,
            stance: row.eventParticipant2.athlete.stance,
            seedNo: +row.eventParticipant2.seedNo,
          },
        },
        winnerParticipantId: row.eventParticipantWinnerId,
      };
    });

    return parsedResult;
  }

  @ApiOperation({
    description: "List all prop Bets for an event",
    summary: "Prop bets",
  })
  @ApiParam({
    name: "eventId",
    description: "The id of the event for which the prop bets should be returned.",
  })
  @ApiResponse({
    description: "Success",
    status: 200,
    type: PropBetsListingRes,
    isArray: true,
  })
  @Get("events/:eventId/propBets")
  @UseGuards(ApiGuard)
  public async fetchPropBets(@Param() params: EventIdParamDto): Promise<PropBetsListingRes[]> {
    const result = await this.oddsService.fetchPropBets(params.eventId);

    const parsedResult = result.map((row) => {
      return {
        id: row.id,
        proposition: row.proposition,
        voided: row.voided,
        payout: row.payout,
        odds: +Number(row.odds).toFixed(2),
        probability: +Number(row.probability).toFixed(2),
        athlete: {
          id: row.eventParticipant.athlete.id,
          firstName: row.eventParticipant.athlete.firstName,
          middleName: row.eventParticipant.athlete.middleName,
          lastName: row.eventParticipant.athlete.lastName,
          nationality: row.eventParticipant.athlete.nationality,
          stance: row.eventParticipant.athlete.stance,
          seedNo: +row.eventParticipant.seedNo,
        },
      };
    });

    return parsedResult;
  }
}

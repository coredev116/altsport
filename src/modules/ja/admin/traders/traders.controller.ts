import { Controller, Param, Get, UseGuards, Inject, Put, Body } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import {
  ApiResponse,
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from "@nestjs/swagger";
import { parse, format, startOfDay, endOfDay, differenceInDays } from "date-fns";
import { v4 } from "uuid";

import JAEventsResponse, { SummaryMatches } from "./schemas/responses/events.response";
import { OddsResponse, EventOddsResponse } from "./schemas/responses/odds.response";

import { EventIdParamDto } from "./dto/params.dto";
import { UpdateOddsDto } from "./dto/odds.dto";
import OddGoLiveDto from "./dto/oddGoLive.dto";

import * as eventExceptions from "../../../../exceptions/events";

import { SportsTypes, EventStatus } from "../../../../constants/system";

import ApiGuard from "../../../../guards/adminApi.guard";

import TraderService from "./traders.service";

@ApiBearerAuth()
@UseGuards(ApiGuard)
@ApiTags("traders")
@Controller({
  path: `admin/${SportsTypes.JA}/traders`,
})
export default class TraderController {
  constructor(
    private readonly traderService: TraderService,
    @Inject(CACHE_MANAGER) protected readonly cacheManager,
  ) {}

  @ApiResponse({
    description: "Success",
    type: OddsResponse,
    isArray: true,
    status: 200,
  })
  @ApiOperation({
    description: "Get the odds for an event",
  })
  @ApiParam({
    name: "eventId",
    description: "Id of the event",
  })
  @Get(":eventId/odds")
  async fetchOdds(@Param("eventId") eventId: string): Promise<EventOddsResponse> {
    const clientEventOdd = await this.traderService.fetchClientEventOdd(eventId);
    const { odds, eventRounds } = await this.traderService.fetchOdds(eventId);

    const responseOdds = odds.map((d) => {
      const round = eventRounds.find((eR) => eR.id === d.eventRoundId);
      return {
        id: d.id,
        eventId: d.eventId,
        providerMatchId: d.event.providerId,
        eventMatchType: d.event.eventType,
        valueType: d.type,
        marketType: d.marketType,
        subMarketType: d.subMarketType,
        betType: d.betType,
        odds: +Number(d.odds).toFixed(2),
        probability: +Number(d.probability).toFixed(2),
        trueProbability: +Number(d.trueProbability).toFixed(2),
        hasModifiedProbability: d.hasModifiedProbability,
        weights: d.weights,
        calculatedValue: +Number(d.calculatedValue).toFixed(2),
        max: d.max,
        lean: d.lean,
        playerLean: d.playerLean,
        bias: d.bias,
        prop: d.prop,
        isMarketActive: d.isMarketActive,
        isSubMarketLocked: d.isSubMarketLocked,
        round: {
          id: round?.id || null,
          providerRoundId: round?.providerId || null,
          name: round?.round || null,
          eventNumber: round?.event?.eventNumber || null,
        },
        team: {
          id: d.eventTeam.team.id,
          name: d.eventTeam.team.name,
          isHomeTeam: d.eventTeam.isHomeTeam,
          athlete1: d.eventTeam.athlete1
            ? {
                id: d.eventTeam.athlete1.id,
                providerAthleteId: d.eventTeam.athlete1.providerId,
                firstName: d.eventTeam.athlete1.firstName,
              }
            : {
                id: v4(),
                firstName: "Player 1",
                providerAthleteId: "9999",
              },
          athlete2: d.eventTeam.athlete2
            ? {
                id: d.eventTeam.athlete2.id,
                providerAthleteId: d.eventTeam.athlete2.providerId,
                firstName: d.eventTeam.athlete2.firstName,
              }
            : null,
        },
      };
    });

    return {
      clientUpdatedAtDate: clientEventOdd?.updatedAt || null,
      traderUpdatedAtDate: odds[0]?.updatedAt || null,
      odds: responseOdds,
    };
  }

  @ApiResponse({
    description: "Success",
    type: JAEventsResponse,
    status: 200,
  })
  @ApiOperation({
    description: "Get the scores for the matches of the day",
  })
  @ApiParam({
    name: "gameDateId",
    example: "01-22-2023",
  })
  @Get("scores/games/:gameDateId")
  async fetchHeatScore(@Param("gameDateId") gameDateId: string): Promise<JAEventsResponse> {
    const result = await this.traderService.fetchHeatScore(gameDateId);
    if (!result) throw eventExceptions.eventNotFound();

    const isPartialEvent: boolean = result.events.length === 1;

    const parsedDate: Date = parse(gameDateId, "MM-dd-yyyy", new Date());
    const now: Date = new Date();
    const matches: SummaryMatches[] = [];
    let dayStatus: EventStatus;
    let tourName: string;
    let tourYear: number;
    let homeTeamFinalScore = 0;
    let awayTeamFinalScore = 0;
    let statusText = "";

    // check to see if at least one event is live, in that case the day is marked as live
    const isLive = result.events.some((row) => row.eventStatus === EventStatus.LIVE);
    if (isLive) dayStatus = EventStatus.LIVE;
    else {
      const difference = differenceInDays(parsedDate, now);
      dayStatus = difference < 0 ? EventStatus.COMPLETED : EventStatus.UPCOMING;
    }

    const parsedEvents = result.events.map(({ teams, ...params }) => {
      const { rounds = [] } = params;

      tourName = params.tourYear.tour.name;
      tourYear = params.tourYear.year;

      const homeTeam = teams.find((teamRow) => teamRow.isHomeTeam);
      const awayTeam = teams.find((teamRow) => !teamRow.isHomeTeam);

      let lastRound: number = 1;
      const matchSummary: SummaryMatches = {
        providerMatchId: params.providerId,
        matchType: params.eventType || "S",
        homeTeam: homeTeam?.athlete2?.firstName
          ? `${homeTeam.athlete1.firstName} & ${homeTeam.athlete2.firstName}`
          : homeTeam?.athlete1?.firstName || "Player 1",
        awayTeam: awayTeam?.athlete2?.firstName
          ? `${awayTeam.athlete1.firstName} & ${awayTeam.athlete2.firstName}`
          : awayTeam?.athlete1?.firstName || "Player 2",

        homeTeamProviderAthlete1Id: homeTeam.athlete1?.providerId || "",
        homeTeamProviderAthlete2Id: homeTeam.athlete2?.providerId || "",
        awayTeamProviderAthlete1Id: awayTeam.athlete1?.providerId || "",
        awayTeamProviderAthlete2Id: awayTeam.athlete2?.providerId || "",

        homeTeamName:
          homeTeam.team.name.charAt(0).toUpperCase() + homeTeam.team.name.slice(1).toLowerCase(),
        awayTeamName:
          awayTeam.team.name.charAt(0).toUpperCase() + awayTeam.team.name.slice(1).toLowerCase(),
        homeTeamGoals: 0,
        awayTeamGoals: 0,
        homeTeamPoints: 0,
        awayTeamPoints: 0,
        startDate: params.startDate,
        statusText: "",
        status: params.eventStatus,
        lastRound,
      };

      rounds.forEach(({ scores = [] }) => {
        if (scores[0]?.score > scores[1]?.score) {
          if (homeTeam.team.id === scores[0].teamId) matchSummary.homeTeamGoals += 1;
          else matchSummary.awayTeamGoals += 1;
        }
        if (scores[1]?.score > scores[0]?.score) {
          if (homeTeam.team.id === scores[1].teamId) matchSummary.homeTeamGoals += 1;
          else matchSummary.awayTeamGoals += 1;
        }

        if (lastRound < Number(scores[0]?.eventRound.round)) {
          lastRound = Number(scores[0].eventRound.round);
        }
      });

      matchSummary.lastRound = lastRound;

      const isHomeTeamWinner = params.winnerTeamId
        ? homeTeam.team.id === params.winnerTeamId
        : matchSummary.homeTeamGoals > matchSummary.awayTeamGoals;

      const isAwayTeamWinner = params.winnerTeamId
        ? awayTeam.team.id === params.winnerTeamId
        : matchSummary.awayTeamGoals > matchSummary.homeTeamGoals;

      // if (matchSummary.homeTeamGoals > matchSummary.awayTeamGoals) {
      if (isHomeTeamWinner) {
        if (matchSummary.matchType === "S") {
          homeTeamFinalScore++;
          matchSummary.homeTeamPoints = 1;
        } else {
          homeTeamFinalScore = homeTeamFinalScore + 1.5;
          matchSummary.homeTeamPoints = 1.5;
        }
      }
      // if (matchSummary.awayTeamGoals > matchSummary.homeTeamGoals) {
      if (isAwayTeamWinner) {
        if (matchSummary.matchType === "S") {
          awayTeamFinalScore++;
          matchSummary.awayTeamPoints = 1;
        } else {
          awayTeamFinalScore = awayTeamFinalScore + 1.5;
          matchSummary.awayTeamPoints = 1.5;
        }
      }

      matches.push(matchSummary);

      if (matchSummary.status === EventStatus.LIVE) {
        statusText = `Live - Set ${matchSummary.lastRound}`;
      } else if (matchSummary.status === EventStatus.UPCOMING) {
        statusText = `Upcoming`;
      } else if (matchSummary.status === EventStatus.COMPLETED) {
        if (homeTeamFinalScore === awayTeamFinalScore) {
          statusText = `${matchSummary.homeTeamName} level ${homeTeamFinalScore.toFixed(
            1,
          )} - ${awayTeamFinalScore.toFixed(1)}`;
        } else if (homeTeamFinalScore > awayTeamFinalScore) {
          statusText = `${matchSummary.homeTeamName} leads ${homeTeamFinalScore.toFixed(
            1,
          )} - ${awayTeamFinalScore.toFixed(1)}`;
        } else {
          statusText = `${matchSummary.awayTeamName} leads ${awayTeamFinalScore.toFixed(
            1,
          )} - ${homeTeamFinalScore.toFixed(1)}`;
        }
      }

      let homeTeamMatchScore = 0;
      let awayTeamMatchScore = 0;
      // calculatet the score per match
      params.rounds?.forEach((roundRow) => {
        const homeTeamMatchScoreRow = roundRow.scores.find(
          (scoreRow) => scoreRow.teamId === homeTeam.team.id,
        );
        const awayTeamMatchScoreRow = roundRow.scores.find(
          (scoreRow) => scoreRow.teamId === awayTeam.team.id,
        );

        if (homeTeamMatchScoreRow?.score > awayTeamMatchScoreRow?.score) homeTeamMatchScore++;
        else if (awayTeamMatchScoreRow?.score > homeTeamMatchScoreRow?.score) awayTeamMatchScore++;
      });

      return {
        ...params,
        providerMatchId: params.providerId,
        statusText,
        homeTeam: matchSummary.homeTeam,
        awayTeam: matchSummary.awayTeam,
        homeTeamFinalScore: 0,
        awayTeamFinalScore: 0,
        homeTeamMatchScore,
        awayTeamMatchScore,
        rounds: params.rounds?.map((row) => {
          const { round, ...roundParams } = row;

          const updatedRound = {
            round,
          };

          // because BE does not store the Q
          if (updatedRound.round.length === 1) {
            updatedRound.round = `S${updatedRound.round}`;
          }

          return {
            ...roundParams,
            providerRoundId: row.providerId,
            name: updatedRound.round,
          };
        }) || [
          {
            id: v4(),
            startDate: null,
            endDate: null,
            roundStatus: 2,
            providerId: "9999",
            scores: [],
            providerRoundId: "9999",
            name: "S1",
          },
        ],
        teams: teams.map((team) => ({
          id: team.team.id,
          shortName: team.team.shortName,
          name: team.team.name,
          logo: team.team.logo,
          isHomeTeam: team.isHomeTeam,
        })),
      };
    });

    parsedEvents.forEach((event) => {
      event.homeTeamFinalScore = homeTeamFinalScore;
      event.awayTeamFinalScore = awayTeamFinalScore;
    });

    // const parsedRounds = result.rounds.map((item) => ({
    //   ...item,
    //   name: item.round.length === 1 ? `Q${item.round}` : item.round,
    // }));

    return {
      id: gameDateId,
      summary: {
        defaultMatchId: isPartialEvent ? parsedEvents[0].id : null,
        dayStatus,
        name: `World Jai Alai ${format(parsedDate, "LLLL d, yyyy")} (1 game)`,
        startDate: startOfDay(parsedDate),
        endDate: endOfDay(parsedDate),
        tourName,
        year: tourYear,
        matches: !isPartialEvent ? matches : [],
      },
      events: !isPartialEvent ? parsedEvents : [],
    };
  }

  @ApiBody({ type: UpdateOddsDto })
  @ApiResponse({
    type: Boolean,
    status: 200,
  })
  @ApiOperation({
    summary: "Update odds",
    description: "Update odds",
  })
  @ApiParam({
    name: "eventId",
    description: "Id of the event.",
  })
  @Put(":eventId/odds")
  async updateOdds(
    @Body() payload: UpdateOddsDto,
    @Param() params: EventIdParamDto,
  ): Promise<boolean> {
    const result = await this.traderService.updateOdds(payload, params.eventId);

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
    description: "The id of the event.",
  })
  @Put("events/:eventId/odds/public")
  async oddsGoLive(
    @Body() payload: OddGoLiveDto,
    @Param() params: EventIdParamDto,
  ): Promise<boolean> {
    const result = await this.traderService.oddsGoLive(params.eventId, payload.projectionType);

    this.cacheManager.reset();

    return result;
  }
}

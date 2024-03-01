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
import { parse, format, isBefore, startOfDay, endOfDay } from "date-fns";

import {
  MASLEventsResponse,
  MASLEventsResponseLegacy,
  SummaryMatches,
  SummaryMatchesLegacy,
  Event,
  EventRounds,
} from "./schemas/responses/events.response";
import { OddsResponse } from "./schemas/responses/odds.response";

// import TraderScoresDto from "./dto/traderScores.dto";
import { UpdateOddsDto } from "./dto/odds.dto";

import * as eventExceptions from "../../../../exceptions/events";

import { SportsTypes, EventStatus } from "../../../../constants/system";

import ApiGuard from "../../../../guards/adminApi.guard";

import TraderService from "./traders.service";

@ApiBearerAuth()
@UseGuards(ApiGuard)
@ApiTags("traders")
@Controller({
  path: `admin/${SportsTypes.MASL}/traders`,
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
  async fetchOdds(@Param("eventId") eventId: string): Promise<OddsResponse[]> {
    const { odds, eventRounds } = await this.traderService.fetchOdds(eventId);
    return odds.map((d) => {
      const round = eventRounds.find((eR) => eR.id === d.eventRoundId);
      return {
        id: d.id,
        eventId: d.eventId,
        providerMatchId: d.event.providerGameId,
        valueType: d.type,
        marketType: d.marketType,
        subMarketType: d.subMarketType,
        betType: d.betType,
        odds: +Number(d.odds).toFixed(2),
        probability: +Number(d.probability).toFixed(2),
        trueProbability: +Number(d.trueProbability).toFixed(2),
        hasModifiedProbability: d.hasModifiedProbability,
        calculatedValue: +Number(d.calculatedValue).toFixed(2),
        max: d.max,
        lean: d.lean,
        playerLean: d.playerLean,
        bias: d.bias,
        isMarketActive: d.isMarketActive,
        isSubMarketLocked: d.isSubMarketLocked,
        round: {
          id: round?.id || null,
          providerRoundId: null,
          name: round?.round?.name || null,
          eventNumber: null,
        },
        team: {
          id: d.eventTeam.team.id,
          name: d.eventTeam.team.name,
          isHomeTeam: d.eventTeam.isHomeTeam,
        },
      };
    });
  }

  @ApiResponse({
    description: "Success",
    type: MASLEventsResponseLegacy,
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
  async fetchHeatScore(@Param("gameDateId") gameDateId: string): Promise<MASLEventsResponseLegacy> {
    const result = await this.traderService.fetchHeatScore(gameDateId);
    if (!result) throw eventExceptions.eventNotFound();

    const parsedDate: Date = parse(gameDateId, "MM-dd-yyyy", new Date());
    const now: Date = new Date();
    const matches: SummaryMatchesLegacy[] = [];
    let dayStatus: EventStatus;
    let tourName: string;
    let tourYear: number;

    // check to see if at least one event is live, in that case the day is marked as live
    const isLive = result.events.some((row) => row.eventStatus === EventStatus.LIVE);
    if (isLive) dayStatus = EventStatus.LIVE;
    else {
      const isDateBefore = isBefore(parsedDate, now);
      dayStatus = isDateBefore ? EventStatus.COMPLETED : EventStatus.UPCOMING;
    }

    const parsedEvents = result.events.map(({ teams, ...params }) => {
      const { eventRounds = [] } = params;

      tourName = params.leagueYear.league.name;
      tourYear = params.leagueYear.year;

      const homeTeam = teams.find((teamRow) => teamRow.isHomeTeam).team;
      const awayTeam = teams.find((teamRow) => !teamRow.isHomeTeam).team;

      const matchSummary: SummaryMatchesLegacy = {
        homeTeam: homeTeam.name,
        awayTeam: awayTeam.name,
        homeTeamGoals: 0,
        awayTeamGoals: 0,
        startDate: params.startDate,
        statusText: "",
      };

      let lastRoundName: string;
      eventRounds.forEach(({ round: { name, scores = [] } }) => {
        scores.forEach((score) => {
          if (homeTeam.id === score.teamId) matchSummary.homeTeamGoals += score.goals;
          else matchSummary.awayTeamGoals += score.goals;
        });

        lastRoundName = name;
      });

      if (lastRoundName.length === 1) lastRoundName = `Q${lastRoundName}`;

      // to decide the status text
      if (params.eventStatus === EventStatus.COMPLETED)
        matchSummary.statusText = `Completed - ${lastRoundName}`;
      else if (params.eventStatus === EventStatus.LIVE) {
        matchSummary.statusText = `Live - ${lastRoundName}`;
      } else if (params.eventStatus === EventStatus.UPCOMING) {
        matchSummary.statusText = `Upcoming`;
      }

      matches.push(matchSummary);

      return {
        ...params,
        eventRounds: params.eventRounds.map((row) => {
          const { round, ...roundParams } = row;

          const updatedRound = {
            ...round,
          };

          // because BE does not store the Q
          if (updatedRound.name.length === 1) {
            updatedRound.name = `Q${updatedRound.name}`;
          }

          return {
            ...roundParams,
            round: updatedRound,
          };
        }),
        teams: teams.map((team) => ({
          id: team.team.id,
          shortName: team.team.shortName,
          name: team.team.name,
          logo: team.team.logo,
          isHomeTeam: team.isHomeTeam,
        })),
      };
    });

    const parsedRounds = result.rounds.map((item) => ({
      ...item,
      name: item.name.length === 1 ? `Q${item.name}` : item.name,
    }));

    return {
      summary: {
        dayStatus,
        name: `${SportsTypes.MASL.toUpperCase()} ${format(parsedDate, "LLLL d,yyyy")} (${
          parsedEvents.length
        } matches)`,
        startDate: startOfDay(parsedDate),
        endDate: endOfDay(parsedDate),
        tourName,
        year: tourYear,
        matches,
      },
      rounds: parsedRounds,
      events: parsedEvents,
    };
  }

  // new API to fetch score

  @ApiResponse({
    description: "Success",
    type: MASLEventsResponse,
    status: 200,
  })
  @ApiOperation({
    description: "Get the heatscores for the matches of the day",
  })
  @ApiParam({
    name: "gameDateId",
    example: "01-22-2023",
  })
  @Get("scores/games/heatScore/:gameDateId")
  async getTheHeatScore(@Param("gameDateId") gameDateId: string): Promise<MASLEventsResponse> {
    const result = await this.traderService.getTheHeatScore(gameDateId);
    if (!result) throw eventExceptions.eventNotFound();

    const parsedDate: Date = parse(gameDateId, "MM-dd-yyyy", new Date());
    const now: Date = new Date();
    const matches: SummaryMatches[] = [];
    let dayStatus: EventStatus;
    let tourName: string;
    let tourYear: number;

    // check to see if at least one event is live, in that case the day is marked as live
    const isLive = result.events.some((row) => row.eventStatus === EventStatus.LIVE);
    if (isLive) dayStatus = EventStatus.LIVE;
    else {
      const isDateBefore = isBefore(parsedDate, now);
      dayStatus = isDateBefore ? EventStatus.COMPLETED : EventStatus.UPCOMING;
    }

    const parsedEvents: Event[] = result.events.map(
      ({ teams, leagueYear, rounds, ...params }, index) => {
        tourName = leagueYear.league.name;
        tourYear = leagueYear.year;

        const homeTeam = teams.find((teamRow) => teamRow.isHomeTeam).team;
        const awayTeam = teams.find((teamRow) => !teamRow.isHomeTeam).team;

        const matchSummary: SummaryMatches = {
          id: params.id,
          eventNumber: index + 1,
          homeTeamName: homeTeam.name,
          awayTeamName: awayTeam.name,
          homeTeamGoals: 0,
          awayTeamGoals: 0,
          startDate: params.startDate,
          endDate: params.endDate,
          statusText: "",
          providerMatchId: params.providerGameId,
          status: params.eventStatus,
        };

        let lastRoundName: string;
        rounds.forEach(({ round: { name, scores = [] } }) => {
          scores.forEach((score) => {
            if (homeTeam.id === score.teamId) matchSummary.homeTeamGoals += score.goals;
            else matchSummary.awayTeamGoals += score.goals;
          });

          lastRoundName = name;
        });

        if (lastRoundName.length === 1) lastRoundName = `Q${lastRoundName}`;

        // to decide the status text
        if (params.eventStatus === EventStatus.COMPLETED)
          matchSummary.statusText = `Completed - ${lastRoundName}`;
        else if (params.eventStatus === EventStatus.LIVE) {
          matchSummary.statusText = `Live - ${lastRoundName}`;
        } else if (params.eventStatus === EventStatus.UPCOMING) {
          matchSummary.statusText = `Upcoming`;
        }

        matches.push(matchSummary);

        return {
          ...params,
          eventNumber: index + 1,
          providerId: params.providerGameId,
          winnerTeamId: params.winnerTeamId,
          tourYear: {
            year: tourYear,
            tour: {
              name: tourName,
            },
          },
          rounds: rounds.map((row) => {
            const { round, ...eventRoundParams } = row;

            const parsedRound: EventRounds = {
              id: eventRoundParams.id,
              name: round.name.length === 1 ? `Q${round.name}` : round.name,
              roundNo: round.roundNo,
              startDate: eventRoundParams.startDate,
              endDate: eventRoundParams.endDate,
              roundStatus: eventRoundParams.roundStatus,
              scores: round.scores.map((scoreItem) => ({
                id: scoreItem.id,
                score: scoreItem.goals,
                teamId: scoreItem.teamId,
              })),
            };

            return parsedRound;
          }),
          statusText: matchSummary.statusText,
          homeTeam: matchSummary.homeTeamName,
          awayTeam: matchSummary.awayTeamName,
          homeTeamMatchScore: matchSummary.homeTeamGoals,
          awayTeamMatchScore: matchSummary.awayTeamGoals,

          teams: teams.map((team) => ({
            id: team.team.id,
            shortName: team.team.shortName,
            name: team.team.name,
            logo: team.team.logo,
            isHomeTeam: team.isHomeTeam,
          })),
        };
      },
    );

    const parsedRounds = result.rounds.map((item) => ({
      ...item,
      name: item.name.length === 1 ? `Q${item.name}` : item.name,
    }));

    return {
      id: gameDateId,
      summary: {
        dayStatus,
        name: `${SportsTypes.MASL.toUpperCase()} ${format(parsedDate, "LLLL d,yyyy")} (${
          parsedEvents.length
        } matches)`,
        startDate: startOfDay(parsedDate),
        endDate: endOfDay(parsedDate),
        tourName,
        year: tourYear,
        matches,
      },
      rounds: parsedRounds,
      events: parsedEvents,
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
    // @Param() params: EventIdParamDto,
  ): Promise<boolean> {
    const result = await this.traderService.updateOdds(payload);

    return result;
  }

  // @ApiBody({ type: TraderScoresDto })
  // @ApiResponse({
  //   description: "Success",
  //   type: Boolean,
  //   status: 200,
  // })
  // @ApiOperation({
  //   description: "Update goals or times for the event rounds",
  // })
  // @Post("scores")
  // async saveEventDetails(@Body() payload: TraderScoresDto): Promise<boolean> {
  //   const result = await this.traderService.saveEventDetails(payload);

  //   return result;
  // }
}

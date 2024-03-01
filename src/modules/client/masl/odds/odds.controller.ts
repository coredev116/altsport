import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth, ApiParam } from "@nestjs/swagger";
import { parse, format, startOfDay, endOfDay, isBefore } from "date-fns";

import { SportsTypes, EventStatus } from "../../../../constants/system";

import { OddsService } from "./odds.service";

import { EventIdParamDto } from "./dto/params.dto";

import EventOddsResponse from "./schemas/response/eventOdds.response";
import EventsResponse from "./schemas/response/event.response";
import {
  MASLEventsResponse,
  SummaryMatches,
  Event,
  EventRounds,
} from "./schemas/response/events.response";

import * as eventExceptions from "../../../../exceptions/events";

import ApiGuard from "../../../../guards/clientApi.guard";

@ApiBearerAuth()
@UseGuards(ApiGuard)
@ApiTags("Masl")
@Controller({
  path: `client/${SportsTypes.MASL}/events`,
})
export class OddsController {
  constructor(private readonly oddsService: OddsService) {}

  @ApiParam({
    name: "eventId",
    description: "The id of the event for which the data should be returned.",
  })
  @ApiOperation({
    description: "Returns the odds for a particular event.",
  })
  @ApiResponse({
    type: EventOddsResponse,
    status: 200,
    isArray: true,
  })
  @Get(":eventId/odds")
  async fetchEventodds(@Param() params: EventIdParamDto): Promise<EventOddsResponse[]> {
    const { odds, eventRounds } = await this.oddsService.fetchEventOdds(params.eventId);

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
    type: EventsResponse,
    status: 200,
  })
  @ApiParam({
    name: "eventId",
    description: "The id of the event for which the data should be returned.",
  })
  @Get(":eventId")
  async fetchEvent(@Param() params: EventIdParamDto): Promise<EventsResponse> {
    const event = await this.oddsService.fetchEvent(params.eventId);
    if (!event) throw eventExceptions.eventNotFound();

    return {
      id: event.id,
      name: event.name,
      sportType: SportsTypes.MASL,
      startDate: event.startDate,
      endDate: event.endDate,
      eventStatus: event.eventStatus,
      eventLocation: event.eventLocation,
      eventLocationGroup: event.eventLocationGroup,
      year: event.leagueYear.year,
      tour: {
        id: event.leagueYear.league.id,
        name: event.leagueYear.league.name,
        gender: event.leagueYear.league.gender,
      },
    };
  }

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
  async fetchHeatScore(@Param("gameDateId") gameDateId: string): Promise<MASLEventsResponse> {
    const result = await this.oddsService.getTheHeatScore(gameDateId);
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
}

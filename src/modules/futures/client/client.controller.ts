import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { ApiResponse, ApiOperation, ApiBearerAuth, ApiTags, ApiParam } from "@nestjs/swagger";
import capitalize from "lodash.capitalize";

import { ClientService } from "./client.service";

import {
  SportsTypeTourYearIdParamDto,
  SportsTypeTourYearIdTypeParamDto,
  SportsTypeFutureIdTypeParamDto,
} from "./dto/params.dto";
import { FuturesResponse } from "./schemas/response/futures.response";
import { FutureOddsResponse } from "./schemas/response/futureOdds.response";
import FutureOddsDownload from "./schemas/response/downloadFutureOdds.reponse";

import { SportsTypes, FutureMarkets } from "../../../constants/system";

import { fetchSportName } from "../../../helpers/sports.helper";

import ApiGuard from "../../../guards/clientApi.guard";

@ApiBearerAuth()
@UseGuards(ApiGuard)
@ApiTags("futures")
@Controller({
  path: `client/:sportsType/futures`,
})
export default class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @ApiResponse({
    description: "Success",
    type: FuturesResponse,
    status: 200,
    isArray: true,
  })
  @ApiOperation({
    summary: "Get Futures",
    description: "Get Futures",
  })
  @ApiParam({
    name: "tourYearId",
    description: "Id of the tour year.",
  })
  @ApiParam({
    name: "sportsType",
    description: "Sports Type",
    enum: SportsTypes,
  })
  @Get("/tour/:tourYearId")
  async fetchFuturesByTourYearId(
    @Param() params: SportsTypeTourYearIdParamDto,
  ): Promise<FuturesResponse> {
    const result = await this.clientService.fetchFutures(params.sportsType, params.tourYearId);

    return {
      id: `${params.sportsType}_${params.tourYearId}`,
      name: `${fetchSportName(params.sportsType)} ${capitalize(
        result?.tour?.gender || result?.league?.gender,
      )} Season Futures ${result?.year}`,
      nextEventStartDate: result?.futures[0]?.eventDate || result?.event?.startDate || null,
      startDate: result?.futures[0]?.startDate,
      endDate: result?.futures[0]?.endDate,
      year: result?.year,
      isOpen: result?.futures[0]?.isMarketOpen,
      futureStatus: result?.futures[0]?.status,
      markets: result?.futures?.map((future) => {
        let name: string = "";
        const type: FutureMarkets = future.type;

        switch (future.type) {
          case FutureMarkets.WINNER:
            name = "Winner";
            break;

          case FutureMarkets.TOP_2:
            name = "Top 2";
            break;

          case FutureMarkets.TOP_3:
            name = "Top 3";
            break;

          case FutureMarkets.TOP_5:
            name = "Top 5";
            break;

          case FutureMarkets.TOP_10:
            name = "Top 10";
            break;

          case FutureMarkets.MAKE_CUT:
            name = "Makes Cut";
            break;

          case FutureMarkets.MAKE_PLAYOFFS:
            name = "Makes Playoffs";
            break;

          default:
            break;
        }

        return {
          id: future?.id,
          label: name,
          name: type,
        };
      }),
    };
  }

  @ApiResponse({
    description: "Success",
    type: FutureOddsResponse,
    status: 200,
    isArray: true,
  })
  @ApiOperation({
    summary: "Get Futures Odds",
    description: "Get Futures Odds",
  })
  @ApiParam({
    name: "tourYearId",
    description: "Id of the tour year.",
  })
  @ApiParam({
    name: "futureType",
    description: "type of the future.",
    enum: FutureMarkets,
  })
  @ApiParam({
    name: "sportsType",
    description: "Sports Type",
    enum: SportsTypes,
  })
  @Get("/tour/:tourYearId/odds/:futureType")
  async fetchFutureOdds(
    @Param() params: SportsTypeTourYearIdTypeParamDto,
  ): Promise<FutureOddsResponse[]> {
    const result = await this.clientService.fetchFutureOdds(
      params.sportsType,
      params.tourYearId,
      params.futureType,
    );

    return result.map((future) => ({
      id: future.id,
      odds: +Number(future.odds).toFixed(2),
      probability: +Number(future.probability).toFixed(2),
      trueProbability: +Number(future.trueProbability).toFixed(2),
      hasModifiedProbability: future.hasModifiedProbability,
      createdAt: future.createdAt,
      updatedAt: future.updatedAt,
      athlete: ![SportsTypes.MASL, SportsTypes.JA].includes(params.sportsType)
        ? {
            id: future.athlete.id,
            firstName: future.athlete.firstName,
            middleName: future.athlete.middleName,
            lastName: future.athlete.lastName,
            gender: future.athlete.gender,
            nationality: future.athlete.nationality,
            stance: future.athlete.stance,
            yearStatus: future.athlete.yearStatus,
            yearPoints: future.athlete.yearPoints,
            yearRank: future.athlete.yearRank,
            playerStatus: future.athlete.playerStatus,
          }
        : {
            id: future.team.id,
            firstName: future.team.name,
            middleName: null,
            lastName: null,
            gender: null,
            nationality: null,
            stance: null,
            yearStatus: 1,
            yearPoints: 0,
            yearRank: 0,
            playerStatus: 1,
          },
    }));
  }

  @ApiResponse({
    description: "Success",
    type: FutureOddsDownload,
    status: 200,
  })
  @ApiOperation({
    summary: "Get Futures Odds",
    description: "Get Futures Odds",
  })
  @ApiParam({
    name: "futureId",
    description: "Id of the future.",
  })
  @ApiParam({
    name: "futureType",
    description: "type of the future.",
    enum: FutureMarkets,
  })
  @ApiParam({
    name: "sportsType",
    description: "Sports Type",
    enum: SportsTypes,
  })
  @Get("/:futureId/odds/:futureType/download")
  async futureOddsDownload(
    @Param() params: SportsTypeFutureIdTypeParamDto,
  ): Promise<FutureOddsDownload> {
    return this.clientService.futureOddsDownload(
      params.sportsType,
      params.futureId,
      params.futureType,
    );
  }
}

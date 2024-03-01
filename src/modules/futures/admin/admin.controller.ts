import { Controller, Get, Put, Body, Param, UseGuards, Inject } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import {
  ApiResponse,
  ApiOperation,
  ApiBearerAuth,
  ApiTags,
  ApiParam,
  ApiBody,
} from "@nestjs/swagger";
import capitalize from "lodash.capitalize";

import { AdminService } from "./admin.service";

import {
  SportsTypeTourYearIdParamDto,
  SportsTypeTourYearIdTypeParamDto,
  SportsTypeFutureParamDto,
} from "./dto/params.dto";
import { UpdateFutureOddsDto } from "./dto/updateFutureOdds.dto";
import { UpdateFutureMarket, UpdateFutureEventDate } from "./dto/updateFutureMarket.dto";
import { FuturesResponse } from "./schemas/response/futures.response";
import { FutureOddsResponse } from "./schemas/response/futureOdds.response";
import { SportsTypes, FutureMarkets } from "../../../constants/system";

import { fetchSportName } from "../../../helpers/sports.helper";

import ApiGuard from "../../../guards/adminApi.guard";

@ApiBearerAuth()
@UseGuards(ApiGuard)
@ApiTags("futures")
@Controller({
  path: `admin/:sportsType/futures`,
})
export default class AdminController {
  constructor(
    private readonly adminService: AdminService,
    @Inject(CACHE_MANAGER) protected readonly cacheManager,
  ) {}

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
    const result = await this.adminService.fetchFutures(params.sportsType, params.tourYearId);

    return {
      id: `${params.sportsType}_${params.tourYearId}`,
      name: `${fetchSportName(params.sportsType)} ${capitalize(
        result?.tour?.gender || result?.league?.gender,
      )} Season Futures ${result?.year}`,
      startDate: result?.futures[0]?.startDate,
      nextEventStartDate: result?.futures[0]?.eventDate || result?.event?.startDate || null,
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
          // type: Object.keys(FutureMarkets).find((x) => FutureMarkets[x] === future.type) || null,
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
  ): Promise<FutureOddsResponse> {
    const [result, clientOdd] = await Promise.all([
      this.adminService.fetchFutureOdds(params.sportsType, params.tourYearId, params.futureType),
      this.adminService.fetchClientFutureOdd(
        params.sportsType,
        params.tourYearId,
        params.futureType,
      ),
    ]);

    return {
      clientUpdatedAtDate: clientOdd?.updatedAt || null,
      traderUpdatedAtDate: result[0]?.updatedAt || null,
      odds: result.map((future) => ({
        id: future.id,
        odds: +Number(future.odds).toFixed(2),
        probability: +Number(future.probability).toFixed(2),
        trueProbability: +Number(future.trueProbability).toFixed(2),
        hasModifiedProbability: future.hasModifiedProbability,
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
      })),
    };
  }

  @ApiBody({ type: UpdateFutureOddsDto })
  @ApiResponse({
    type: Boolean,
    status: 200,
  })
  @ApiOperation({
    summary: "Update futures odds",
    description: "Update futures odds",
  })
  @ApiParam({
    name: "futureId",
    description: "Id of the future.",
  })
  @ApiParam({
    name: "sportsType",
    description: "Sports Type",
    enum: SportsTypes,
  })
  @Put(":futureId/odds")
  async updateFutureOdds(
    @Param() params: SportsTypeFutureParamDto,
    @Body() payload: UpdateFutureOddsDto,
  ): Promise<boolean> {
    const result = await this.adminService.updateFutureOdds(params.sportsType, payload);

    return result;
  }

  @ApiResponse({
    description: "Success",
    type: Boolean,
    status: 200,
  })
  @ApiOperation({
    description: "Update client odds",
  })
  @ApiParam({
    name: "sportsType",
    description: "Sports Type",
    enum: SportsTypes,
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
  @Put("/tour/:tourYearId/:futureType/odds/public")
  async oddsGoLive(@Param() params: SportsTypeTourYearIdTypeParamDto): Promise<boolean> {
    const result = await this.adminService.oddsGoLive(
      params.sportsType,
      params.futureType,
      params.tourYearId,
    );

    return result;
  }

  @ApiResponse({
    description: "Success",
    type: Boolean,
    status: 200,
  })
  @ApiOperation({
    summary: "Update market status",
    description: "Update market status",
  })
  @ApiParam({
    name: "sportsType",
    description: "Sports Type",
    enum: SportsTypes,
  })
  @ApiParam({
    name: "tourYearId",
    description: "Id of the tour year.",
  })
  @Put("/tour/:tourYearId/open")
  async updateMarketStatus(
    @Param() params: SportsTypeTourYearIdParamDto,
    @Body() payload: UpdateFutureMarket,
  ): Promise<boolean> {
    const result = await this.adminService.updateMarketStatus(
      params.sportsType,
      params.tourYearId,
      payload.isMarketOpen,
    );

    this.cacheManager.reset();

    return result;
  }

  @ApiResponse({
    description: "Success",
    type: Boolean,
    status: 200,
  })
  @ApiOperation({
    summary: "Update event date",
    description: "Update event date",
  })
  @ApiParam({
    name: "sportsType",
    description: "Sports Type",
    enum: SportsTypes,
  })
  @ApiParam({
    name: "tourYearId",
    description: "Id of the tour year.",
  })
  @Put("/tour/:tourYearId/eventDate")
  async updateEventDate(
    @Param() params: SportsTypeTourYearIdParamDto,
    @Body() payload: UpdateFutureEventDate,
  ): Promise<boolean> {
    const result = await this.adminService.updateEventDate(
      params.sportsType,
      params.tourYearId,
      payload.eventDate,
    );

    this.cacheManager.reset();

    return result;
  }
}

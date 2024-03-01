import { Body, Controller, Post, UseGuards, Inject } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { ApiBody, ApiResponse, ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";

import TraderScoresDto from "./dto/traderScores.dto";
import EventSeedDto from "./dto/eventSeed.dto";
import AddProjectionEventOutcomeDto from "./dto/addProjectionEventOutcome.dto";
import AddProjectionEventHeatOutcomeDto from "./dto/addProjectionEventHeatOutcome.dto";
import AddProjectionEventShowsDto from "./dto/addProjectionEventShows.dto";
import AddProjectionEventPodiumsDto from "./dto/addProjectionEventPodiums.dto";
import AddPlayerHeadToHeadDto from "./dto/addPlayerHeadToHead.dto";
import AddProjectionEventPropBetsDto from "./dto/addProjectionEventPropBets.dto";

import { SportsTypes } from "../../../../constants/system";

import ApiGuard from "../../../../guards/adminApi.guard";

import TraderService from "./traders.service";

@ApiBearerAuth()
@UseGuards(ApiGuard)
@ApiTags("traders")
@Controller({
  path: `admin/${SportsTypes.SUPERCROSS}/traders`,
})
export default class TraderController {
  constructor(
    private readonly traderService: TraderService,
    @Inject(CACHE_MANAGER) protected readonly cacheManager,
  ) {}

  @ApiBody({ type: TraderScoresDto })
  @ApiResponse({
    description: "Success",
    type: Boolean,
    status: 200,
  })
  @ApiOperation({
    description: "Save past event data",
  })
  @Post("scores")
  async saveScores(@Body() scores: TraderScoresDto): Promise<boolean> {
    const result = await this.traderService.saveScores(scores);

    this.cacheManager.reset();

    return result;
  }

  @ApiBody({ type: EventSeedDto })
  @ApiResponse({
    type: Boolean,
    status: 200,
  })
  @ApiOperation({
    description: "Save event seed",
  })
  @Post("events/seeds")
  async saveEventSeed(@Body() payload: EventSeedDto): Promise<boolean> {
    const result = await this.traderService.saveEventSeed(payload);

    this.cacheManager.reset();

    return result;
  }

  @ApiBody({ type: AddProjectionEventOutcomeDto })
  @ApiResponse({
    type: Boolean,
    status: 200,
  })
  @ApiOperation({
    description: "Add Projection Event Outcome",
  })
  @Post("odds/event")
  async addProjectionEventOutcome(@Body() payload: AddProjectionEventOutcomeDto): Promise<boolean> {
    const result = await this.traderService.addProjectionEventOutcomeOdds(payload);

    this.cacheManager.reset();

    return result;
  }

  @ApiBody({ type: AddProjectionEventPropBetsDto })
  @ApiResponse({
    type: Boolean,
    status: 200,
  })
  @ApiOperation({
    description: "Add Projection Event PropBets",
  })
  @Post("odds/propBets")
  async addProjectionEventPropBets(
    @Body() payload: AddProjectionEventPropBetsDto,
  ): Promise<boolean> {
    const result = await this.traderService.addProjectionEventPropBets(payload);

    this.cacheManager.reset();

    return result;
  }

  @ApiBody({ type: AddProjectionEventShowsDto })
  @ApiResponse({
    type: Boolean,
    status: 200,
  })
  @ApiOperation({
    description: "Add Projection Event Shows",
  })
  @Post("odds/shows")
  async addProjectionEventShows(@Body() payload: AddProjectionEventShowsDto): Promise<boolean> {
    const result = await this.traderService.addProjectionEventShowsOdds(payload);

    this.cacheManager.reset();

    return result;
  }

  @ApiBody({ type: AddProjectionEventPodiumsDto })
  @ApiResponse({
    type: Boolean,
    status: 200,
  })
  @ApiOperation({
    description: "Add Projection Event Podiums",
  })
  @Post("odds/podiums")
  async addProjectionEventPodiums(@Body() payload: AddProjectionEventPodiumsDto): Promise<boolean> {
    const result = await this.traderService.addProjectionEventPodiumsOdds(payload);

    this.cacheManager.reset();

    return result;
  }

  @ApiBody({ type: AddProjectionEventHeatOutcomeDto })
  @ApiResponse({
    type: Boolean,
    status: 200,
  })
  @ApiOperation({
    description: "Add Projection Event Heat Outcome",
  })
  @Post("odds/heat")
  async addProjectionEventHeatOutcome(
    @Body() payload: AddProjectionEventHeatOutcomeDto,
  ): Promise<boolean> {
    const result = await this.traderService.addProjectionEventHeatOutcomeOdds(payload);

    this.cacheManager.reset();

    return result;
  }

  @ApiBody({ type: AddPlayerHeadToHeadDto })
  @ApiResponse({
    type: Boolean,
    status: 200,
  })
  @ApiOperation({
    description: "Add Player Head to Heads",
  })
  @Post("odds/headToHead")
  async addPlayerHeadToHead(@Body() payload: AddPlayerHeadToHeadDto): Promise<boolean> {
    const result = await this.traderService.addPlayerHeadToHeadsOdds(payload);

    this.cacheManager.reset();

    return result;
  }
}

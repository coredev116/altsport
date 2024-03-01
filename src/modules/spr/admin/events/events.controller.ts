import { Body, Controller, Post, UseGuards, Inject } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { ApiBody, ApiResponse, ApiTags, ApiBearerAuth } from "@nestjs/swagger";

import Event from "../../../../entities/spr/events.entity";

import { SportsTypes } from "../../../../constants/system";

import EventDto from "./dto/events.dto";

import EventService from "./events.service";

import ApiGuard from "../../../../guards/adminApi.guard";

@ApiBearerAuth()
@UseGuards(ApiGuard)
@ApiTags("events")
@Controller({
  path: `admin/${SportsTypes.SUPERCROSS}/events`,
})
export default class EventController {
  constructor(
    private readonly eventService: EventService,
    @Inject(CACHE_MANAGER) protected readonly cacheManager,
  ) {}

  @ApiBody({ type: EventDto })
  @ApiResponse({
    description: "Success",
    type: Event,
    status: 200,
    isArray: true,
  })
  @Post()
  async create(@Body() payload: EventDto): Promise<Event[]> {
    const result = await this.eventService.createEvent(payload);

    this.cacheManager.reset();

    return result;
  }
}

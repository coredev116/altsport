import { Controller, Get, UseGuards, Query, UseInterceptors } from "@nestjs/common";
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth, ApiQuery } from "@nestjs/swagger";
import { CacheInterceptor } from "@nestjs/cache-manager";

import { AdminTradersService } from "./admin.traders.service";

import { EventLocationGroupDto } from "./dto/eventLocationGroup.dto";

import EventLocationGroupResponse from "./schemas/response/eventLocationGroup.response";

import ApiGuard from "../../../guards/adminApi.guard";

@ApiBearerAuth()
@UseGuards(ApiGuard)
@ApiTags("traders")
@Controller({
  path: "admin/traders",
})
export class AdminTradersController {
  constructor(private readonly tradersService: AdminTradersService) {}

  @ApiQuery({
    name: "sportType",
    type: "string",
    required: true,
    description: "Specify the sport for which the event location group should be returned",
  })
  @ApiOperation({
    description: "Returns Event Location Group for a given sport.",
  })
  @ApiResponse({
    type: EventLocationGroupResponse,
    status: 200,
    isArray: true,
  })
  @Get("/eventLocationGroups")
  @UseInterceptors(CacheInterceptor)
  async fetchEventLocationGroups(
    @Query() queryParams: EventLocationGroupDto,
  ): Promise<EventLocationGroupResponse[]> {
    const result = await this.tradersService.fetchEventLocationGroups(queryParams.sportType);

    return result;
  }
}

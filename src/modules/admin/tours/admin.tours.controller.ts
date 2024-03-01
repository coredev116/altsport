import { Controller, Get, UseGuards, Query, UseInterceptors } from "@nestjs/common";
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth, ApiQuery } from "@nestjs/swagger";
import { CacheInterceptor } from "@nestjs/cache-manager";

import { AdminToursService } from "./admin.tours.service";

import { ToursDto } from "./dto/tours.dto";

import AdminToursResponse from "./schemas/response/admin.tours.response";

import ApiGuard from "../../../guards/adminApi.guard";

@ApiBearerAuth()
@UseGuards(ApiGuard)
@ApiTags("tours")
@Controller({
  path: "admin/tours",
})
export class AdminToursController {
  constructor(private readonly toursService: AdminToursService) {}

  @ApiQuery({
    name: "sportType",
    type: "string",
    required: true,
    description: "Specify the sport for which the tours should be returned",
  })
  @ApiOperation({
    description: "Returns tours for a given sport.",
  })
  @ApiResponse({
    type: AdminToursResponse,
    status: 200,
    isArray: true,
  })
  @Get()
  @UseInterceptors(CacheInterceptor)
  async fetchTours(@Query() queryParams: ToursDto): Promise<AdminToursResponse[]> {
    const result = await this.toursService.fetchTours(queryParams.sportType);

    return result;
  }
}

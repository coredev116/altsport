import { Body, Controller, Get, Post, UseGuards, Put, Param } from "@nestjs/common";
import {
  ApiBody,
  ApiResponse,
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
} from "@nestjs/swagger";

import { ClientApiKeyDto, ClientApiKeyListingItemDto } from "./dto/clientApiKey";

import ApiKeyService from "./apiKey.service";

import ApiGuard from "../../../guards/clientApi.guard";

@ApiBearerAuth("Bearer token")
@UseGuards(ApiGuard)
@ApiTags("clientApiKey")
@Controller({
  path: `client/clientApiKey`,
})
export default class ApiKeyController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  @Get()
  @ApiOperation({
    summary: "Fetch client apis",
    description: "Fetch client apis",
  })
  @ApiResponse({
    description: "Success",
    type: ClientApiKeyListingItemDto,
    status: 200,
  })
  public async fetchClientApis(): Promise<ClientApiKeyListingItemDto[]> {
    const data = await this.apiKeyService.fetchClientApis();
    return data.map((apiK) => {
      return {
        id: apiK.id,
        apiKey: apiK.apiKey,
        totalRequestCount: apiK.totalRequestCount,
        currentRequestCount: apiK.currentRequestCount,
        isActive: apiK.isActive,
        isArchived: apiK.isArchived,
        expiryDate: apiK.expiryDate,
        client: {
          id: apiK.client.id,
          username: apiK.client.username,
        },
      };
    });
  }

  @ApiBody({ type: ClientApiKeyDto })
  @ApiOperation({
    summary: "Bulk insert client Apis",
    description: "API to bulk insert Client Apis",
  })
  @ApiResponse({
    description: "Success",
    type: Boolean,
    status: 200,
  })
  @Post()
  async createClientApiKey(@Body() clientApiKeys: ClientApiKeyDto): Promise<boolean> {
    return this.apiKeyService.createClientApiKey(clientApiKeys);
  }

  @ApiOperation({
    summary: "Archive client Apis",
    description: "API to archive Client Apis",
  })
  @ApiResponse({
    description: "Success",
    type: Boolean,
    status: 200,
  })
  @ApiParam({
    name: "id",
    description: "The id of the api key to archive",
  })
  @Put(":id")
  async archiveClientApiKey(@Param("id") id: string): Promise<boolean> {
    return this.apiKeyService.archiveClientApiKey(id);
  }
}

import { Controller, UseGuards, Patch, Body } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";

import { MarketNotificationsService } from "./market.notifications.service";

import { MarketNotificationDto } from "./dto/marketNotifications.dto";

import { Client } from "../../../../decorators/client.decorator";

import ApiGuard from "../../../../guards/clientApi.guard";

@ApiBearerAuth()
@UseGuards(ApiGuard)
@ApiTags("Market Notification Settings")
@Controller({
  path: "client/settings/notifications",
})
export class MarketNotificationsController {
  constructor(private readonly settingsService: MarketNotificationsService) {}

  @ApiOperation({
    summary: "Client update market notification",
    description: "Allows a client to enable or disable notifications for a particular market type",
    operationId: "clientMarketNotifications",
  })
  @Patch("oddMarkets")
  async updateClientOddMarketNotificationSettings(
    @Client("userId") userId: string,
    @Body() payload: MarketNotificationDto,
  ): Promise<boolean> {
    return this.settingsService.updateClientOddMarketNotificationSettings(userId, payload);
  }
}

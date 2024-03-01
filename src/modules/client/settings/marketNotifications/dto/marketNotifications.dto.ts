import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsBoolean } from "class-validator";

import { OddMarkets } from "../../../../../constants/system";

export class MarketNotificationDto {
  @ApiProperty({
    name: "oddMarketKey",
    type: "enum",
    example: OddMarkets.EVENT_WINNER_PROJECTIONS,
    enum: OddMarkets,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  oddMarketKey: string;

  @ApiProperty({
    name: "isEnabled",
    type: "boolean",
    example: true,
    required: true,
  })
  @IsBoolean()
  isEnabled: boolean;
}

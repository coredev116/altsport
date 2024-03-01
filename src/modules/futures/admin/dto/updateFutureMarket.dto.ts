import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsString } from "class-validator";

export class UpdateFutureMarket {
  @ApiProperty({
    name: "isMarketOpen",
    example: true,
    type: "boolean",
  })
  @IsBoolean()
  isMarketOpen: boolean;
}

export class UpdateFutureEventDate {
  @ApiProperty({
    name: "eventDate",
    example: "2022-04-18T15:25:24Z",
    type: "string",
  })
  @IsString()
  eventDate: string;
}

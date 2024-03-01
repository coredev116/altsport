import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

import { SportsTypes } from "../../../../constants/system";

export class EventLocationGroupDto {
  @ApiProperty({
    name: "sportType",
    type: "string",
    example: SportsTypes.SURFING,
    enum: SportsTypes,
  })
  @IsString()
  @IsNotEmpty()
  sportType: SportsTypes;
}

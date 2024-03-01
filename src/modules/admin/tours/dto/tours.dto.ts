import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

import { SportsTypes } from "../../../../constants/system";

export class ToursDto {
  @ApiProperty({
    name: "sportType",
    type: "string",
    example: SportsTypes.RALLYCROSS,
    enum: SportsTypes,
  })
  @IsString()
  @IsNotEmpty()
  sportType: SportsTypes;
}

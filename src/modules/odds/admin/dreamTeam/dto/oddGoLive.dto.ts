import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsEnum } from "class-validator";
import { OddMarkets } from "../../../../../constants/system";

export default class OddGoLiveDto {
  @ApiProperty({
    name: "projectionType",
    type: "enum",
    example: OddMarkets.DREAM_TEAM,
    enum: OddMarkets,
  })
  @IsString()
  @IsEnum(OddMarkets)
  @IsNotEmpty()
  projectionType: OddMarkets;
}

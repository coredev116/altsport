import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsEnum } from "class-validator";
import { OddMarkets } from "../../../../../constants/system";

export default class OddGoLiveDto {
  @ApiProperty({
    name: "projectionType",
    type: "string",
    example: OddMarkets.HEAD_TO_HEAD_PROJECTIONS,
  })
  @IsString()
  @IsEnum(OddMarkets)
  @IsNotEmpty()
  projectionType: OddMarkets;
}

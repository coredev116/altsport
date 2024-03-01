import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsEnum, ValidateIf, IsUUID } from "class-validator";
import { OddMarkets } from "../../../../../constants/system";

export default class OddGoLiveDto {
  @ApiProperty({
    name: "projectionType",
    type: "string",
    example: OddMarkets.EVENT_SECOND_PLACE_PROJECTIONS,
  })
  @IsString()
  @IsEnum(OddMarkets)
  @IsNotEmpty()
  projectionType: OddMarkets;

  @ApiProperty({
    name: "roundHeatId",
    type: "string",
    example: "2127ea10-6110-4ffd-9403-3e33fc0929de",
  })
  @ValidateIf((values) => values.projectionType === OddMarkets.HEAT_PROJECTIONS && !values?.roundId)
  @IsUUID()
  roundHeatId: string;

  @ApiProperty({
    name: "roundId",
    type: "string",
    example: "2127ea10-6110-4ffd-9403-3e33fc0929de",
  })
  @ValidateIf(
    (values) => values.projectionType === OddMarkets.HEAT_PROJECTIONS && !values?.roundHeatId,
  )
  @IsUUID()
  roundId: string;
}

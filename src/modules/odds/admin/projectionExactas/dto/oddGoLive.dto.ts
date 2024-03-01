import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsEnum, IsOptional, IsUUID } from "class-validator";
import { OddMarkets } from "../../../../../constants/system";

export default class OddGoLiveDto {
  @ApiProperty({
    name: "projectionType",
    type: "enum",
    example: OddMarkets.EXACTAS,
    enum: OddMarkets,
  })
  @IsString()
  @IsEnum(OddMarkets)
  @IsNotEmpty()
  projectionType: OddMarkets;

  @ApiProperty({
    name: "roundHeatId",
    type: "enum",
    example: OddMarkets.EXACTAS,
    enum: OddMarkets,
  })
  @IsUUID()
  @IsString()
  @IsOptional()
  roundHeatId: string;
}

import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsBoolean, IsUUID, IsEnum, Min, ValidateIf } from "class-validator";

import { NRXLapStatus } from "../../../../../constants/system";

export default class TraderAthleteSeed {
  @ApiProperty({
    name: "id",
    type: "string",
    required: false,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  @IsOptional()
  @IsUUID()
  @ValidateIf((value) => value.id)
  id: string;

  @ApiProperty({ name: "seed", type: "number", example: 1, required: true })
  @IsNumber()
  @IsOptional()
  seed: number;

  @ApiProperty({
    name: "athleteId",
    type: "string",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  @IsUUID()
  @IsOptional()
  athleteId: string;

  @ApiProperty({ name: "lapTime", type: "number", example: 10.3, required: false })
  @IsNumber()
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  lapTime: number;

  @ApiProperty({ name: "penaltyTime", type: "number", example: 2.6, required: false })
  @IsNumber()
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  penaltyTime: number;

  @ApiProperty({ name: "lapNumber", type: "number", example: 12, default: null })
  @IsNumber()
  @IsOptional()
  @ValidateIf((_, value) => !!value)
  lapNumber: number;

  @ApiProperty({ name: "heatPosition", type: "number", example: 2, required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @ValidateIf((object) => [object.status].includes([NRXLapStatus.ACTIVE]))
  heatPosition: number;

  @ApiProperty({ name: "isJoker", type: "boolean", example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isJoker: boolean;

  @ApiProperty({ name: "status", type: "string", example: NRXLapStatus.ACTIVE, required: false })
  @IsEnum(NRXLapStatus)
  @IsOptional()
  status: NRXLapStatus;
}

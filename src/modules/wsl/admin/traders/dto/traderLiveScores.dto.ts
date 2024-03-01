import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsUUID, ValidateNested, IsOptional, IsNotEmpty, IsBoolean } from "class-validator";

import { HeatStatus } from "../../../../../constants/system";

import TraderAthleteSeedDto from "./traderAthleteSeed.dto";

export default class TraderLiveScores {
  @ApiProperty({
    name: "eventId",
    type: "string",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  @IsUUID()
  @IsNotEmpty()
  eventId: string;

  @ApiProperty({
    name: "heatStatus",
    type: "number",
    example: HeatStatus.LIVE,
    enum: HeatStatus,
    default: HeatStatus.LIVE,
  })
  @IsOptional()
  heatStatus: HeatStatus;

  @ApiProperty({
    name: "hasHeatEnded",
    type: "boolean",
    required: false,
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  hasHeatEnded: boolean;

  @Type(() => Date)
  @ApiProperty({
    name: "startDate",
    type: "string",
    format: "date",
    example: "2022-04-18T15:25:24Z",
    required: false,
  })
  @IsDate()
  @IsOptional()
  startDate: Date;

  @Type(() => Date)
  @ApiProperty({
    name: "endDate",
    type: "string",
    format: "date",
    example: "2022-04-18T15:25:24Z",
    required: false,
  })
  @IsDate()
  @IsOptional()
  endDate: Date;

  @Type(() => TraderAthleteSeedDto)
  @ValidateNested({ each: true })
  @ApiProperty({ type: TraderAthleteSeedDto, isArray: true, required: false })
  @IsOptional()
  athletes: TraderAthleteSeedDto[];
}

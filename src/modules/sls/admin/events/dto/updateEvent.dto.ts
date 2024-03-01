import { ApiProperty } from "@nestjs/swagger";
import { Type, Transform, TransformFnParams } from "class-transformer";
import {
  IsNumber,
  IsString,
  IsNotEmpty,
  IsDate,
  IsEnum,
  IsUUID,
  IsOptional,
  IsBoolean,
} from "class-validator";

import { EventStatus } from "../../../../../constants/system";

export default class EventItemDto {
  @ApiProperty({ name: "name", type: "string", required: true, example: "SLS Salt Lake City" })
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  name: string;

  @ApiProperty({
    name: "leagueYearId",
    type: "string",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  @IsUUID()
  @IsNotEmpty()
  leagueYearId: string;

  @Type(() => Date)
  @ApiProperty({
    name: "startDate",
    type: "string",
    format: "date",
    example: "2022-04-18T15:25:24Z",
    required: true,
  })
  @IsDate()
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

  @ApiProperty({
    name: "eventLocation",
    type: "string",
    example: "Salt Lake City, Utah, USA",
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  eventLocation: string;

  @ApiProperty({
    name: "eventLocationGroup",
    type: "string",
    example: "Margaret River Pro",
    required: false,
  })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @IsOptional()
  eventLocationGroup: string;

  @ApiProperty({
    name: "eventStatus",
    type: "number",
    example: EventStatus.COMPLETED,
    default: EventStatus.COMPLETED,
    required: true,
  })
  @IsEnum(EventStatus)
  @IsNumber()
  eventStatus: number;

  @ApiProperty({
    name: "isSimulationEnabled",
    type: "boolean",
    example: true,
    default: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isSimulationEnabled: boolean;
}

import { ApiProperty } from "@nestjs/swagger";
import { Type, Transform, TransformFnParams } from "class-transformer";
import {
  IsNumber,
  IsString,
  IsNotEmpty,
  IsDate,
  IsEnum,
  IsArray,
  ValidateNested,
  IsOptional,
} from "class-validator";

import { EventStatus } from "../../../../../constants/system";

class EventItemSLSDto {
  @ApiProperty({ name: "name", type: "string", required: true, example: "SLS Salt Lake City" })
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  name: string;

  @ApiProperty({
    name: "leagueName",
    type: "string",
    required: true,
    example: "SLS",
  })
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  leagueName: string;

  @ApiProperty({ name: "year", type: "number", example: 2022, required: true })
  @IsNumber()
  year: number;

  @ApiProperty({ name: "gender", type: "string", required: true, example: "women" })
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  gender: string;

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

  // @ApiProperty({
  //   name: "eventNumber",
  //   type: "number",
  //   example: 1,
  //   default: 1,
  //   required: true,
  // })
  // @IsNumber()
  // eventNumber: number;

  @Type(() => Date)
  @ApiProperty({
    name: "startDate",
    type: "string",
    format: "date",
    example: "2022-04-18T15:25:24Z",
    required: false,
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
  endDate: Date;
}

export default class EventSLSDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EventItemSLSDto)
  @ApiProperty({ name: "items", type: EventItemSLSDto, required: true, isArray: true })
  items: EventItemSLSDto[];
}

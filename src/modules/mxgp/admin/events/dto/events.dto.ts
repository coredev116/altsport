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

class EventIDto {
  @ApiProperty({
    name: "name",
    type: "string",
    required: true,
    example: "AWS GRAN PREMIO DE ESPAÑA",
  })
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  name: string;

  @ApiProperty({ name: "gender", type: "string", required: true, example: "men" })
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  gender: string;

  @ApiProperty({
    name: "tourName",
    type: "string",
    required: true,
    example: "MXGP Tour",
  })
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  tourName: string;

  @ApiProperty({ name: "year", type: "number", example: 2022, required: true })
  @IsNumber()
  year: number;

  @ApiProperty({
    name: "eventLocation",
    type: "string",
    example: "Circuit de Barcelona-Catalunya",
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  eventLocation: string;

  @ApiProperty({
    name: "eventLocationGroup",
    type: "string",
    example: "Circuit de Barcelona-Catalunya",
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
    name: "eventNumber",
    type: "number",
    example: 1,
    default: 1,
    required: true,
  })
  @IsNumber()
  eventNumber: number;

  @ApiProperty({
    name: "eventLap",
    type: "number",
    example: 1,
    required: true,
  })
  @IsNumber()
  eventLap: number;

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

export default class EventDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EventIDto)
  @ApiProperty({ name: "items", type: EventIDto, required: true, isArray: true })
  items: EventIDto[];
}

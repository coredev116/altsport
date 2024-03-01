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

class EventItemDto {
  @ApiProperty({ name: "name", type: "string", required: true, example: "Arlington 3" })
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
    example: "KTM Junior Supercross",
  })
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  tourName: string;

  @ApiProperty({ name: "year", type: "number", example: 2022, required: true })
  @IsNumber()
  year: number;

  @ApiProperty({
    name: "categoryName",
    type: "string",
    example: "KTM Junior",
  })
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  categoryName: string;

  @ApiProperty({
    name: "eventLocation",
    type: "string",
    example: "Arlington",
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  eventLocation: string;

  @ApiProperty({
    name: "eventLocationGroup",
    type: "string",
    example: "Arlington",
    required: false,
  })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @IsOptional()
  eventLocationGroup: string;

  @ApiProperty({
    name: "trackType",
    type: "string",
    example: "Gravel, Pavement",
    required: false,
  })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @IsOptional()
  trackType: string;

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
  @Type(() => EventItemDto)
  @ApiProperty({ name: "items", type: EventItemDto, required: true, isArray: true })
  items: EventItemDto[];
}

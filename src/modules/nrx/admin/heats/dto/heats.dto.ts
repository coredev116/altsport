import { ApiProperty } from "@nestjs/swagger";
import {
  IsNumber,
  IsString,
  IsNotEmpty,
  IsArray,
  IsDate,
  ValidateNested,
  IsEnum,
  IsOptional,
} from "class-validator";
import { Type, Transform, TransformFnParams } from "class-transformer";

import { HeatStatus } from "../../../../../constants/system";

class HeatItemDto {
  @ApiProperty({ name: "heatName", type: "string", required: true, example: "Heat 1" })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @IsNotEmpty()
  heatName: string;

  @ApiProperty({ name: "heatNo", type: "number", example: 1, required: true })
  @IsNumber()
  heatNo: number;

  @ApiProperty({ name: "year", type: "number", required: true, example: 2019 })
  @IsNumber()
  year: number;

  @ApiProperty({
    name: "tourName",
    type: "string",
    required: true,
    example: "Supercar",
  })
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  tourName: string;

  @ApiProperty({
    name: "heatStatus",
    type: "number",
    example: HeatStatus.COMPLETED,
    default: HeatStatus.COMPLETED,
    required: true,
  })
  @IsEnum(HeatStatus)
  @IsNumber()
  heatStatus: number;

  @ApiProperty({ name: "roundName", type: "string", required: true, example: "Seeding Round" })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @IsNotEmpty()
  roundName: string;

  @ApiProperty({
    name: "eventName",
    type: "string",
    required: true,
    example: "Billabong Pro Pipeline",
  })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @IsNotEmpty()
  eventName: string;

  @ApiProperty({ name: "gender", type: "string", required: true, example: "women" })
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  gender: string;

  @Type(() => Date)
  @ApiProperty({
    name: "startDate",
    type: "string",
    format: "date",
    required: false,
    example: "2022-04-18T15:25:24Z",
  })
  @IsDate()
  @IsOptional()
  startDate: Date;

  @Type(() => Date)
  @ApiProperty({
    name: "endDate",
    type: "string",
    format: "date",
    required: false,
    example: "2022-04-20T15:25:24Z",
  })
  @IsDate()
  @IsOptional()
  endDate: Date;
}

export default class HeatDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HeatItemDto)
  @ApiProperty({ name: "items", type: HeatItemDto, required: true, isArray: true })
  items: HeatItemDto[];
}

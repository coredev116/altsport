import { ApiProperty } from "@nestjs/swagger";
import {
  IsNumber,
  IsString,
  IsNotEmpty,
  IsDate,
  IsArray,
  ValidateNested,
  IsEnum,
  IsOptional,
} from "class-validator";
import { Type, Transform, TransformFnParams } from "class-transformer";

import { RoundStatus } from "../../../../../constants/system";

class RoundItemDto {
  @ApiProperty({ name: "name", type: "string", required: true, example: "Semifinal" })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ name: "roundNo", type: "number", required: true, example: 1 })
  @IsNumber()
  roundNo: number;

  @ApiProperty({ name: "year", type: "number", required: true, example: 2019 })
  @IsNumber()
  year: number;

  @ApiProperty({
    name: "eventName",
    type: "string",
    required: true,
    example: "SLS Salt Lake City",
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
  @IsOptional()
  @ApiProperty({
    name: "startDate",
    type: "string",
    format: "date",
    required: false,
    example: "2022-04-18T15:25:24Z",
  })
  @IsDate()
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

  @ApiProperty({
    name: "roundStatus",
    type: "number",
    example: RoundStatus.COMPLETED,
    default: RoundStatus.COMPLETED,
    required: true,
  })
  @IsEnum(RoundStatus)
  @IsNumber()
  roundStatus: number;
}

export class RoundDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoundItemDto)
  @ApiProperty({ name: "items", type: RoundItemDto, required: true, isArray: true })
  items: RoundItemDto[];
}

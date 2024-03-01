import { ApiProperty } from "@nestjs/swagger";
import {
  IsNumber,
  IsString,
  IsNotEmpty,
  IsDate,
  IsArray,
  ValidateNested,
  IsOptional,
  IsEnum,
} from "class-validator";
import { Type, Transform, TransformFnParams } from "class-transformer";

import { RoundStatus } from "../../../../../constants/system";

class RoundItemDto {
  @ApiProperty({ name: "name", type: "string", required: true, example: "KTM Junior Practice 1" })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ name: "roundNo", type: "number", required: true, example: 1 })
  @IsNumber()
  roundNo: number;

  @ApiProperty({ name: "year", type: "number", required: true, example: 2022 })
  @IsNumber()
  year: number;

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

  @ApiProperty({
    name: "eventName",
    type: "string",
    required: true,
    example: "Arlington 3",
  })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @IsNotEmpty()
  eventName: string;

  @ApiProperty({ name: "gender", type: "string", required: true, example: "men" })
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
  @IsOptional()
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
  @IsOptional()
  @IsDate()
  endDate: Date;

  @ApiProperty({ name: "roundType", type: "string", required: true, example: "H2H" })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @IsOptional()
  roundType: string;

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

export default class RoundDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoundItemDto)
  @ApiProperty({ name: "items", type: RoundItemDto, required: true, isArray: true })
  items: RoundItemDto[];
}

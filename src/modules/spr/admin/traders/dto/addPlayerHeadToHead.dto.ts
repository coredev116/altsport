import { ApiProperty } from "@nestjs/swagger";
import {
  IsNumber,
  IsString,
  IsNotEmpty,
  IsArray,
  IsInt,
  ValidateNested,
  Min,
  IsOptional,
  IsBoolean,
} from "class-validator";
import { Type, Transform, TransformFnParams } from "class-transformer";

class PlayerHeadToHeadItem {
  @ApiProperty({
    type: "string",
    required: true,
    example: "Arlington 3",
  })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @IsNotEmpty()
  event: string;

  @ApiProperty({
    type: "string",
    required: true,
    example: "KTM Junior Supercross",
  })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @IsNotEmpty()
  tourName: string;

  @ApiProperty({ type: "number", example: 2022, required: true })
  @IsNumber()
  year: number;

  @ApiProperty({ type: "string", required: true, example: "men" })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  gender: string;

  @ApiProperty({
    type: "string",
    required: true,
    example: "Martin Castelo",
  })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @IsNotEmpty()
  athlete1: string;

  @ApiProperty({
    type: "string",
    required: true,
    example: "Robert Castelo",
  })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @IsNotEmpty()
  athlete2: string;

  @ApiProperty({
    type: "string",
    example: "Martin Castelo",
  })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @IsOptional()
  athleteWinner: string;

  @ApiProperty({ type: "number", example: 3 })
  @IsInt()
  @IsOptional()
  @Min(1)
  athlete1Position: number;

  @ApiProperty({ type: "number", example: 5 })
  @IsInt()
  @IsOptional()
  @Min(1)
  athlete2Position: number;

  @ApiProperty({ type: "number", example: 10.2, required: true })
  @IsNumber()
  @Min(0)
  athlete1Odds: number;

  @ApiProperty({ type: "number", example: 8.2, required: true })
  @IsNumber()
  @Min(0)
  athlete2Odds: number;

  @ApiProperty({ type: "number", example: 30.4, required: true })
  @IsNumber()
  @Min(0)
  athlete1Probability: number;

  @ApiProperty({ type: "number", example: 10.4, required: true })
  @IsNumber()
  @Min(0)
  athlete2Probability: number;

  @ApiProperty({
    type: "boolean",
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  voided: boolean;

  @ApiProperty({
    type: "boolean",
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  draw: boolean;
}

export default class PlayerHeadToHead {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlayerHeadToHeadItem)
  @ApiProperty({ name: "items", type: PlayerHeadToHeadItem, required: true, isArray: true })
  items: PlayerHeadToHeadItem[];
}

import { ApiProperty } from "@nestjs/swagger";
import {
  IsNumber,
  IsString,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  Min,
  ValidateIf,
  IsOptional,
} from "class-validator";
import { Type, Transform, TransformFnParams } from "class-transformer";

class TraderScoresItemDto {
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

  @ApiProperty({ name: "year", type: "number", example: 2022, required: true })
  @IsNumber()
  year: number;

  // @ApiProperty({
  //   name: "stopNumber",
  //   type: "number",
  //   example: 1,
  //   required: false,
  //   // deprecated: true,
  // })
  // @IsNumber()
  // stopNumber: number;

  @ApiProperty({ name: "gender", type: "string", required: true, example: "men" })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @IsNotEmpty()
  gender: string;

  @ApiProperty({
    name: "tourName",
    type: "string",
    required: true,
    example: "Men's Championship Tour",
  })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @IsNotEmpty()
  tourName: string;

  @ApiProperty({ name: "roundName", type: "string", required: true, example: "Seeding Round" })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @IsNotEmpty()
  roundName: string;

  @ApiProperty({
    name: "heatNumber",
    type: "number",
    example: 1,
    required: true,
  })
  @IsNumber()
  @Min(1)
  heatNumber: number;

  @ApiProperty({
    name: "stopNumber",
    type: "number",
    example: 1,
    required: false,
  })
  @IsNumber()
  @Min(1)
  stopNumber: number;

  @ApiProperty({ name: "athlete", type: "string", required: true, example: "Kanoa Igarashi" })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @IsNotEmpty()
  athlete: string;

  @ApiProperty({ name: "heatScore", type: "number", example: 10.3, default: null })
  @IsNumber()
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  heatScore: number;

  @ApiProperty({ name: "notes", type: "string", example: "Note", default: null })
  @Transform(({ value }: TransformFnParams) => (value?.trim() === "" ? null : value?.trim()))
  @IsString()
  @IsOptional()
  notes: string;

  @ApiProperty({
    name: "playerStatus",
    type: "number",
    example: 1,
    default: null,
  })
  @IsNumber()
  @IsOptional()
  playerStatus: number;
}

export default class TraderScoresDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TraderScoresItemDto)
  @ApiProperty({ name: "items", type: TraderScoresItemDto, required: true, isArray: true })
  items: TraderScoresItemDto[];
}

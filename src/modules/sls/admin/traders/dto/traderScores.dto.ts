import { ApiProperty } from "@nestjs/swagger";
import {
  IsNumber,
  IsString,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  Min,
  IsOptional,
  ValidateIf,
} from "class-validator";
import { Type, Transform, TransformFnParams } from "class-transformer";

class TraderScoresItemDto {
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

  @ApiProperty({ name: "leagueYear", type: "number", example: 2022, required: true })
  @IsNumber()
  leagueYear: number;

  // @ApiProperty({
  //   name: "stopNumber",
  //   type: "number",
  //   example: 1,
  //   required: false,
  //   // deprecated: true,
  // })
  // @IsNumber()
  // stopNumber: number;

  @ApiProperty({ name: "leagueGender", type: "string", required: true, example: "women" })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @IsNotEmpty()
  leagueGender: string;

  @ApiProperty({
    name: "leagueName",
    type: "string",
    required: true,
    example: "SLS",
  })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @IsNotEmpty()
  leagueName: string;

  // @ApiProperty({
  //   name: "roundNumber",
  //   type: "number",
  //   example: 1,
  //   required: false,
  //   // deprecated: true,
  // })
  // @IsNumber()
  // roundNumber: number;

  @ApiProperty({ name: "roundName", type: "string", required: true, example: "Semifinal" })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @IsNotEmpty()
  roundName: string;

  @ApiProperty({
    name: "heatNumber",
    type: "number",
    example: 1,
    required: true,
    // deprecated: true,
  })
  @IsNumber()
  @Min(1)
  heatNumber: number;

  @ApiProperty({ name: "athlete", type: "string", required: true, example: "Rayssa Leal" })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @IsNotEmpty()
  athlete: string;

  // @ApiProperty({ name: "roundSeed", type: "number", example: 1, required: true })
  // @IsNumber()
  // roundSeed: number;

  // @ApiProperty({ name: "heatPosition", type: "number", example: 1, required: true })
  // @IsNumber()
  // heatPosition: number;

  @ApiProperty({ name: "lineScore1", type: "number", example: 10.3, required: true, default: 0 })
  @IsNumber()
  lineScore1: number;

  @ApiProperty({ name: "lineScore2", type: "number", example: 10.3, required: true, default: 0 })
  @IsNumber()
  lineScore2: number;

  @ApiProperty({ name: "roundScore", type: "number", example: 10.3, required: true, default: 0 })
  @IsNumber()
  roundScore: number;

  @ApiProperty({
    name: "trick1Score",
    type: "number",
    example: 10.3,
    required: false,
    default: null,
  })
  @IsNumber()
  @ValidateIf((_, value) => value !== null)
  trick1Score: number;

  @ApiProperty({
    name: "trick2Score",
    type: "number",
    example: 10.3,
    required: false,
    default: null,
  })
  @IsNumber()
  @ValidateIf((_, value) => value !== null)
  trick2Score: number;

  @ApiProperty({
    name: "trick3Score",
    type: "number",
    example: 10.3,
    required: false,
    default: null,
  })
  @IsNumber()
  @ValidateIf((_, value) => value !== null)
  trick3Score: number;

  @ApiProperty({
    name: "trick4Score",
    type: "number",
    example: 10.3,
    required: false,
    default: null,
  })
  @IsNumber()
  @ValidateIf((_, value) => value !== null)
  trick4Score: number;

  @ApiProperty({
    name: "trick5Score",
    type: "number",
    example: 10.3,
    required: false,
    default: null,
  })
  @IsNumber()
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  trick5Score: number;

  @ApiProperty({
    name: "trick6Score",
    type: "number",
    example: 10.3,
    required: false,
    default: null,
  })
  @IsNumber()
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  trick6Score: number;

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

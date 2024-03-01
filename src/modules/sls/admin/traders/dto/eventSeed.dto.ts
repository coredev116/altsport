import { ApiProperty } from "@nestjs/swagger";
import {
  IsNumber,
  IsString,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  Min,
  IsEnum,
  IsOptional,
} from "class-validator";
import { Type, Transform, TransformFnParams } from "class-transformer";
import { AthleteStatus } from "../../../../../constants/system";

class EventSeedItem {
  @ApiProperty({
    type: "string",
    required: true,
    example: "Rayssa",
  })
  @Transform(({ value }: TransformFnParams) => value?.trim().replace(/'/g, ""))
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    type: "string",
    example: "J",
  })
  @Transform(({ value }: TransformFnParams) => value?.trim().replace(/'/g, ""))
  @IsString()
  @IsOptional()
  middleName: string;

  @ApiProperty({
    type: "string",
    example: "Leal",
  })
  @Transform(({ value }: TransformFnParams) => value?.trim().replace(/'/g, ""))
  @IsString()
  @IsOptional()
  lastName: string;

  @ApiProperty({ name: "gender", type: "string", required: true, example: "women" })
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  gender: string;

  @ApiProperty({ name: "playerStatus", type: "number", example: AthleteStatus.ACTIVE })
  @IsNumber()
  @IsEnum(AthleteStatus)
  playerStatus: AthleteStatus;

  @ApiProperty({ name: "stance", type: "string", example: "Regular" })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  stance: string;

  @ApiProperty({ name: "nationality", type: "string", example: "Japan" })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  nationality: string;

  @ApiProperty({ type: "number", example: 1, required: true })
  @IsNumber()
  @Min(0)
  seed: number;

  @ApiProperty({
    type: "string",
    required: true,
    example: "SLS Salt Lake City",
  })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @IsNotEmpty()
  eventName: string;

  @ApiProperty({ name: "notes", type: "string", example: "Replacing Seth Moniz for event." })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @IsOptional()
  notes: string;

  @ApiProperty({ type: "number", example: 2022, required: true })
  @IsNumber()
  leagueYear: number;

  @ApiProperty({ type: "number", example: 30.2, required: true })
  @IsNumber()
  @Min(0)
  baseRoundScore: number;

  @ApiProperty({ type: "number", example: 10.2, required: true })
  @IsNumber()
  @Min(0)
  baseRunScore: number;
  @ApiProperty({ type: "number", example: 10.2, required: true })
  @IsNumber()
  @Min(0)
  baseTrickScore: number;

  @ApiProperty({ type: "number", example: 0, required: true })
  @IsNumber()
  @Min(0)
  trickCompletion: number;
}

export default class EventSeed {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EventSeedItem)
  @ApiProperty({ name: "items", type: EventSeedItem, required: true, isArray: true })
  items: EventSeedItem[];
}

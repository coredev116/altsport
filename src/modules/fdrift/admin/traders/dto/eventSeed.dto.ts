import { ApiProperty } from "@nestjs/swagger";
import {
  IsNumber,
  IsString,
  IsNotEmpty,
  IsArray,
  IsEnum,
  ValidateNested,
  Min,
  IsOptional,
} from "class-validator";
import { Type, Transform, TransformFnParams } from "class-transformer";
import { AthleteStatus } from "../../../../../constants/system";

class EventSeedItem {
  @ApiProperty({ name: "firstName", type: "string", required: true, example: "Jack" })
  // @Transform(({ value }: TransformFnParams) => value?.trim().replace(/'/g, ""))
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ name: "middleName", type: "string", example: "" })
  // @Transform(({ value }: TransformFnParams) => value?.trim().replace(/'/g, ""))
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @IsOptional()
  middleName: string;

  @ApiProperty({ name: "lastName", type: "string", example: "Robinson" })
  // @Transform(({ value }: TransformFnParams) => value?.trim().replace(/'/g, ""))
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @IsOptional()
  lastName: string;

  @ApiProperty({ name: "gender", type: "string", required: true, example: "men" })
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  gender: string;

  @ApiProperty({ name: "nationality", type: "string", example: "USA" })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  nationality: string;

  @ApiProperty({ name: "stance", type: "string", example: "Regular" })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  stance: string;

  @ApiProperty({ name: "playerStatus", type: "number", example: AthleteStatus.ACTIVE })
  @IsNumber()
  @IsEnum(AthleteStatus)
  playerStatus: AthleteStatus;

  @ApiProperty({ type: "number", example: 1, required: true })
  @IsNumber()
  @Min(1)
  seed: number;

  @ApiProperty({
    type: "string",
    required: true,
    example: "Billabong Pro Pipeline",
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
  tourYear: number;

  @ApiProperty({ type: "number", example: 30.2, required: true })
  @IsNumber()
  @Min(0)
  baseProjection: number;
}

export default class EventSeed {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EventSeedItem)
  @ApiProperty({ name: "items", type: EventSeedItem, required: true, isArray: true })
  items: EventSeedItem[];
}

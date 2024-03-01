import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsUUID,
  IsInt,
  Min,
  IsNumber,
  ValidateNested,
  IsArray,
  IsBoolean,
} from "class-validator";
import { Type } from "class-transformer";

export class EventOddsDto {
  // @ApiProperty({
  //   name: "eventId",
  //   type: "string",
  //   required: true,
  //   example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  // })
  // @IsUUID()
  // @IsNotEmpty()
  // eventId: string;

  // @ApiProperty({
  //   name: "position",
  //   type: "string",
  //   required: true,
  //   example: "1",
  // })
  // @IsNotEmpty()
  // position: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  position: number;
}

export class HeatOddsDto {
  @ApiProperty({
    name: "eventId",
    type: "string",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  @IsUUID()
  @IsNotEmpty()
  eventId: string;
}

export class UpdateEventOddItem {
  @ApiProperty({
    name: "id",
    type: "string",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    name: "probability",
    type: "decimal",
    example: 0.6,
  })
  @IsNumber()
  @Min(0)
  probability: number;

  @ApiProperty({
    example: true,
    type: "boolean",
    required: true,
    default: false,
    name: "hasModifiedProbability",
  })
  @IsBoolean()
  hasModifiedProbability: boolean;

  @ApiProperty({
    name: "odds",
    type: "decimal",
    example: 1.344,
  })
  @IsNumber()
  @Min(0)
  odds: number;
}

export class UpdateEventOddDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateEventOddItem)
  @ApiProperty({ name: "items", type: UpdateEventOddItem, required: true, isArray: true })
  items: UpdateEventOddItem[];
}

export class UpdateEventHeatOddItem {
  @ApiProperty({
    name: "id",
    type: "string",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    name: "probability",
    type: "decimal",
    example: 0.5,
  })
  @IsNumber()
  @Min(0)
  probability: number;

  @ApiProperty({
    example: true,
    type: "boolean",
    required: true,
    default: false,
    name: "hasModifiedProbability",
  })
  @IsBoolean()
  hasModifiedProbability: boolean;

  @ApiProperty({
    name: "odds",
    type: "decimal",
    example: 1.34343,
  })
  @IsNumber()
  @Min(0)
  odds: number;
}

export class UpdateEventHeatOddDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateEventHeatOddItem)
  @ApiProperty({ name: "items", type: UpdateEventHeatOddItem, required: true, isArray: true })
  items: UpdateEventHeatOddItem[];
}

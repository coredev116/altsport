import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsUUID,
  IsInt,
  Min,
  Max,
  IsNumber,
  ValidateNested,
  IsArray,
  IsBoolean,
} from "class-validator";
import { Type } from "class-transformer";

export class EventOddsDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(3)
  @IsNotEmpty()
  position: number;
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
    name: "hasModifiedProbability",
    example: true,
    type: "boolean",
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
    name: "hasModifiedProbability",
    example: true,
    type: "boolean",
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

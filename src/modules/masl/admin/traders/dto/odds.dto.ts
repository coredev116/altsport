import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsUUID,
  Min,
  IsNumber,
  ValidateNested,
  IsArray,
  IsBoolean,
  IsOptional,
} from "class-validator";
import { Type } from "class-transformer";

export class UpdateOddsItem {
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
    name: "odds",
    type: "decimal",
    example: 1.344,
  })
  @IsNumber()
  @Min(0)
  odds: number;

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
    type: "boolean",
    example: true,
  })
  @IsBoolean()
  hasModifiedProbability: boolean;

  @ApiProperty({
    name: "bias",
    type: "int",
    example: 2,
  })
  @IsNumber()
  @IsOptional()
  bias: number;

  @ApiProperty({
    name: "lean",
    type: "int",
    example: 2,
  })
  @IsNumber()
  @IsOptional()
  lean: number;

  @ApiProperty({
    name: "playerLean",
    type: "int",
    example: 2,
  })
  @IsNumber()
  @IsOptional()
  playerLean: number;

  @ApiProperty({
    name: "max",
    type: "int",
    example: 2,
  })
  @IsNumber()
  @IsOptional()
  max: number;

  @ApiProperty({
    name: "weights",
    type: "int",
    isArray: true,
    example: [0, 0, 1],
  })
  @IsNumber({}, { each: true })
  @IsOptional()
  weights: number[];

  @ApiProperty({
    name: "calculatedValue",
    type: "decimal",
    example: 1.344,
  })
  @IsNumber()
  @IsOptional()
  calculatedValue: number;

  @ApiProperty({
    name: "isMarketActive",
    type: "boolean",
    example: true,
  })
  @IsBoolean()
  isMarketActive: boolean;

  @ApiProperty({
    name: "isSubMarketLocked",
    type: "boolean",
    example: true,
  })
  @IsBoolean()
  isSubMarketLocked: boolean;
}

export class UpdateOddsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateOddsItem)
  @ApiProperty({ name: "items", type: UpdateOddsItem, required: true, isArray: true })
  items: UpdateOddsItem[];
}

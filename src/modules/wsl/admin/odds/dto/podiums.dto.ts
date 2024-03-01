import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsUUID,
  Min,
  IsNumber,
  ValidateNested,
  IsArray,
  IsBoolean,
} from "class-validator";
import { Type } from "class-transformer";

export class UpdateEventPodiumsItem {
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

export class UpdateEventPodiumsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateEventPodiumsItem)
  @ApiProperty({ name: "items", type: UpdateEventPodiumsItem, required: true, isArray: true })
  items: UpdateEventPodiumsItem[];
}

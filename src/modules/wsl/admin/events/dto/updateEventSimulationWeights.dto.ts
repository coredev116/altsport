import { ApiProperty } from "@nestjs/swagger";
import { Transform, TransformFnParams, Type } from "class-transformer";
import {
  IsNumber,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  ValidateNested,
} from "class-validator";

import { SimulationWeightTypes } from "../../../../../constants/system";

export class EventSimulationWeightsItemDto {
  @ApiProperty({
    name: "type",
    type: "string",
    example: SimulationWeightTypes.LOCATION,
    required: true,
    enum: SimulationWeightTypes,
  })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  type: string;

  @ApiProperty({
    name: "location",
    type: "string",
    example: "Banzai Pipeline",
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  location: string;

  @ApiProperty({
    name: "year",
    type: "number",
    example: 2022,
  })
  @IsNumber()
  @IsOptional()
  year: number;

  @ApiProperty({
    name: "weight",
    type: "number",
    example: 12.5,
    required: false,
  })
  @IsNumber()
  weight: number;
}

export default class EventSimulationWeightsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EventSimulationWeightsItemDto)
  @ApiProperty({
    name: "items",
    type: EventSimulationWeightsItemDto,
    required: true,
    isArray: true,
  })
  items: EventSimulationWeightsItemDto[];
}

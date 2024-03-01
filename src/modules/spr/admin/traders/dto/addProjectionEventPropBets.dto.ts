import { ApiProperty } from "@nestjs/swagger";
import {
  IsNumber,
  IsString,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  Min,
  IsOptional,
} from "class-validator";
import { Type, Transform, TransformFnParams } from "class-transformer";

class ProjectionEventPropBetsItem {
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
  @IsNotEmpty()
  year: number;

  @ApiProperty({ type: "string", required: true, example: "men" })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @IsNotEmpty()
  gender: string;

  @ApiProperty({
    type: "string",
    required: true,
    example: "Martin Castelo",
  })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @IsOptional()
  athlete: string;

  @ApiProperty({ type: "number", example: 10.2, required: true })
  @IsNumber()
  @Min(0)
  odds: number;

  @ApiProperty({ type: "string", required: true, example: "Goes off road" })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @IsNotEmpty()
  proposition: string;
}

export default class ProjectionEventPropBetsOdds {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectionEventPropBetsItem)
  @ApiProperty({
    name: "items",
    type: ProjectionEventPropBetsItem,
    required: true,
    isArray: true,
  })
  items: ProjectionEventPropBetsItem[];
}

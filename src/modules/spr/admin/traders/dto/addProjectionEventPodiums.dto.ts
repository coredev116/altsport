import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, IsNotEmpty, IsArray, ValidateNested, Min } from "class-validator";
import { Type, Transform, TransformFnParams } from "class-transformer";

class ProjectionEventPodiumsOddsItem {
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
  year: number;

  @ApiProperty({ type: "string", required: true, example: "men" })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  gender: string;

  @ApiProperty({
    type: "string",
    required: true,
    example: "Martin Castelo",
  })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @IsNotEmpty()
  athlete: string;

  @ApiProperty({ type: "number", example: 10.2, required: true })
  @IsNumber()
  @Min(0)
  odds: number;
}

export default class ProjectionEventPodiumsOdds {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectionEventPodiumsOddsItem)
  @ApiProperty({
    name: "items",
    type: ProjectionEventPodiumsOddsItem,
    required: true,
    isArray: true,
  })
  items: ProjectionEventPodiumsOddsItem[];
}

import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, IsNotEmpty, IsArray, ValidateNested, Min } from "class-validator";
import { Type, Transform, TransformFnParams } from "class-transformer";

class ProjectionEventShowsOddsItem {
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

export default class ProjectionEventShowsOdds {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectionEventShowsOddsItem)
  @ApiProperty({
    name: "items",
    type: ProjectionEventShowsOddsItem,
    required: true,
    isArray: true,
  })
  items: ProjectionEventShowsOddsItem[];
}

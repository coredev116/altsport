import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, IsNotEmpty, IsArray, ValidateNested } from "class-validator";
import { Type, Transform, TransformFnParams } from "class-transformer";

class LeagueItemDto {
  @ApiProperty({
    name: "name",
    type: "string",
    required: true,
    example: "SLS",
  })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ name: "year", type: "number", required: true, example: 2022 })
  @IsNumber()
  year: number;

  @ApiProperty({ name: "gender", type: "string", required: true, example: "women" })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @IsNotEmpty()
  gender: string;
}

export default class LeagueDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LeagueItemDto)
  @ApiProperty({ name: "items", type: LeagueItemDto, required: true, isArray: true })
  items: LeagueItemDto[];
}

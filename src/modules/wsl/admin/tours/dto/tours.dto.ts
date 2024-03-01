import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, IsNotEmpty, IsArray, ValidateNested } from "class-validator";
import { Type, Transform, TransformFnParams } from "class-transformer";

class TourItemDto {
  @ApiProperty({
    name: "name",
    type: "string",
    required: true,
    example: "Men's Championship Tour",
  })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ name: "year", type: "number", required: true, example: 2022 })
  @IsNumber()
  year: number;

  @ApiProperty({ name: "gender", type: "string", required: true, example: "male" })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @IsNotEmpty()
  gender: string;
}

export default class TourDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TourItemDto)
  @ApiProperty({ name: "items", type: TourItemDto, required: true, isArray: true })
  items: TourItemDto[];
}

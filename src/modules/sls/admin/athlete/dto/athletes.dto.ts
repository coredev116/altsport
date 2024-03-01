import { ApiProperty } from "@nestjs/swagger";
import { Type, Transform, TransformFnParams } from "class-transformer";
import { IsString, IsNotEmpty, IsArray, ValidateNested, IsOptional } from "class-validator";

class AthleteItemDto {
  @ApiProperty({ name: "firstName", type: "string", required: true, example: "Rayassa" })
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  firstName: string;

  @ApiProperty({ name: "middleName", type: "string", required: false, example: "J" })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  middleName: string;

  @ApiProperty({ name: "lastName", type: "string", required: false, example: "Leal" })
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  lastName: string;

  @ApiProperty({ name: "gender", type: "string", required: true, example: "women" })
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  gender: string;
}

export default class AthleteDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AthleteItemDto)
  @ApiProperty({ name: "items", type: AthleteItemDto, required: true, isArray: true })
  items: AthleteItemDto[];
}

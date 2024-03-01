import { ApiProperty } from "@nestjs/swagger";
import {
  IsNumber,
  IsString,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsOptional,
  Min,
} from "class-validator";
import { Type, Transform, TransformFnParams } from "class-transformer";

class ResultItemDto {
  @ApiProperty({ name: "firstName", type: "string", required: true, example: "Filipe" })
  @Transform(({ value }: TransformFnParams) => value?.trim().replace(/'/g, ""))
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ name: "middleName", type: "string", example: "C" })
  @Transform(({ value }: TransformFnParams) => value?.trim().replace(/'/g, ""))
  @IsString()
  @IsOptional()
  middleName: string;

  @ApiProperty({ name: "lastName", type: "string", example: "Toledo" })
  @Transform(({ value }: TransformFnParams) => value?.trim().replace(/'/g, ""))
  @IsString()
  @IsOptional()
  lastName: string;

  @ApiProperty({
    name: "eventName",
    type: "string",
    required: true,
    example: "Corona Open J-Bay",
  })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @IsNotEmpty()
  eventName: string;

  @ApiProperty({ type: "number", example: 2022, required: true })
  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
  })
  eventYear: number;

  @ApiProperty({ type: "number", example: 6, required: true })
  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
  })
  @Min(0)
  eventRank: number;

  @ApiProperty({ type: "number", example: 12.2, required: true })
  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
  })
  @Min(0)
  eventPoints: number;
}

export default class ResultDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ResultItemDto)
  @ApiProperty({ name: "items", type: ResultItemDto, required: true, isArray: true })
  items: ResultItemDto[];
}

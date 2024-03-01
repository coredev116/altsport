import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export default class TourDto {
  @ApiProperty({
    name: "name",
    type: "string",
    required: true,
    example: "KTM Junior Motocross",
  })
  @IsString()
  name: string;

  @ApiProperty({ name: "year", type: "number", required: true, example: 2022 })
  @IsNumber()
  year: number;

  @ApiProperty({ name: "gender", type: "string", required: false, example: "men" })
  @IsString()
  gender: string;
}

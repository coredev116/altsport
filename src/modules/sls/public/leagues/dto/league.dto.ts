import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export default class LeagueDto {
  @ApiProperty({
    name: "name",
    type: "string",
    required: true,
    example: "Street League Skateboarding",
  })
  @IsString()
  name: string;

  @ApiProperty({ name: "year", type: "number", required: true, example: 2022 })
  @IsNumber()
  year: number;

  @ApiProperty({ name: "gender", type: "string", required: false, example: "male" })
  @IsString()
  gender: string;
}

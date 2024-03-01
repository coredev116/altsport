import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export default class League {
  @ApiProperty({
    name: "id",
    type: "string",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  id: string;

  @ApiProperty({
    name: "name",
    type: "string",
    required: true,
    example: "SLS",
  })
  @IsString()
  name: string;

  @ApiProperty({
    name: "gender",
    type: "string",
    required: true,
    example: "women",
  })
  @IsString()
  gender: string;
}

import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export default class Tour {
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
    example: "MotoGP Tour",
  })
  @IsString()
  name: string;

  @ApiProperty({
    name: "gender",
    type: "string",
    required: true,
    example: "male",
  })
  @IsString()
  gender: string;
}

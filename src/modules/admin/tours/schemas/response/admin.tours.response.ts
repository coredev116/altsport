import { ApiProperty } from "@nestjs/swagger";

class AdminTourYearsResponse {
  @ApiProperty({
    name: "id",
    type: "string",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  id: string;

  @ApiProperty({ name: "year", type: "number", format: "int", example: 2019 })
  year: number;
}

export default class AdminToursResponse {
  @ApiProperty({
    name: "id",
    type: "string",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  id: string;

  @ApiProperty({ name: "name", type: "string", example: "Men's Championship Tour" })
  name: string;

  @ApiProperty({ name: "gender", type: "string", example: "male" })
  gender: string;

  @ApiProperty({ type: AdminTourYearsResponse, isArray: true })
  years: AdminTourYearsResponse[];
}

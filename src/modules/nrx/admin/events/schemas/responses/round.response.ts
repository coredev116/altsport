import { ApiProperty } from "@nestjs/swagger";

import Heat from "./heat.response";

export default class Round {
  @ApiProperty({
    name: "id",
    type: "string",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  id: string;

  @ApiProperty({ name: "name", type: "string", required: true, example: "Seeding Round" })
  name: string;

  @ApiProperty({ name: "roundNo", type: "number", required: true, example: 1 })
  roundNo: number;

  @ApiProperty({ name: "roundStatus", type: "number", required: true, example: 1 })
  roundStatus: number;

  @ApiProperty({
    name: "startDate",
    type: "string",
    format: "date",
    required: false,
    example: "2022-04-18T15:25:24Z",
  })
  startDate: Date;

  @ApiProperty({
    name: "endDate",
    type: "string",
    format: "date",
    required: false,
    example: "2022-04-18T15:25:24Z",
  })
  endDate: Date;

  @ApiProperty({ type: Heat, isArray: true })
  heats: Heat[];
}

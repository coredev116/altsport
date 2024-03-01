import { ApiProperty } from "@nestjs/swagger";

export default class Heat {
  @ApiProperty({
    name: "id",
    type: "string",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  id: string;

  @ApiProperty({ name: "heatName", type: "string", required: true, example: "Heat 1" })
  heatName: string;

  @ApiProperty({ name: "heatNo", type: "number", example: 1, required: true })
  heatNo: number;

  @ApiProperty({ name: "heatStatus", type: "number", example: 1, required: false })
  heatStatus: number;

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
}

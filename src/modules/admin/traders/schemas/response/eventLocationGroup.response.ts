import { ApiProperty } from "@nestjs/swagger";

export default class AdminEventLocationResponse {
  @ApiProperty({
    name: "id",
    type: "string",
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  id: string;

  @ApiProperty({ name: "eventLocationGroup", type: "string", example: "Margaret River Pro" })
  eventLocationGroup: string;
}

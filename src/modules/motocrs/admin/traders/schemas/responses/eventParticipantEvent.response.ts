import { ApiProperty } from "@nestjs/swagger";

export default class EventParticipantEvent {
  @ApiProperty({
    name: "id",
    type: "string",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  id: string;

  @ApiProperty({ name: "eventStatus", type: "number", example: 2 })
  eventStatus: number;

  @ApiProperty({ name: "name", type: "string", example: "Pro Pipeline" })
  name: string;

  @ApiProperty({
    name: "tourId",
    type: "string",
    example: "335d414b-8d24-49d2-a9d8-57ec650a6d1a",
  })
  tourId: string;

  @ApiProperty({
    name: "tourYearId",
    type: "string",
    example: "422e414b-8d24-49d2-a9d8-57ec650e2a4c",
  })
  tourYearId: string;

  @ApiProperty({ name: "tourYear", type: "number", example: 2022 })
  tourYear: number;

  @ApiProperty({ name: "tourGender", type: "string", example: "men" })
  tourGender: string;
}

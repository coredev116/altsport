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

  @ApiProperty({ name: "name", type: "string", example: "SLS Salt Lake City" })
  name: string;

  @ApiProperty({
    name: "leagueId",
    type: "string",
    example: "335d414b-8d24-49d2-a9d8-57ec650a6d1a",
  })
  leagueId: string;

  @ApiProperty({
    name: "leagueYearId",
    type: "string",
    example: "422e414b-8d24-49d2-a9d8-57ec650e2a4c",
  })
  leagueYearId: string;

  @ApiProperty({ name: "leagueYear", type: "number", example: 2022 })
  leagueYear: number;

  @ApiProperty({ name: "leagueGender", type: "string", example: "men" })
  leagueGender: string;
}

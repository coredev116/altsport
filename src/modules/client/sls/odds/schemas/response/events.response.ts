import { ApiProperty } from "@nestjs/swagger";
import League from "./league.response";

class OddMarkets {
  @ApiProperty({
    type: "boolean",
  })
  eventWinner?: boolean;

  @ApiProperty({
    type: "boolean",
  })
  heatWinner?: boolean;

  @ApiProperty({
    type: "boolean",
  })
  headToHead?: boolean;

  @ApiProperty({
    type: "boolean",
  })
  shows?: boolean;

  @ApiProperty({
    type: "boolean",
  })
  podiums?: boolean;

  @ApiProperty({
    type: "boolean",
  })
  propBets?: boolean;
}

export default class EventsResponse {
  @ApiProperty({
    name: "id",
    type: "string",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  id: string;

  @ApiProperty({ name: "name", type: "string", required: true, example: "SLS Salt Lake City" })
  name: string;

  @ApiProperty({ name: "sportType", type: "string", required: true, example: "sls" })
  sportType: string;

  @ApiProperty({
    name: "startDate",
    type: "string",
    format: "date",
    example: "2022-04-18T15:25:24Z",
    required: false,
  })
  startDate: Date;

  @ApiProperty({
    name: "endDate",
    type: "string",
    format: "date",
    example: "2022-04-18T15:25:24Z",
    required: false,
  })
  endDate: Date;

  //   @ApiProperty({ name: "eventNumber", type: "number", example: 1, required: true })
  //   eventNumber: number;

  @ApiProperty({ name: "year", type: "number", example: 2022, required: true })
  year: number;

  @ApiProperty({
    name: "eventLocation",
    type: "string",
    required: true,
    example: "Salt Lake City, Utah, USA",
  })
  eventLocation: string;

  @ApiProperty({ name: "eventStatus", type: "number", example: 1, required: false })
  eventStatus: number;

  // @ApiProperty({
  //   name: "eventLocationGroup",
  //   type: "string",
  //   required: false,
  //   example: "Margaret River",
  // })
  // eventLocationGroup: string;

  @ApiProperty({ type: League })
  league: League;

  @ApiProperty({ type: OddMarkets })
  markets: OddMarkets;
}

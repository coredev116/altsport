import { ApiProperty } from "@nestjs/swagger";

import Tour from "./tour.response";

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

  @ApiProperty({ name: "name", type: "string", required: true, example: "Arlington 3" })
  name: string;

  @ApiProperty({ name: "sportType", type: "string", required: true, example: "spr" })
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

  @ApiProperty({ name: "eventNumber", type: "number", example: 1, required: true })
  eventNumber: number;

  @ApiProperty({ name: "year", type: "number", example: 2022, required: true })
  year: number;

  @ApiProperty({
    name: "eventLocation",
    type: "string",
    required: true,
    example: "Arlington",
  })
  eventLocation: string;

  @ApiProperty({
    name: "eventLocationGroup",
    type: "string",
    required: false,
    example: "Arlington",
  })
  eventLocationGroup: string;

  @ApiProperty({ name: "eventStatus", type: "number", example: 1, required: false })
  eventStatus: number;

  @ApiProperty({ type: Tour })
  tour: Tour;

  @ApiProperty({ type: OddMarkets })
  markets: OddMarkets;
}

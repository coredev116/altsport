import { ApiProperty } from "@nestjs/swagger";

import Tour from "./tour.response";

export default class EventsResponse {
  @ApiProperty({
    name: "id",
    type: "string",
    required: true,
    example: "11-25-2022",
  })
  id: string;

  @ApiProperty({ name: "name", type: "string", required: true, example: "November 25 (1 matches)" })
  name: string;

  @ApiProperty({ name: "sportType", type: "string", required: true, example: "masl" })
  sportType: string;

  @ApiProperty({
    name: "startDate",
    type: "string",
    format: "date",
    example: "2022-04-18T15:25:24Z",
    required: true,
  })
  startDate: Date;

  @ApiProperty({
    name: "endDate",
    type: "string",
    format: "date",
    example: "2022-04-18T15:25:24Z",
    required: true,
  })
  endDate: Date;

  @ApiProperty({ name: "year", type: "number", example: 2022, required: true })
  year: number;

  @ApiProperty({
    name: "eventLocation",
    type: "string",
    required: true,
    example: "SECU Arena",
  })
  eventLocation: string;

  @ApiProperty({
    name: "eventLocationGroup",
    type: "string",
    required: true,
    example: "SECU Arena",
  })
  eventLocationGroup: string;

  @ApiProperty({ name: "eventStatus", type: "number", example: 1, required: false })
  eventStatus: number;

  @ApiProperty({
    name: "eventNumber",
    type: "number",
    example: 1,
    default: 1,
    required: true,
  })
  eventNumber: number;

  @ApiProperty({ type: Tour })
  tour: Tour;
}

import { ApiProperty } from "@nestjs/swagger";

class TourMatchesResponse {
  @ApiProperty({
    name: "id",
    type: "string",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  id: string;

  @ApiProperty({ name: "homeTeam", type: "string", example: "CYCLONES" })
  homeTeam: string;

  @ApiProperty({ name: "awayTeam", type: "string", example: "CHARGERS" })
  awayTeam: string;

  @ApiProperty({
    name: "startDate",
    type: "string",
    format: "date",
    example: "2022-04-18T15:25:24Z",
  })
  startDate: Date;

  @ApiProperty({
    name: "endDate",
    type: "string",
    format: "date",
    example: "2022-04-18T15:25:24Z",
  })
  endDate: Date;

  @ApiProperty({ name: "eventStatus", type: "number", format: "int", example: 1 })
  eventStatus: number;
}

class TourEventsResponse {
  @ApiProperty({
    name: "id",
    type: "string",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  id: string;

  @ApiProperty({ name: "name", type: "string", example: "Rip Curl Newcastle Cup" })
  name: string;

  @ApiProperty({ name: "eventStatus", type: "number", format: "int", example: 1 })
  eventStatus?: number;

  @ApiProperty({
    name: "startDate",
    type: "string",
    format: "date",
    example: "2022-04-18T15:25:24Z",
  })
  startDate?: Date;

  @ApiProperty({
    name: "endDate",
    type: "string",
    format: "date",
    example: "2022-04-18T15:25:24Z",
  })
  endDate?: Date;

  @ApiProperty({ type: TourMatchesResponse, isArray: true, required: false })
  matches?: TourMatchesResponse[];
}

class TourYearsResponse {
  @ApiProperty({ name: "year", type: "number", format: "int", example: 2019 })
  year: number;

  @ApiProperty({ type: TourEventsResponse, isArray: true })
  events: TourEventsResponse[];
}

class TourResponse {
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

  @ApiProperty({ type: TourYearsResponse, isArray: true })
  years: TourYearsResponse[];
}

export default class SportsResponse {
  @ApiProperty({
    name: "id",
    type: "string",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  id: string;

  @ApiProperty({ name: "name", type: "string", example: "World Surf League" })
  name: string;

  @ApiProperty({ name: "sportType", type: "string", example: "wsl" })
  sportType: string;

  @ApiProperty({ type: TourResponse, isArray: true })
  tours: TourResponse[];

  @ApiProperty({ type: TourResponse, isArray: true })
  leagues: TourResponse[];
}

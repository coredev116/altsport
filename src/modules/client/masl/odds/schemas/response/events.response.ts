import { ApiProperty } from "@nestjs/swagger";

import Teams from "./teams.response";

import { RoundStatus, EventStatus } from "../../../../../../constants/system";

class Tour {
  @ApiProperty({ name: "name", type: "string", example: "Major Arena Soccer League" })
  name: string;
}

class TourYear {
  @ApiProperty({ name: "year", type: "integer", example: 2021 })
  year: number;

  @ApiProperty({
    type: Tour,
  })
  tour: Tour;
}

class Rounds {
  @ApiProperty({
    name: "id",
    type: "string",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  id: string;

  @ApiProperty({ name: "name", type: "string", example: "Q1" })
  name: string;

  @ApiProperty({ name: "roundNo", type: "integer", example: 1 })
  roundNo: number;
}

class Scores {
  @ApiProperty({
    name: "id",
    type: "string",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  id: string;

  @ApiProperty({
    name: "teamId",
    type: "string",
    required: true,
    example: "c47a24b5-3c68-4884-9e97-b575ab1771cf",
  })
  teamId: string;

  @ApiProperty({ name: "score", type: "integer", example: 1 })
  score: number;
}

export class EventRounds {
  @ApiProperty({
    name: "id",
    type: "string",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  id: string;

  @ApiProperty({
    name: "name",
    type: "string",
    required: true,
    example: "Q1",
  })
  name: string;

  @ApiProperty({ name: "roundNo", type: "integer", example: 1 })
  roundNo: number;

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

  @ApiProperty({ name: "roundStatus", type: "number", example: 1, enum: RoundStatus })
  roundStatus: RoundStatus;

  @ApiProperty({
    type: Scores,
    isArray: true,
  })
  scores: Scores[];
}

export class Event {
  @ApiProperty({
    name: "id",
    type: "string",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  id: string;

  @ApiProperty({ name: "eventNumber", type: "integer", example: 1 })
  eventNumber: number;

  @ApiProperty({
    type: "string",
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  winnerTeamId: string;

  @ApiProperty({
    type: "string",
    example: "3",
  })
  providerId: string;

  @ApiProperty({ name: "name", type: "string", example: "Strykers vs Sidekicks" })
  name: string;

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

  @ApiProperty({
    name: "eventLocation",
    type: "string",
    required: true,
    example: "Toyota Arena",
  })
  eventLocation: string;

  @ApiProperty({ name: "eventStatus", type: "number", example: 1, enum: EventStatus })
  eventStatus: EventStatus;

  @ApiProperty({
    type: TourYear,
  })
  tourYear: TourYear;

  @ApiProperty({
    type: EventRounds,
    isArray: true,
  })
  rounds: EventRounds[];

  @ApiProperty({
    type: Teams,
    isArray: true,
  })
  teams: Teams[];
}

export class SummaryMatches {
  @ApiProperty({
    name: "id",
    type: "string",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  id: string;

  @ApiProperty({ name: "eventNumber", type: "integer", example: 1 })
  eventNumber: number;

  @ApiProperty({
    type: "string",
    example: "3",
  })
  providerMatchId: string;

  @ApiProperty({ name: "homeTeamName", type: "string", example: "Strykers" })
  homeTeamName: string;

  @ApiProperty({ name: "homeTeamGoals", type: "integer", example: 5 })
  homeTeamGoals: number;

  @ApiProperty({ name: "awayTeamName", type: "string", example: "Sidekicks" })
  awayTeamName: string;

  @ApiProperty({ name: "awayTeamGoals", type: "integer", example: 1 })
  awayTeamGoals: number;

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

  @ApiProperty({ name: "statusText", type: "string", example: "Upcoming" })
  statusText: string;

  @ApiProperty({ name: "status", type: "number", example: 1 })
  status: number;
}

export class Summary {
  @ApiProperty({ name: "name", type: "string", example: "MASL January 7, 2023 (4 matches)" })
  name: string;

  @ApiProperty({ name: "dayStatus", type: "number", example: 1, enum: EventStatus })
  dayStatus: EventStatus;

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

  @ApiProperty({ name: "tourName", type: "string", example: "Major Arena Soccer League" })
  tourName: string;

  @ApiProperty({ name: "year", type: "number", example: 2023 })
  year: number;

  @ApiProperty({
    type: SummaryMatches,
    isArray: true,
  })
  matches: SummaryMatches[];
}

export class MASLEventsResponse {
  @ApiProperty({
    name: "id",
    type: "string",
    example: "05-08-2023",
  })
  id: string;

  @ApiProperty({
    type: Rounds,
    isArray: true,
    description: "A list of all rounds irrespective of the current event",
  })
  rounds: Rounds[];

  @ApiProperty({
    type: Summary,
  })
  summary: Summary;

  @ApiProperty({
    type: Event,
    isArray: true,
  })
  events: Event[];
}

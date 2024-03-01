import { ApiProperty } from "@nestjs/swagger";

import Teams from "./teams.response";

import { RoundStatus, EventStatus } from "../../../../../../constants/system";

// class Rounds {
//   @ApiProperty({
//     name: "id",
//     type: "string",
//     required: true,
//     example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
//   })
//   id: string;

//   @ApiProperty({ name: "name", type: "string", example: "Q1" })
//   name: string;
// }

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

class EventRounds {
  @ApiProperty({
    name: "id",
    type: "string",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  id: string;

  @ApiProperty({
    type: "string",
    example: "3",
  })
  providerRoundId: string;

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

  @ApiProperty({ name: "name", type: "string", example: "Q1" })
  name: string;

  @ApiProperty({
    type: Scores,
    isArray: true,
  })
  scores: Scores[];
}

// class League {
//   @ApiProperty({
//     name: "id",
//     type: "string",
//     required: true,
//     example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
//   })
//   id: string;

//   @ApiProperty({ name: "name", type: "string", example: "Major Arena Soccer League" })
//   name: string;
// }

// class LeagueYear {
//   @ApiProperty({
//     name: "id",
//     type: "string",
//     required: true,
//     example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
//   })
//   id: string;

//   @ApiProperty({ name: "year", type: "integer", example: 2023 })
//   year: number;

//   @ApiProperty({
//     type: League,
//   })
//   league: League;
// }

class Event {
  @ApiProperty({
    name: "id",
    type: "string",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  id: string;

  @ApiProperty({
    type: "string",
    example: "3",
  })
  providerMatchId: string;

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

  // @ApiProperty({
  //   type: LeagueYear,
  // })
  // leagueYear: LeagueYear;

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
    type: "string",
    example: "3",
  })
  providerMatchId: string;

  @ApiProperty({ name: "matchType", type: "string", example: "D" })
  matchType: string;

  @ApiProperty({ name: "homeTeamName", type: "string", example: "Strykers" })
  homeTeamName: string;

  // this is actually the athlete name
  @ApiProperty({ name: "homeTeam", type: "string", example: "Bradley" })
  homeTeam: string;

  @ApiProperty({
    type: "string",
    example: "3",
  })
  homeTeamProviderAthlete1Id: string;

  @ApiProperty({
    type: "string",
    example: "3",
  })
  homeTeamProviderAthlete2Id: string;

  @ApiProperty({ name: "homeTeamGoals", type: "integer", example: 5 })
  homeTeamGoals: number;

  @ApiProperty({ name: "homeTeamPoints", type: "decimal", example: 1 })
  homeTeamPoints: number;

  @ApiProperty({ name: "awayTeamName", type: "string", example: "Sidekicks" })
  awayTeamName: string;

  // this is actually the athlete name
  @ApiProperty({ name: "awayTeam", type: "string", example: "Inaki" })
  awayTeam: string;

  @ApiProperty({
    type: "string",
    example: "3",
  })
  awayTeamProviderAthlete1Id: string;

  @ApiProperty({
    type: "string",
    example: "3",
  })
  awayTeamProviderAthlete2Id: string;

  @ApiProperty({ name: "awayTeamGoals", type: "integer", example: 1 })
  awayTeamGoals: number;

  @ApiProperty({ name: "awayTeamPoints", type: "decimal", example: 0 })
  awayTeamPoints: number;

  @ApiProperty({
    name: "startDate",
    type: "string",
    format: "date",
    example: "2022-04-18T15:25:24Z",
    required: false,
  })
  startDate: Date;

  @ApiProperty({ name: "statusText", type: "string", example: "Upcoming" })
  statusText: string;

  @ApiProperty({ name: "status", type: "number", example: 1 })
  status: number;

  @ApiProperty({ name: "lastRound", type: "number", example: 1 })
  lastRound: number;
}

export class Summary {
  @ApiProperty({ type: "string", example: "352317eb-8a92-4a30-97da-b524bee87e45" })
  defaultMatchId: string;

  @ApiProperty({ name: "name", type: "string", example: "JA January 7, 2023 (4 matches)" })
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

export default class JAEventsResponse {
  @ApiProperty({
    name: "id",
    type: "string",
    example: "05-08-2023",
  })
  id: string;

  @ApiProperty({
    type: Summary,
  })
  summary: Summary;

  // @ApiProperty({
  //   type: Rounds,
  //   isArray: true,
  //   description: "A list of all rounds irrespective of the current event",
  // })
  // rounds: Rounds[];

  @ApiProperty({
    type: Event,
    isArray: true,
  })
  events: Event[];
}

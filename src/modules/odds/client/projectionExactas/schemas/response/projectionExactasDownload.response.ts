import { ApiProperty, ApiExtraModels } from "@nestjs/swagger";

import { IExactasParticipants } from "../../../../../../interfaces/markets";

export class Exactas {
  @ApiProperty({
    name: "id",
    type: "string",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  id: string;

  @ApiProperty({
    name: "participants",
    type: "json",
    example: `
        [
            {
            "firstName": "Athlete name",
            "lastName": "Athlete name",
            "eventParticipantId": "a2ac2-0111-4b99-b402-08a19a731eda"
            }
        ]
    `,
  })
  participants: IExactasParticipants[];

  @ApiProperty({
    name: "voided",
    type: "boolean",
    example: true,
    default: false,
  })
  voided: boolean;

  @ApiProperty({
    name: "draw",
    type: "boolean",
    example: true,
    default: false,
  })
  draw: boolean;

  @ApiProperty({
    name: "holdingPercentage",
    type: "number",
    example: 35.5,
    default: 100,
  })
  holdingPercentage: number;

  @ApiProperty({
    name: "odds",
    type: "number",
    example: 11.1,
  })
  odds: number;

  @ApiProperty({
    name: "probability",
    type: "number",
    example: 10.2,
  })
  probability: number;

  @ApiProperty({
    name: "trueProbability",
    type: "number",
    example: 30.9,
  })
  trueProbability: number;

  @ApiProperty({
    name: "hasModifiedProbability",
    type: "boolean",
    example: true,
  })
  hasModifiedProbability: boolean;
}

export class MatchupResponse {
  @ApiProperty({
    name: "eventId",
    type: "string",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  eventId: string;

  @ApiProperty({
    example: "2022-12-27T13:57:53.866Z",
    type: "Date",
  })
  createdAt: Date;

  @ApiProperty({
    type: Object,
    properties: {
      [new Date().toISOString()]: {
        type: "array",
        items: { $ref: "#/components/schemas/Exactas" },
      },
    },
  })
  publishes: Record<string, Exactas>;
}

@ApiExtraModels(Exactas)
export default class EventExactasDownload {
  @ApiProperty({
    type: "string",
    example: "World Surf League",
  })
  sport: string;

  @ApiProperty({
    type: "string",
    example: "Men's Championship Tour",
  })
  tour: string;

  @ApiProperty({
    type: "number",
    example: 2021,
  })
  year: number;

  @ApiProperty({
    type: "string",
    example: "Billabong Pipe Masters",
  })
  eventName: string;

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

  @ApiProperty({
    name: "eventLocation",
    type: "string",
    required: true,
    example: "Banzai Pipeline",
  })
  eventLocation: string;

  @ApiProperty({
    name: "eventLocationGroup",
    type: "string",
    required: false,
    example: "Margaret River",
  })
  eventLocationGroup: string;

  @ApiProperty({ name: "eventStatus", type: "number", example: 1, required: false })
  eventStatus: number;

  @ApiProperty({
    type: MatchupResponse,
    isArray: true,
  })
  matchUps: MatchupResponse[];
}

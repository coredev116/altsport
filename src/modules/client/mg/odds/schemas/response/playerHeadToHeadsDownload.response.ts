import { ApiProperty, ApiExtraModels } from "@nestjs/swagger";

class AthleteResponse {
  @ApiProperty({
    name: "id",
    type: "string",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  id: string;

  @ApiProperty({ name: "firstName", type: "string", example: "Francesco" })
  firstName: string;

  @ApiProperty({ name: "middleName", type: "string", example: "J" })
  middleName: string;

  @ApiProperty({ name: "lastName", type: "string", example: "Bagnaia" })
  lastName: string;
}

export class EventParticipant {
  @ApiProperty({
    name: "id",
    type: "string",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  id: string;

  @ApiProperty({
    name: "position",
    type: "number",
    example: 1,
  })
  position: number;

  @ApiProperty({
    name: "odds",
    type: "number",
    example: 30.5,
  })
  odds: number;

  @ApiProperty({
    name: "odds",
    type: "number",
    example: 30.5,
  })
  probability: number;

  @ApiProperty({
    example: 30.2,
    type: "decimal",
  })
  trueProbability: number;

  @ApiProperty({
    name: "hasModifiedProbability",
    type: "boolean",
    example: true,
  })
  hasModifiedProbability: boolean;

  @ApiProperty({ type: AthleteResponse })
  athlete: AthleteResponse;
}

export class PlayerHeadToHeadsResponse {
  @ApiProperty({ type: EventParticipant })
  eventParticipant1: EventParticipant;

  @ApiProperty({ type: EventParticipant })
  eventParticipant2: EventParticipant;

  @ApiProperty({
    example: 30.5,
    type: "decimal",
  })
  holdingPercentage: number;
}

export class MatchupResponse {
  @ApiProperty({
    name: "id",
    type: "string",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  id: string;

  @ApiProperty({
    name: "eventId",
    type: "string",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  eventId: string;

  @ApiProperty({
    name: "voided",
    type: "boolean",
    example: true,
  })
  voided: boolean;

  @ApiProperty({
    name: "draw",
    type: "boolean",
    example: true,
  })
  draw: boolean;

  @ApiProperty({
    name: "winnerParticipantId",
    type: "string",
    example: "bc8a2ac2-0111-4b99-b402-08a19a731eda",
  })
  winnerParticipantId: string;

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
        items: { $ref: "#/components/schemas/PlayerHeadToHeadsResponse" },
      },
    },
  })
  publishes: Record<string, PlayerHeadToHeadsResponse>;
}

@ApiExtraModels(PlayerHeadToHeadsResponse)
export default class PlayerHeadToHeadsDownload {
  @ApiProperty({
    type: "string",
    example: "Motogp",
  })
  sport: string;

  @ApiProperty({
    type: "string",
    example: "MotoGP Tour",
  })
  tour: string;

  @ApiProperty({
    type: "number",
    example: 2021,
  })
  year: number;

  @ApiProperty({
    type: "string",
    example: "Motul TT Assen",
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
    example: "TT Circuit Assen",
  })
  eventLocation: string;

  @ApiProperty({
    name: "eventLocationGroup",
    type: "string",
    required: false,
    example: "TT Circuit Assen",
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

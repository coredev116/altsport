import { ApiProperty } from "@nestjs/swagger";
import { IsArray } from "class-validator";

import AthleteResponse from "./athlete.response";

class EventParticipant {
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

class PlayerHeadToHeads {
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
    example: "bc8a2ac2-0111-4b99-b402-08a19a731eda",
  })
  eventId: string;

  @ApiProperty({ type: EventParticipant })
  eventParticipant1: EventParticipant;

  @ApiProperty({ type: EventParticipant })
  eventParticipant2: EventParticipant;

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
    example: 30.5,
    type: "decimal",
  })
  holdingPercentage: number;

  @ApiProperty({
    name: "winnerParticipantId",
    type: "string",
    example: "bc8a2ac2-0111-4b99-b402-08a19a731eda",
  })
  winnerParticipantId: string;
}

export default class PlayerHeadToHeadsResponse {
  @ApiProperty({
    name: "clientUpdatedAtDate",
    type: "string",
    format: "date",
    example: "2022-04-18T15:25:24Z",
  })
  clientUpdatedAtDate: Date;

  @ApiProperty({
    name: "traderUpdatedAtDate",
    type: "string",
    format: "date",
    example: "2022-04-18T15:25:24Z",
  })
  traderUpdatedAtDate: Date;

  @ApiProperty({
    type: PlayerHeadToHeads,
    isArray: true,
  })
  odds: PlayerHeadToHeads[];
}

export class PlayerHeadToHeadsPageResponse {
  @ApiProperty({ type: PlayerHeadToHeads })
  @IsArray()
  data: PlayerHeadToHeads[];

  @ApiProperty({
    example: 2,
    type: "integer",
  })
  page: number;

  @ApiProperty({
    example: 30,
    type: "integer",
  })
  total: number;
}

export class PlayerHeadToHeadsPageListingResponse {
  @ApiProperty({
    name: "clientUpdatedAtDate",
    type: "string",
    format: "date",
    example: "2022-04-18T15:25:24Z",
  })
  clientUpdatedAtDate: Date;

  @ApiProperty({
    name: "traderUpdatedAtDate",
    type: "string",
    format: "date",
    example: "2022-04-18T15:25:24Z",
  })
  traderUpdatedAtDate: Date;

  @ApiProperty({ type: PlayerHeadToHeads })
  @IsArray()
  odds: PlayerHeadToHeads[];

  @ApiProperty({
    example: 2,
    type: "integer",
  })
  page: number;

  @ApiProperty({
    example: 30,
    type: "integer",
  })
  total: number;
}

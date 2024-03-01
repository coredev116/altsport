import { ApiProperty } from "@nestjs/swagger";

export class AthleteResponse {
  @ApiProperty({
    name: "id",
    type: "string",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  id: string;

  @ApiProperty({ name: "firstName", type: "string", example: "Rayssa" })
  firstName: string;

  @ApiProperty({ name: "middleName", type: "string", example: "J" })
  middleName: string;

  @ApiProperty({ name: "lastName", type: "string", example: "Leal" })
  lastName: string;

  @ApiProperty({ name: "nationality", type: "string", example: "Japan" })
  nationality: string;

  @ApiProperty({ name: "stance", type: "string", example: "Regular" })
  stance: string;
}

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

  @ApiProperty({ type: AthleteResponse })
  athlete: AthleteResponse;
}

export default class PlayerHeadToHeadsRes {
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
    name: "winnerParticipantId",
    type: "string",
    example: "bc8a2ac2-0111-4b99-b402-08a19a731eda",
  })
  winnerParticipantId: string;

  @ApiProperty({ name: "payout", type: "boolean", example: true, required: false, default: false })
  payout: boolean;

  @ApiProperty({ name: "voided", type: "boolean", example: true, required: false, default: false })
  voided: boolean;

  @ApiProperty({ name: "draw", type: "boolean", example: true, required: false, default: false })
  draw: boolean;
}

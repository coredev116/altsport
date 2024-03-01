import { ApiProperty } from "@nestjs/swagger";

import AthleteResponse from "./athlete.response";
import EventParticipantEvent from "./eventParticipantEvent.response";

export default class EventParticipantResponse {
  @ApiProperty({
    name: "id",
    type: "string",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  id: string;

  @ApiProperty({ name: "seedNo", type: "number", example: 19 })
  seedNo: number;

  @ApiProperty({ name: "baseRoundScore", type: "number", example: 19 })
  baseRoundScore: number;

  @ApiProperty({ name: "baseRunScore", type: "number", example: 19 })
  baseRunScore: number;

  @ApiProperty({ name: "baseTrickScore", type: "number", example: 19 })
  baseTrickScore: number;

  @ApiProperty({ name: "trickCompletion", type: "number", example: 19 })
  trickCompletion: number;

  @ApiProperty({ name: "status", type: "number", example: 1 })
  status: number;

  @ApiProperty({ name: "notes", type: "string", example: "Random text" })
  notes: string;

  @ApiProperty({ type: AthleteResponse })
  athlete: AthleteResponse;

  @ApiProperty({ type: EventParticipantEvent })
  event: EventParticipantEvent;
}

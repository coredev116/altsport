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

  @ApiProperty({ name: "baseProjection", type: "number", example: 19 })
  baseProjection: number;

  @ApiProperty({ name: "status", type: "number", example: 1 })
  status: number;

  @ApiProperty({ type: AthleteResponse })
  athlete: AthleteResponse;

  @ApiProperty({ type: EventParticipantEvent })
  event: EventParticipantEvent;
}

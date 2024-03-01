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

  // @ApiProperty({ name: "baseLapTime", type: "number", example: 19 })
  // baseLapTime: number;
  @ApiProperty({ name: "soloCrashRate", type: "number", example: 19 })
  soloCrashRate: number;

  @ApiProperty({ name: "baseHeadLapTime", type: "number", example: 12 })
  baseHeadLapTime: number;

  @ApiProperty({ name: "headCrashRate", type: "number", example: 6 })
  headCrashRate: number;

  @ApiProperty({ name: "raceCrashRate", type: "number", example: 8 })
  raceCrashRate: number;

  // @ApiProperty({ name: "baseJokerLapTime", type: "number", example: 10 })
  // baseJokerLapTime: number;

  @ApiProperty({ name: "baseNonJokerLapTime", type: "number", example: 9 })
  baseNonJokerLapTime: number;

  @ApiProperty({ name: "status", type: "number", example: 1 })
  status: number;

  @ApiProperty({ name: "notes", type: "string", example: "Random text" })
  notes: string;

  @ApiProperty({ type: AthleteResponse })
  athlete: AthleteResponse;

  @ApiProperty({ type: EventParticipantEvent })
  event: EventParticipantEvent;
}

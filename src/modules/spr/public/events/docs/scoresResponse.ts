import { ApiProperty } from "@nestjs/swagger";

import AthleteResponse from "./athlete.response";

export class RoundScoreResponse {
  @ApiProperty({
    name: "id",
    type: "string",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  id: string;

  @ApiProperty({ name: "roundSeed", type: "number", example: 1 })
  roundSeed: number;

  @ApiProperty({ name: "lapTime", type: "number", example: 66 })
  lapTime: number;

  @ApiProperty({ name: "heatPosition", type: "number", example: 1 })
  heatPosition: number;

  @ApiProperty({ type: AthleteResponse })
  athlete: AthleteResponse;
}

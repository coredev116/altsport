import { ApiProperty } from "@nestjs/swagger";

import AthleteResponse from "./athlete.response";

export default class RoundScoreResponse {
  @ApiProperty({
    name: "id",
    type: "string",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  id: string;

  @ApiProperty({ name: "roundSeed", type: "number", example: 1 })
  roundSeed: number;

  @ApiProperty({ name: "roundScore", type: "number", example: 66 })
  roundScore: number;

  @ApiProperty({ name: "lineScore1", type: "number", example: 66 })
  lineScore1: number;

  @ApiProperty({ name: "lineScore2", type: "number", example: 66 })
  lineScore2: number;

  @ApiProperty({ name: "heatPosition", type: "number", example: 1 })
  heatPosition: number;

  @ApiProperty({ type: AthleteResponse })
  athlete: AthleteResponse;
}

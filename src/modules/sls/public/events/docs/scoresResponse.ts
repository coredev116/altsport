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

  @ApiProperty({ name: "roundScore", type: "number", example: 66 })
  roundScore: number;

  @ApiProperty({ name: "lineScore1", type: "number", example: 66 })
  lineScore1: number;

  @ApiProperty({ name: "lineScore2", type: "number", example: 66 })
  lineScore2: number;

  @ApiProperty({ name: "heatPosition", type: "number", example: 1 })
  heatPosition: number;

  @ApiProperty({
    name: "trick1Score",
    type: "number",
    format: "decimal",
    example: 10.3,
    required: true,
  })
  trick1Score: number;

  @ApiProperty({
    name: "trick2Score",
    type: "number",
    format: "decimal",
    example: 10.3,
    required: true,
  })
  trick2Score: number;

  @ApiProperty({
    name: "trick3Score",
    format: "decimal",
    type: "number",
    example: 10.3,
    required: true,
  })
  trick3Score: number;

  @ApiProperty({
    name: "trick4Score",
    format: "decimal",
    type: "number",
    example: 10.3,
    required: true,
  })
  trick4Score: number;

  @ApiProperty({
    name: "trick5Score",
    format: "decimal",
    type: "number",
    example: 10.3,
    required: true,
  })
  trick5Score: number;

  @ApiProperty({
    name: "trick6Score",
    format: "decimal",
    type: "number",
    example: 10.3,
    required: true,
  })
  trick6Score: number;

  @ApiProperty({ type: AthleteResponse })
  athlete: AthleteResponse;
}

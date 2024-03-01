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

export default class RoundHeatsResponse {
  @ApiProperty({
    name: "id",
    type: "string",
    example: "bc8a2ac2-0111-4b99-b402-08a19a731eda",
  })
  id: string;

  @ApiProperty({
    name: "startDate",
    type: "string",
    format: "date",
    example: "2022-02-18T15:25:24Z",
  })
  startDate: Date;

  @ApiProperty({
    name: "endDate",
    type: "string",
    format: "date",
    example: "2022-04-18T15:25:24Z",
  })
  endDate: Date;

  @ApiProperty({
    name: "heatNo",
    type: "number",
    example: 7,
  })
  heatNo: number;

  @ApiProperty({
    name: "heatName",
    type: "string",
    example: "Heat 1",
  })
  heatName: string;

  @ApiProperty({
    name: "heatStatus",
    type: "number",
    example: 1,
  })
  heatStatus: number;

  @ApiProperty({
    name: "eventId",
    type: "string",
    example: "bc8a2ac2-0111-4b99-b402-08a19a731eda",
  })
  eventId: string;

  @ApiProperty({
    name: "roundId",
    type: "string",
    example: "bc8a2ac2-0111-4b99-b402-08a19a731eda",
  })
  roundId: string;

  @ApiProperty({ name: "scores", type: RoundScoreResponse, isArray: true })
  scores: RoundScoreResponse[];
}

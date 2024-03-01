import { ApiProperty } from "@nestjs/swagger";

import { IExactasParticipants } from "../../../../interfaces/markets";

export default class ProjectionExactasResponse {
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

  @ApiProperty({
    name: "roundHeatId",
    type: "string",
    example: "bc8a2ac2-0111-4b99-b402-08a19a731eda",
  })
  roundHeatId: string;

  @ApiProperty({
    name: "position",
    type: "number",
    example: 2,
  })
  position: number;

  @ApiProperty({
    name: "voided",
    type: "boolean",
    example: true,
    default: false,
  })
  voided: boolean;

  @ApiProperty({
    name: "draw",
    type: "boolean",
    example: true,
    default: false,
  })
  draw: boolean;

  @ApiProperty({
    name: "holdingPercentage",
    type: "number",
    example: 35.5,
    default: 100,
  })
  holdingPercentage: number;

  @ApiProperty({
    name: "odds",
    type: "number",
    example: 30.5,
  })
  odds: number;

  @ApiProperty({
    name: "probability",
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

  @ApiProperty({
    type: Object,
    example: `
    [
        {
        "firstName": "Athlete name",
        "lastName": "Athlete name",
        "eventParticipantId": "a2ac2-0111-4b99-b402-08a19a731eda"
        }
    ]
`,
  })
  participants: IExactasParticipants[];
}

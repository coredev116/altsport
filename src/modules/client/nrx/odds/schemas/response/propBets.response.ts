import { ApiProperty } from "@nestjs/swagger";

import AthleteResponse from "./athlete.response";

export default class PropBetsResponse {
  @ApiProperty({
    name: "id",
    type: "string",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  id: string;

  @ApiProperty({
    example: "2022-12-27T13:57:53.866Z",
    type: "Date",
  })
  startDate: Date;

  @ApiProperty({
    name: "eventParticipantId",
    type: "string",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  eventParticipantId: string;

  @ApiProperty({ name: "proposition", type: "string", required: true, example: "Test" })
  proposition: string;

  @ApiProperty({ name: "odds", type: "number", example: 10.3, required: false, default: 0 })
  odds: number;

  @ApiProperty({ name: "payout", type: "boolean", example: true, required: false, default: false })
  payout: boolean;

  @ApiProperty({ name: "voided", type: "boolean", example: true, required: false, default: false })
  voided: boolean;

  @ApiProperty({ type: AthleteResponse })
  athlete: AthleteResponse;

  @ApiProperty({
    example: "2022-12-27T13:57:53.866Z",
    type: "Date",
  })
  createdAt: Date;

  @ApiProperty({
    example: "2022-12-27T13:57:53.866Z",
    type: "Date",
  })
  updatedAt: Date;
}

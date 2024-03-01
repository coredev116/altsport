import { ApiProperty } from "@nestjs/swagger";

import AthleteResponse from "./athlete.response";

export default class PropBetsResponse {
  @ApiProperty({
    name: "id",
    type: "string",
    required: true,
    example: "c4043e61-6b6e-4576-bd90-a6a6b5fe5d38",
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
    example: "c4043e61-6b6e-4576-bd90-a6a6b5fe5d38",
  })
  eventParticipantId: string;

  @ApiProperty({ name: "proposition", type: "string", required: true, example: "Test" })
  proposition: string;

  @ApiProperty({ name: "odds", type: "number", example: 10.3, required: false, default: 0 })
  odds: number;

  @ApiProperty({ name: "payout", type: "boolean", example: true, required: false, default: false })
  payout: boolean;

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

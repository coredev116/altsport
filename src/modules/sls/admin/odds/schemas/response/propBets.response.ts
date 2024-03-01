import { ApiProperty } from "@nestjs/swagger";

import AthleteResponse from "./athlete.response";

class PropBets {
  @ApiProperty({
    name: "id",
    type: "string",
    required: true,
    example: "c4043e61-6b6e-4576-bd90-a6a6b5fe5d38",
  })
  id: string;

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
}

export default class PropBetsResponse {
  @ApiProperty({
    name: "clientUpdatedAtDate",
    type: "string",
    format: "date",
    example: "2022-04-18T15:25:24Z",
  })
  clientUpdatedAtDate: Date;

  @ApiProperty({
    name: "traderUpdatedAtDate",
    type: "string",
    format: "date",
    example: "2022-04-18T15:25:24Z",
  })
  traderUpdatedAtDate: Date;

  @ApiProperty({
    type: PropBets,
    isArray: true,
  })
  odds: PropBets[];
}

import { ApiProperty } from "@nestjs/swagger";

import AthleteResponse from "./athlete.response";

class PropBets {
  @ApiProperty({
    name: "id",
    type: "string",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  id: string;

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

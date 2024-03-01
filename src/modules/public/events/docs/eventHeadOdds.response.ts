import { ApiProperty } from "@nestjs/swagger";

import { OddMarketStatus } from "../../../../constants/odds";

class EventHeatOddsAthlete {
  @ApiProperty({
    name: "id",
    type: "string",
    example: "2127ea10-6110-4ffd-9403-3e33fc0929de",
  })
  id: string;

  @ApiProperty({
    name: "firstName",
    example: "Jane",
  })
  firstName: string;

  @ApiProperty({
    name: "middleName",
    example: "M",
  })
  middleName: string;

  @ApiProperty({
    name: "lastName",
    example: "Doe",
  })
  lastName: string;

  @ApiProperty({
    name: "gender",
    example: "men",
  })
  gender: string;

  @ApiProperty({
    name: "nationality",
    example: "American",
  })
  nationality: string;

  @ApiProperty({
    name: "stance",
    example: "American",
  })
  stance: string;

  @ApiProperty({
    name: "odds",
    example: 30.2,
  })
  odds: number;

  @ApiProperty({
    name: "probability",
    example: 30.2,
    type: "decimal",
  })
  probability: number;

  @ApiProperty({
    name: "seedNo",
    example: 1,
  })
  seedNo: number;
}

class EventHeatOddsEvent {
  @ApiProperty({
    name: "heatId",
    type: "string",
    example: "2127ea10-6110-4ffd-9403-3e33fc0929de",
    description: "The associated, unique ID for the heat.",
  })
  heatId: string;

  @ApiProperty({
    name: "heatName",
    type: "string",
    example: "Heat 1",
    description: "The name of the heat - for example, Heat 7.",
  })
  heatName: string;

  @ApiProperty({
    name: "heatNo",
    type: "number",
    example: 1,
    description:
      "The sequential number of the heat segment within a round segment, for chronological record.",
  })
  heatNo: number;

  // @ApiProperty({
  //   name: "isHeatWinnerMarketVoided",
  //   type: "boolean",
  //   example: true,
  // })
  // isHeatWinnerMarketVoided: boolean;

  // @ApiProperty({
  //   name: "isHeatWinnerMarketOpen",
  //   type: "boolean",
  //   example: true,
  // })
  // isHeatWinnerMarketOpen: boolean;

  @ApiProperty({
    name: "marketStatus",
    example: OddMarketStatus.VOID,
    description: "The current status of the market.",
    enum: OddMarketStatus,
  })
  marketStatus: string;

  @ApiProperty({
    name: "heatStatus",
    example: "COMPLETED",
    description: "The status of the heat segment.",
  })
  heatStatus: string;

  @ApiProperty({
    name: "athletes",
    type: EventHeatOddsAthlete,
    isArray: true,
  })
  athletes: EventHeatOddsAthlete[];
}

export default class EventHeatOddsResponse {
  @ApiProperty({
    name: "id",
    type: "string",
    example: "2127ea10-6110-4ffd-9403-3e33fc0929de",
    description: "ID related to the odd",
  })
  id: string;

  @ApiProperty({
    name: "roundId",
    type: "string",
    example: "2127ea10-6110-4ffd-9403-3e33fc0929de",
    description: "The associated, unique ID for the round.",
  })
  roundId: string;

  @ApiProperty({
    name: "roundName",
    example: "Semifinal",
    description: "The name of the round segment.",
  })
  roundName: string;

  @ApiProperty({
    name: "roundNo",
    example: 1,
    description:
      "The sequential number of the round segment within a contest, for chronological record.",
  })
  roundNo: number;

  @ApiProperty({
    name: "roundStatus",
    example: "COMPLETED",
    description: "The status of the round segment.",
  })
  roundStatus: string;

  @ApiProperty({
    type: EventHeatOddsEvent,
    isArray: true,
    description:
      "An array of heats for which odds are being, or will be, generated, within the round segment.",
  })
  heats: EventHeatOddsEvent[];
}

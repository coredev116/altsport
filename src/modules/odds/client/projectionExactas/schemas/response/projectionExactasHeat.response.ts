import { ApiProperty } from "@nestjs/swagger";

import { IExactasParticipants } from "../../../../../../interfaces/markets";

class EventHeatOddsAthlete {
  @ApiProperty({
    type: "string",
    example: "ea102755-6110-4ffd-9403-3e33fc0929de",
  })
  heatOddId: string;

  @ApiProperty({
    example: 30.2,
  })
  odds: number;

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
    example: 30.2,
    type: "decimal",
  })
  probability: number;

  @ApiProperty({
    example: 30.2,
    type: "decimal",
  })
  trueProbability: number;

  @ApiProperty({
    example: true,
    type: "boolean",
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

class EventHeatOddsEvent {
  @ApiProperty({
    type: "string",
    example: "2127ea10-6110-4ffd-9403-3e33fc0929de",
  })
  id: string;

  // @ApiProperty({
  //   type: "string",
  //   example: "2127ea10-6110-4ffd-9403-3e33fc0929de",
  // })
  // heatWinnerAthleteId: string;

  @ApiProperty({
    type: "string",
    example: "Heat 1",
  })
  name: string;

  @ApiProperty({
    name: "heatNo",
    type: "number",
    example: 1,
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
    example: 1,
  })
  heatStatus: number;

  @ApiProperty({
    type: EventHeatOddsAthlete,
    isArray: true,
  })
  athletes: EventHeatOddsAthlete[];
}

export default class ProjectionExactasHeatResponse {
  @ApiProperty({
    type: "string",
    example: "2127ea10-6110-4ffd-9403-3e33fc0929de",
  })
  id: string;

  @ApiProperty({
    type: "string",
    example: "2127ea10-6110-4ffd-9403-3e33fc0929de",
  })
  roundId: string;

  @ApiProperty({
    example: "Semifinal",
  })
  name: string;

  @ApiProperty({
    example: 1,
  })
  roundNo: number;

  @ApiProperty({
    example: 1,
  })
  roundStatus: number;

  @ApiProperty({
    type: EventHeatOddsEvent,
    isArray: true,
  })
  heats: EventHeatOddsEvent[];

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

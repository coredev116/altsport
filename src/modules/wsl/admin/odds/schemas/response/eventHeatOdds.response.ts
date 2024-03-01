import { ApiProperty } from "@nestjs/swagger";

class EventHeatOddsAthlete {
  @ApiProperty({
    type: "string",
    example: "2127ea10-6110-4ffd-9403-3e33fc0929de",
  })
  id: string;

  @ApiProperty({
    type: "string",
    example: "ea102755-6110-4ffd-9403-3e33fc0929de",
  })
  heatOddId: string;

  @ApiProperty({
    name: "eventParticipantId",
    type: "string",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  eventParticipantId: string;

  @ApiProperty({
    example: "Jane",
  })
  firstName: string;

  @ApiProperty({
    example: "M",
  })
  middleName: string;

  @ApiProperty({
    example: "Doe",
  })
  lastName: string;

  @ApiProperty({
    example: "women",
  })
  gender: string;

  @ApiProperty({
    example: "American",
  })
  nationality: string;

  @ApiProperty({
    example: "American",
  })
  stance: string;

  @ApiProperty({
    example: 30.2,
  })
  odds: number;

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
    example: 1,
  })
  seedNo: number;
}

class EventHeatOddsEvent {
  @ApiProperty({
    type: "string",
    example: "2127ea10-6110-4ffd-9403-3e33fc0929de",
  })
  id: string;

  @ApiProperty({
    type: "string",
    example: "2127ea10-6110-4ffd-9403-3e33fc0929de",
  })
  heatWinnerAthleteId: string;

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

  @ApiProperty({
    name: "isHeatWinnerMarketVoided",
    type: "boolean",
    example: true,
  })
  isHeatWinnerMarketVoided: boolean;

  @ApiProperty({
    name: "isHeatWinnerMarketOpen",
    type: "boolean",
    example: true,
  })
  isHeatWinnerMarketOpen: boolean;

  @ApiProperty({
    example: 1,
  })
  heatStatus: number;

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
    type: EventHeatOddsAthlete,
    isArray: true,
  })
  athletes: EventHeatOddsAthlete[];
}

export class EventHeatOdds {
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
}

export class EventHeatOddsResponse {
  @ApiProperty({
    type: EventHeatOdds,
    isArray: true,
  })
  odds: EventHeatOdds[];
}

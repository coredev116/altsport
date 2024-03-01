import { ApiProperty } from "@nestjs/swagger";

class EventOddsAthlete {
  @ApiProperty({
    type: "string",
    example: "2127ea10-6110-4ffd-9403-3e33fc0929de",
  })
  id: string;

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
    example: 5,
  })
  seedNo: number;

  @ApiProperty({
    example: "Goofy",
  })
  stance: string;
}

class EventOdd {
  @ApiProperty({
    type: "string",
    example: "2127ea10-6110-4ffd-9403-3e33fc0929de",
  })
  id: string;

  @ApiProperty({
    type: "string",
    example: "2127ea10-6110-4ffd-9403-3e33fc0929de",
  })
  eventParticipantId: string;

  @ApiProperty({
    example: 1,
    type: "int",
  })
  position: number;

  @ApiProperty({
    example: 30.2,
    type: "decimal",
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
    type: EventOddsAthlete,
  })
  athlete: EventOddsAthlete;
}

export default class EventOddsResponse {
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
    type: "string",
    example: "2127ea10-6110-4ffd-9403-3e33fc0929de",
  })
  eventWinnerAthleteId: string;

  @ApiProperty({
    type: EventOdd,
    isArray: true,
  })
  odds: EventOdd[];
}

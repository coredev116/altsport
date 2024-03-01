import { ApiProperty } from "@nestjs/swagger";

class EventRounds {
  @ApiProperty({
    type: "string",
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  id: string;

  @ApiProperty({
    type: "string",
    example: "3",
  })
  providerRoundId: string;

  @ApiProperty({
    type: "string",
    example: "Set 2",
  })
  name: string;
}

class Team {
  @ApiProperty({
    type: "string",
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  id: string;

  @ApiProperty({
    type: "string",
    example: "Cyclones",
  })
  name: string;

  @ApiProperty({
    type: "boolean",
    example: true,
  })
  isHomeTeam: boolean;
}

export class OddsResponse {
  @ApiProperty({
    type: "string",
    example: "2127ea10-6110-4ffd-9403-3e33fc0929de",
  })
  id: string;

  @ApiProperty({
    type: "string",
    example: "ea102755-6110-4ffd-9403-3e33fc0929de",
  })
  eventId: string;

  @ApiProperty({
    type: "string",
    example: "23",
  })
  providerMatchId: string;

  @ApiProperty({
    example: 1,
  })
  marketType: number;

  @ApiProperty({
    example: 1,
  })
  subMarketType: number;

  @ApiProperty({
    example: 1,
  })
  betType: number;

  @ApiProperty({
    example: 1,
  })
  valueType: number;

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
    name: "bias",
    type: "int",
    example: 2,
  })
  bias: number;

  @ApiProperty({
    name: "lean",
    type: "int",
    example: 2,
  })
  lean: number;

  @ApiProperty({
    name: "playerLean",
    type: "int",
    example: 2,
  })
  playerLean: number;

  @ApiProperty({
    name: "max",
    type: "int",
    example: 2,
  })
  max: number;

  @ApiProperty({
    example: 30.2,
    type: "decimal",
  })
  calculatedValue: number;

  @ApiProperty({
    name: "isMarketActive",
    type: "boolean",
    example: true,
  })
  isMarketActive: boolean;

  @ApiProperty({
    name: "isSubMarketLocked",
    type: "boolean",
    example: true,
  })
  isSubMarketLocked: boolean;

  @ApiProperty({
    type: EventRounds,
    isArray: true,
  })
  round: EventRounds;

  @ApiProperty({
    type: Team,
    isArray: true,
  })
  team: Team;
}

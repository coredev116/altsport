import { ApiProperty, ApiExtraModels } from "@nestjs/swagger";

class ClientOdds {
  @ApiProperty({
    type: "string",
    example: "2127ea10-6110-4ffd-9403-3e33fc0929de",
  })
  id: string;

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
    type: "prop",
    example: "First Athlete",
  })
  prop: string;
}

@ApiExtraModels(ClientOdds)
export default class EventOddsDownload {
  @ApiProperty({
    type: "string",
    example: "Jai Alai",
  })
  sport: string;

  @ApiProperty({
    type: "string",
    example: "Supercar",
  })
  tour: string;

  @ApiProperty({
    type: "number",
    example: 2021,
  })
  year: number;

  @ApiProperty({
    type: "string",
    example: "Elk River",
  })
  eventName: string;

  @ApiProperty({
    type: Object,
    properties: {
      [new Date().toISOString()]: {
        type: "array",
        items: { $ref: "#/components/schemas/ClientOdds" },
      },
    },
  })
  publishes: Record<string, ClientOdds[]>;
}

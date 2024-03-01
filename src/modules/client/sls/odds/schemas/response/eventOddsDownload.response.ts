import { ApiProperty, ApiExtraModels } from "@nestjs/swagger";

class ClientOdds {
  @ApiProperty({
    type: "string",
    example: "2127ea10-6110-4ffd-9403-3e33fc0929de",
  })
  id: string;

  @ApiProperty({
    type: "string",
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  athleteId: string;

  @ApiProperty({
    type: "string",
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  eventParticipantId: string;

  @ApiProperty({
    example: "Andrew",
  })
  firstName: string;

  @ApiProperty({
    example: "M",
  })
  middleName: string;

  @ApiProperty({
    example: "Carlson",
  })
  lastName: string;

  @ApiProperty({
    example: 30.2,
    type: "decimal",
  })
  odds: number;

  @ApiProperty({
    example: 1.2,
    type: "decimal",
  })
  probability: number;

  @ApiProperty({
    example: 3.2,
    type: "decimal",
  })
  trueProbability: number;
}

@ApiExtraModels(ClientOdds)
export default class EventOddsDownload {
  @ApiProperty({
    type: "string",
    example: "Skateboarding League",
  })
  sport: string;

  @ApiProperty({
    type: "string",
    example: "SLS",
  })
  league: string;

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

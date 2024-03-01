import { ApiProperty, ApiExtraModels } from "@nestjs/swagger";

class OddsAthlete {
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
    example: "American",
  })
  stance: string;
}
export class ClientFutureOdds {
  @ApiProperty({
    type: "string",
    example: "2127ea10-6110-4ffd-9403-3e33fc0929de",
  })
  id: string;

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

  @ApiProperty({
    type: OddsAthlete,
  })
  athlete: OddsAthlete;

  @ApiProperty({
    example: "2022-12-27T13:57:53.866Z",
    type: "Date",
  })
  createdAt: Date;
}

@ApiExtraModels(ClientFutureOdds)
export default class FutureOddsDownload {
  @ApiProperty({
    type: "string",
    example: "World Surf League",
  })
  sport: string;

  @ApiProperty({
    type: Object,
    properties: {
      [new Date().toISOString()]: {
        type: "array",
        items: { $ref: "#/components/schemas/ClientFutureOdds" },
      },
    },
  })
  publishes: Record<string, ClientFutureOdds[]>;
}

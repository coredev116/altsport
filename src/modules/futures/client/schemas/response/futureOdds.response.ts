import { ApiProperty } from "@nestjs/swagger";

import { AthleteStatus } from "../../../../../constants/system";

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

  @ApiProperty({
    example: AthleteStatus.ACTIVE,
  })
  playerStatus: AthleteStatus;
}

export class FutureOddsResponse {
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
    example: "2022-12-27T13:57:53.866Z",
    type: "Date",
  })
  createdAt: Date;

  @ApiProperty({
    example: "2022-12-27T13:57:53.866Z",
    type: "Date",
  })
  updatedAt: Date;

  @ApiProperty({
    type: OddsAthlete,
  })
  athlete: OddsAthlete;
}

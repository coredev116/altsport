import { ApiProperty } from "@nestjs/swagger";

export class AthleteListingResponse {
  @ApiProperty({
    type: "uuid",
    example: "2127ea10-6110-4ffd-9403-3e33fc0929de",
  })
  id: string;

  @ApiProperty({
    example: "Fraser",
  })
  firstName: string;

  @ApiProperty({
    example: "",
  })
  middleName: string;

  @ApiProperty({
    example: "MCCONNELL",
  })
  lastName: string;

  @ApiProperty({
    example: "men",
  })
  gender: string;

  @ApiProperty({
    example: 8.12,
  })
  averageLapTime: number;

  @ApiProperty({
    example: 8.12,
  })
  avgJokerLapTime: number;

  @ApiProperty({
    example: 8.12,
  })
  avgNonJokerLapTime: number;

  @ApiProperty({
    example: 8.12,
  })
  totalBattleRaces: number;

  @ApiProperty({
    example: 8.12,
  })
  battleRaceWinPercentage: number;

  @ApiProperty({
    example: 8.12,
  })
  totalHeatRaces: number;

  @ApiProperty({
    example: 8.12,
  })
  heatRaceWinPercentage: number;

  @ApiProperty({
    example: 8.12,
  })
  totalFinalRaces: number;

  @ApiProperty({
    example: 8.12,
  })
  finalWinPercentage: number;
}

export class AthleteListingObject {
  @ApiProperty({
    example: 1,
  })
  page: number;

  @ApiProperty({
    isArray: true,
    type: AthleteListingResponse,
  })
  public data: AthleteListingResponse[];
}

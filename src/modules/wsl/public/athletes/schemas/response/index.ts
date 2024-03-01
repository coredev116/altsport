import { ApiProperty } from "@nestjs/swagger";

export class AthleteListingResponse {
  @ApiProperty({
    type: "uuid",
    example: "2127ea10-6110-4ffd-9403-3e33fc0929de",
  })
  id: string;

  @ApiProperty({
    example: "John",
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
    example: "men",
  })
  gender: string;

  @ApiProperty({
    example: 8.12,
  })
  averageHeatScore: number;

  @ApiProperty({
    example: 15,
  })
  heatsSurfed: number;

  @ApiProperty({
    example: 3,
  })
  heatsWon: number;

  @ApiProperty({
    example: 20,
  })
  heatsWinPercentage: number;

  @ApiProperty({
    example: 12.8,
  })
  maxHeatScore: number;

  @ApiProperty({
    example: 7.32,
  })
  minHeatScore: number;
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

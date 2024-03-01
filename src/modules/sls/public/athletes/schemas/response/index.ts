import { ApiProperty } from "@nestjs/swagger";

export class AthleteListingResponse {
  @ApiProperty({
    type: "uuid",
    example: "2127ea10-6110-4ffd-9403-3e33fc0929de",
  })
  id: string;

  @ApiProperty({
    example: "Rayssa",
  })
  firstName: string;

  @ApiProperty({
    example: "J",
  })
  middleName: string;

  @ApiProperty({
    example: "Leal",
  })
  lastName: string;

  @ApiProperty({
    example: "men",
  })
  gender: string;

  @ApiProperty({
    example: 8.12,
  })
  avgRoundScore: number;

  @ApiProperty({
    example: 8.12,
  })
  averageRunScore: number;

  @ApiProperty({
    example: 2.35,
  })
  averageTrickScore: number;

  @ApiProperty({
    example: 2.35,
  })
  trickCompletionRate: number;

  @ApiProperty({
    example: 2.35,
  })
  maxRoundScore: number;

  @ApiProperty({
    example: 2.35,
  })
  minRoundScore: number;
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

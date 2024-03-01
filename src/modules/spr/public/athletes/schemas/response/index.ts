import { ApiProperty } from "@nestjs/swagger";

export class AthleteListingResponse {
  @ApiProperty({
    type: "uuid",
    example: "2127ea10-6110-4ffd-9403-3e33fc0929de",
  })
  id: string;

  @ApiProperty({
    example: "Martin",
  })
  firstName: string;

  @ApiProperty({
    example: "",
  })
  middleName: string;

  @ApiProperty({
    example: "Castelo",
  })
  lastName: string;

  @ApiProperty({
    example: "men",
  })
  gender: string;

  @ApiProperty({
    example: 8,
  })
  eventsRaced: number;

  @ApiProperty({
    example: 8,
  })
  eventWins: number;

  @ApiProperty({
    example: 8.12,
  })
  avgEventPlace: number;

  // @ApiProperty({
  //   example: 8.12,
  // })
  // avgLapTime: number;

  @ApiProperty({
    example: 8.12,
  })
  avgBestLapTime: number;

  // @ApiProperty({
  //   example: 8.12,
  // })
  // avgQualifyingPlace: number;

  @ApiProperty({
    example: 5,
  })
  totalMainEventRaces: number;

  @ApiProperty({
    example: 6,
  })
  totalPrelimsRaces: number;

  @ApiProperty({
    example: 8.12,
  })
  avgPrelimsPlace: number;

  @ApiProperty({
    example: 2,
  })
  totalLastChanceRaces: number;

  @ApiProperty({
    example: 8.12,
  })
  avgLastChancePlace: number;
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

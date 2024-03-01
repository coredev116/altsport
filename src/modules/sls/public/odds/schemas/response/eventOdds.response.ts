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
    example: "American",
  })
  stance: string;

  @ApiProperty({
    example: "American",
  })
  nationality: string;

  @ApiProperty({
    example: "American",
  })
  seedNo: number;
}

export default class EventOddsResponse {
  @ApiProperty({
    type: "string",
    example: "2127ea10-6110-4ffd-9403-3e33fc0929de",
  })
  id: string;

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
    type: EventOddsAthlete,
  })
  athlete: EventOddsAthlete;
}

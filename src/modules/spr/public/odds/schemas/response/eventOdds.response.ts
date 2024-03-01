import { ApiProperty } from "@nestjs/swagger";

class EventOddsAthlete {
  @ApiProperty({
    type: "string",
    example: "2127ea10-6110-4ffd-9403-3e33fc0929de",
  })
  id: string;

  @ApiProperty({
    type: "string",
    example: "Martin",
  })
  firstName: string;

  @ApiProperty({
    type: "string",
    example: "J",
  })
  middleName: string;

  @ApiProperty({
    type: "string",
    example: "Castelo",
  })
  lastName: string;

  @ApiProperty({
    type: "string",
    example: "Regular",
  })
  stance: string;

  @ApiProperty({
    type: "string",
    example: "USA",
  })
  nationality: string;

  @ApiProperty({
    type: "string",
    example: 1,
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

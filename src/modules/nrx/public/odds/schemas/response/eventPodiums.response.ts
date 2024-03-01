import { ApiProperty } from "@nestjs/swagger";

class EventPodiumsAthlete {
  @ApiProperty({
    type: "string",
    example: "2127ea10-6110-4ffd-9403-3e33fc0929de",
  })
  id: string;

  @ApiProperty({
    type: "string",
    example: "Jane",
  })
  firstName: string;

  @ApiProperty({
    type: "string",
    example: "M",
  })
  middleName: string;

  @ApiProperty({
    type: "string",
    example: "Doe",
  })
  lastName: string;

  @ApiProperty({
    type: "string",
    example: "American",
  })
  stance: string;

  @ApiProperty({
    type: "string",
    example: "American",
  })
  nationality: string;

  @ApiProperty({
    type: "string",
    example: 1,
  })
  seedNo: number;
}

export default class EventPodiumsResponse {
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
    type: EventPodiumsAthlete,
  })
  athlete: EventPodiumsAthlete;
}

import { ApiProperty } from "@nestjs/swagger";

class EventOddsAthlete {
  @ApiProperty({
    type: "string",
    example: "2127ea10-6110-4ffd-9403-3e33fc0929de",
  })
  id: string;

  @ApiProperty({
    example: "Martin",
  })
  firstName: string;

  @ApiProperty({
    example: "J",
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
    example: "USA",
  })
  nationality: string;

  @ApiProperty({
    example: "Regular",
  })
  stance: string;

  @ApiProperty({
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
    name: "eventParticipantId",
    type: "string",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  eventParticipantId: string;

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
    type: EventOddsAthlete,
  })
  athlete: EventOddsAthlete;

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
}

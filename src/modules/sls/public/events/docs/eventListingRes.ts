import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export default class EventListingRes {
  @ApiProperty({
    type: "uuid",
    example: "2127ea10-6110-4ffd-9403-3e33fc0929de",
  })
  id: string;

  @ApiProperty({
    name: "name",
    type: "string",
    example: "SLS Jacksonville",
  })
  @IsString()
  name: string;

  @ApiProperty({
    name: "leagueId",
    type: "string",
    example: "279d1482-aa17-4eea-902a-c49acf0928e2",
  })
  @IsString()
  leagueId: string;

  @ApiProperty({
    name: "leagueName",
    type: "string",
    example: "Men's Championship Tour",
  })
  @IsString()
  leagueName: string;

  @ApiProperty({
    name: "startDate",
    type: "string",
    format: "date",
    example: "2022-04-18T15:25:24Z",
  })
  startDate: Date;

  @ApiProperty({
    name: "endDate",
    type: "string",
    format: "date",
    example: "2022-04-18T15:25:24Z",
  })
  endDate: Date;

  @ApiProperty({ name: "year", type: "number", example: 1 })
  year: number;

  @ApiProperty({ name: "eventNumber", type: "number", example: 1 })
  eventNumber: number;

  @ApiProperty({ name: "eventStatus", type: "string", example: "COMPLETED" })
  eventStatus: string;

  @ApiProperty({ name: "eventLocation", type: "string", example: "Jacksonville,USA" })
  eventLocation: string;

  @ApiProperty({ name: "eventLocationGroup", type: "string", example: "Jacksonville,USA" })
  eventLocationGroup: string;

  // @ApiProperty({ type: EventRoundListing, isArray: true })
  // rounds: EventRoundListing;
}

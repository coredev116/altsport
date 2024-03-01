import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

class EventRoundHeatListing {
  @ApiProperty({
    name: "id",
    type: "uuid",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  id: string;

  @ApiProperty({ name: "heatName", type: "string", required: true, example: "Heat 1" })
  name: string;

  @ApiProperty({ name: "heatNo", type: "number", example: 1, required: true })
  heatNo: number;

  @ApiProperty({ name: "heatStatus", type: "string", example: "UPCOMING", required: false })
  heatStatus: string;

  @ApiProperty({
    name: "startDate",
    type: "string",
    format: "date",
    required: false,
    example: "2022-04-18T15:25:24Z",
  })
  startDate: Date;

  @ApiProperty({
    name: "endDate",
    type: "string",
    format: "date",
    required: false,
    example: "2022-04-18T15:25:24Z",
  })
  endDate: Date;
}

class EventRoundListing {
  @ApiProperty({
    name: "id",
    type: "uuid",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  id: string;

  @ApiProperty({ name: "name", type: "string", required: true, example: "Final" })
  name: string;

  @ApiProperty({ name: "roundNo", type: "number", required: true, example: 1 })
  roundNo: number;

  @ApiProperty({ name: "roundStatus", type: "string", required: true, example: "UPCOMING" })
  roundStatus: string;

  @ApiProperty({
    name: "startDate",
    type: "string",
    format: "date",
    required: false,
    example: "2022-04-18T15:25:24Z",
  })
  startDate: Date;

  @ApiProperty({
    name: "endDate",
    type: "string",
    format: "date",
    required: false,
    example: "2022-04-18T15:25:24Z",
  })
  endDate: Date;

  @ApiProperty({ type: EventRoundHeatListing, isArray: true })
  heats: EventRoundHeatListing;
}

export default class EventResponse {
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

  @ApiProperty({ type: EventRoundListing, isArray: true })
  rounds: EventRoundListing;
}

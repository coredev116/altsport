import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export default class EventListingResponse {
  @ApiProperty({
    type: "uuid",
    example: "2127ea10-6110-4ffd-9403-3e33fc0929de",
  })
  id: string;

  @ApiProperty({
    name: "name",
    type: "string",
    example: "Arlington 3",
  })
  @IsString()
  name: string;

  @ApiProperty({
    name: "tourId",
    type: "string",
    example: "159f6fcd-3973-4071-a03f-c91d44e9362f",
  })
  @IsString()
  tourId: string;

  @ApiProperty({
    name: "tourName",
    type: "string",
    example: "KTM Junior Supercross",
  })
  @IsString()
  tourName: string;

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

  @ApiProperty({ name: "eventLocation", type: "string", example: "Arlington" })
  eventLocation: string;

  @ApiProperty({ name: "eventLocationGroup", type: "string", example: "Arlington" })
  eventLocationGroup: string;

  @ApiProperty({
    name: "categoryName",
    type: "string",
    example: "KTM Junior",
  })
  @IsString()
  categoryName: string;
}

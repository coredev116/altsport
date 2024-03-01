import { ApiProperty } from "@nestjs/swagger";

export default class EventLocationListingResponse {
  @ApiProperty({ name: "id", type: "string", example: "a7a5927b-94c5-4575-8002-0bce90710732" })
  id: string;

  @ApiProperty({ name: "eventLocation", type: "string", example: "Margaret River" })
  eventLocation: string;

  @ApiProperty({ name: "eventLocationGroup", type: "string", example: "Margaret River Group" })
  eventLocationGroup: string;
}

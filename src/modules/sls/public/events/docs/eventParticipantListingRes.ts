import { ApiProperty } from "@nestjs/swagger";

class EventParticipantResponse {
  @ApiProperty({
    type: "uuid",
    name: "id",
    example: "2127ea10-6110-4ffd-9403-3e33fc0929de",
  })
  id: string;

  @ApiProperty({
    name: "firstName",
    type: "string",
    example: "Vernon",
  })
  firstName: string;

  @ApiProperty({
    name: "middleName",
    type: "string",
    example: "F",
  })
  middleName: string;

  @ApiProperty({
    name: "lastName",
    type: "string",
    example: "Crona",
  })
  lastName: string;

  @ApiProperty({
    name: "nationality",
    type: "string",
    example: "American",
  })
  nationality: string;

  @ApiProperty({ name: "stance", type: "string", example: "Regular" })
  stance: string;
}

export class EventParticipantListingRes {
  @ApiProperty({
    type: "uuid",
    name: "id",
    example: "2127ea10-6110-4ffd-9403-3e33fc0929de",
  })
  id: string;

  @ApiProperty({
    name: "seedNo",
    type: "number",
    example: 1,
  })
  seedNo: number;

  @ApiProperty({
    name: "status",
    type: "number",
    example: 1,
  })
  status: number;

  @ApiProperty({ type: EventParticipantResponse })
  athlete: EventParticipantResponse;
}

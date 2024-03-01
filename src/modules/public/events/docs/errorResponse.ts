import { ApiProperty } from "@nestjs/swagger";

export class ServerErrorResponse {
  @ApiProperty({
    name: "stack",
    description: "Any any information sent back by the server for debugging purposes.",
    type: String,
  })
  stack: string;

  @ApiProperty({
    name: "message",
    description: "Information related to the error message.",
    example: "Event not found",
    type: String,
  })
  message: string;

  @ApiProperty({
    name: "metadata",
    description: "Any debugging related information passed by the server.",
    type: Object,
  })
  metadata: object;

  @ApiProperty({
    name: "statusCode",
    description: "Error code.",
    example: 403,
    type: Object,
  })
  statusCode: object;

  @ApiProperty({
    name: "timestamp",
    description: "Error timestamp.",
    example: "2023-02-07T19:43:08.187Z",
    type: String,
  })
  timestamp: string;
}

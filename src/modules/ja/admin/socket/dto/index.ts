import { IsString, IsNotEmpty, IsObject } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class JaiEventPayload {
  @ApiProperty({
    type: "string",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  eventName: string;

  @ApiProperty({
    type: "object",
    required: true,
  })
  @IsObject()
  data: any;
}

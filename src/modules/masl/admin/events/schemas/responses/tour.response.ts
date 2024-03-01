import { ApiProperty } from "@nestjs/swagger";

export default class Tour {
  @ApiProperty({
    name: "name",
    type: "string",
    required: true,
    example: "Major Arena Soccer League",
  })
  name: string;
}

import { ApiProperty } from "@nestjs/swagger";

export default class AthleteResponse {
  @ApiProperty({
    name: "id",
    type: "string",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  id: string;

  @ApiProperty({ name: "firstName", type: "string", example: "Fraser" })
  firstName: string;

  @ApiProperty({ name: "middleName", type: "string", example: "" })
  middleName: string;

  @ApiProperty({ name: "lastName", type: "string", example: "MCCONNELL" })
  lastName: string;

  @ApiProperty({ name: "nationality", type: "string", example: "JAM" })
  nationality: string;

  @ApiProperty({ name: "stance", type: "string", example: "Regular" })
  stance: string;
}

import { ApiProperty } from "@nestjs/swagger";

export default class AthleteResponse {
  @ApiProperty({
    name: "id",
    type: "string",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
    description: "ID related to the athlete",
  })
  id: string;

  @ApiProperty({
    name: "firstName",
    type: "string",
    example: "Fraser",
    description: "Athlete first name",
  })
  firstName: string;

  @ApiProperty({
    name: "middleName",
    type: "string",
    example: "",
    description: "Athlete middle name",
  })
  middleName: string;

  @ApiProperty({
    name: "lastName",
    type: "string",
    example: "MCCONNELL",
    description: "Athlete last name",
  })
  lastName: string;

  @ApiProperty({
    name: "nationality",
    type: "string",
    example: "JAM",
    description: "Athlete nationality",
  })
  nationality: string;

  @ApiProperty({
    name: "stance",
    type: "string",
    example: "Regular",
    description: "Athlete stance ( Only applicable in case of WSL )",
  })
  stance: string;
}

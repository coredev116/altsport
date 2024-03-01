import { ApiProperty } from "@nestjs/swagger";

export class AthleteRes {
  @ApiProperty({
    name: "id",
    type: "string",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  id: string;

  @ApiProperty({ name: "firstName", type: "string", example: "Rayssa" })
  firstName: string;

  @ApiProperty({ name: "middleName", type: "string", example: "J" })
  middleName: string;

  @ApiProperty({ name: "lastName", type: "string", example: "Leal" })
  lastName: string;

  @ApiProperty({ name: "nationality", type: "string", example: "Japan" })
  nationality: string;

  @ApiProperty({ name: "stance", type: "string", example: "Regular" })
  stance: string;

  @ApiProperty({ name: "seedNo", type: "number", example: 1 })
  seedNo: number;
}

export default class PropBetsListingRes {
  @ApiProperty({
    name: "id",
    type: "string",
    example: "bc8a2ac2-0111-4b99-b402-08a19a731eda",
  })
  id: string;

  @ApiProperty({ type: AthleteRes })
  athlete: AthleteRes;

  @ApiProperty({ name: "proposition", type: "string", example: "Reaches quarterfinals" })
  proposition: string;

  @ApiProperty({
    name: "odds",
    format: "decimal",
    type: "number",
    example: 30.5,
  })
  odds: number;

  @ApiProperty({
    name: "probability",
    type: "decimal",
    example: 30.5,
  })
  probability: number;
}

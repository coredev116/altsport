import { ApiProperty } from "@nestjs/swagger";

import { FutureStatus } from "../../../../../constants/system";

class FuturesTourYearsResponse {
  @ApiProperty({ name: "year", type: "number", format: "int", example: 2019 })
  year: number;

  @ApiProperty({ name: "name", type: "string", example: "2019 Season" })
  name: string;

  @ApiProperty({ name: "isOpen", type: "boolean", example: false })
  isOpen: boolean;

  @ApiProperty({ name: "futureStatus", type: "number", example: FutureStatus.COMPLETED })
  futureStatus: number;
}

class FuturesTourResponse {
  @ApiProperty({
    name: "id",
    type: "string",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  id: string;

  @ApiProperty({ name: "name", type: "string", example: "Men's Championship Tour" })
  name: string;

  @ApiProperty({ name: "gender", type: "string", example: "male" })
  gender: string;

  @ApiProperty({ type: FuturesTourYearsResponse, isArray: true })
  years: FuturesTourYearsResponse[];
}

export default class SportsFuturesResponse {
  @ApiProperty({
    name: "id",
    type: "string",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  id: string;

  @ApiProperty({ name: "name", type: "string", example: "World Surf League" })
  name: string;

  @ApiProperty({ name: "sportType", type: "string", example: "wsl" })
  sportType: string;

  @ApiProperty({ type: FuturesTourResponse, isArray: true })
  tours: FuturesTourResponse[];
}

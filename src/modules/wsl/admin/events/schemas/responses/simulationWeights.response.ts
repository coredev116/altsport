import { ApiProperty } from "@nestjs/swagger";

import { SimulationWeightTypes } from "../../../../../../constants/system";

export default class SimulationWeights {
  @ApiProperty({
    name: "id",
    type: "string",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  id: string;

  @ApiProperty({
    name: "type",
    type: "string",
    required: true,
    example: SimulationWeightTypes.LOCATION,
    enum: SimulationWeightTypes,
  })
  type: string;

  @ApiProperty({ name: "year", type: "number", required: true, example: 2022 })
  year: number;

  @ApiProperty({ name: "location", type: "string", required: true, example: "Margaret River Pro" })
  location: string;

  @ApiProperty({ name: "weight", type: "number", required: true, example: 12.7 })
  weight: number;
}

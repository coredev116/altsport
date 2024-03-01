import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsUUID, Min, ValidateIf } from "class-validator";

export default class TraderAthleteSeed {
  @ApiProperty({
    name: "id",
    type: "string",
    required: false,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  @IsOptional()
  @IsUUID()
  @ValidateIf((value) => value.id)
  id: string;

  @ApiProperty({ name: "seed", type: "number", example: 1, required: true })
  @IsNumber()
  @IsOptional()
  seed: number;

  @ApiProperty({
    name: "athleteId",
    type: "string",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  @IsUUID()
  @IsOptional()
  athleteId: string;

  @ApiProperty({ name: "heatScore", type: "number", example: 10.3, required: false })
  @IsNumber()
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  heatScore: number;

  @ApiProperty({ name: "heatPosition", type: "number", example: 2, required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  heatPosition: number;
}

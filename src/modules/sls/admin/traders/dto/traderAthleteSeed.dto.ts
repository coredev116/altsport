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
  @IsOptional()
  @IsNumber()
  seed: number;

  @ApiProperty({
    name: "athleteId",
    type: "string",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  @IsOptional()
  @IsUUID()
  athleteId: string;

  @ApiProperty({ name: "roundScore", type: "number", example: 10.3, required: false, default: 0 })
  @IsNumber()
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  roundScore: number;

  @ApiProperty({
    name: "lineScore1",
    type: "number",
    example: 10.3,
    required: false,
    default: null,
  })
  @IsNumber()
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  lineScore1: number;

  @ApiProperty({
    name: "lineScore2",
    type: "number",
    example: 10.3,
    required: false,
    default: null,
  })
  @IsNumber()
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  lineScore2: number;

  @ApiProperty({
    name: "trick1Score",
    type: "number",
    example: 10.3,
    required: false,
    default: null,
  })
  @IsNumber()
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  trick1Score: number;

  @ApiProperty({
    name: "trick2Score",
    type: "number",
    example: 10.3,
    required: false,
    default: null,
  })
  @IsNumber()
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  trick2Score: number;

  @ApiProperty({
    name: "trick3Score",
    type: "number",
    example: 10.3,
    required: false,
    default: null,
  })
  @IsNumber()
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  trick3Score: number;

  @ApiProperty({
    name: "trick4Score",
    type: "number",
    example: 10.3,
    required: false,
    default: null,
  })
  @IsNumber()
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  trick4Score: number;

  @ApiProperty({
    name: "trick5Score",
    type: "number",
    example: 10.3,
    required: false,
    default: null,
  })
  @IsNumber()
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  trick5Score: number;

  @ApiProperty({
    name: "trick6Score",
    type: "number",
    example: 10.3,
    required: false,
    default: null,
  })
  @IsNumber()
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  trick6Score: number;

  @ApiProperty({ name: "heatPosition", type: "number", example: 2, required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  heatPosition: number;
}

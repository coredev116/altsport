import { ApiProperty } from "@nestjs/swagger";

export default class SeedResponse {
  @ApiProperty({ name: "athlete", type: "string", example: "John M Doe" })
  athlete: string;

  @ApiProperty({ name: "stance", type: "string", example: "Regular" })
  stance: string;

  @ApiProperty({ name: "nationality", type: "string", example: "AUS" })
  nationality: string;

  @ApiProperty({ name: "gender", type: "string", example: "men" })
  gender: string;

  @ApiProperty({ name: "seed_number", type: "number", example: 23 })
  seed_number: number;

  @ApiProperty({ name: "base_projection", type: "string", example: "5" })
  base_projection: string;

  @ApiProperty({ name: "base_run_score", type: "string", example: "10" })
  base_run_score: string;

  @ApiProperty({ name: "base_trick_score", type: "string", example: "4" })
  base_trick_score: string;

  @ApiProperty({ name: "trick_completion", type: "string", example: "2" })
  trick_completion: string;

  @ApiProperty({ name: "event", type: "string", example: "MEO Rip Curl Portugal Pro" })
  event: string;

  @ApiProperty({ name: "tour_year", type: "number", example: 2023 })
  tour_year: number;

  @ApiProperty({ name: "status", type: "string", example: "Active" })
  status: string;

  @ApiProperty({ name: "tier", type: "number", example: 2 })
  tier: number;

  @ApiProperty({ name: "tier_seed", type: "number", example: 1 })
  tier_seed: number;

  @ApiProperty({ name: "notes", type: "string", example: "" })
  notes: string;
}

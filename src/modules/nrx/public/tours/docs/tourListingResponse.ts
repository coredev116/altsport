import { ApiProperty } from "@nestjs/swagger";

export class TourListingResponse {
  @ApiProperty({
    type: "uuid",
    example: "2127ea10-6110-4ffd-9403-3e33fc0929de",
  })
  id: string;

  @ApiProperty({
    type: "string",
    example: "Supercar",
  })
  name: string;

  @ApiProperty({
    name: "tourGender",
    type: "string",
    example: "men",
  })
  tourGender: string;

  @ApiProperty({
    type: "number",
    example: "[2021, 2022]",
    isArray: true,
  })
  years: number[];
}

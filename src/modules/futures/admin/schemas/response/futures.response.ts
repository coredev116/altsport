import { ApiProperty } from "@nestjs/swagger";
import { FutureMarkets, FutureStatus } from "../../../../../constants/system";

class MarketResponse {
  @ApiProperty({
    name: "id",
    type: "string",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  id: string;

  @ApiProperty({ name: "label", type: "string", example: "Top 10" })
  label: string;

  @ApiProperty({ name: "name", type: "string", example: FutureMarkets.TOP_10 })
  name: string;
}

export class FuturesResponse {
  @ApiProperty({
    name: "id",
    type: "string",
    required: true,
    example: "motocrs_636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  id: string;

  @ApiProperty({ name: "name", type: "string", example: "MOTOCRS men Season Futures 2023" })
  name: string;

  @ApiProperty({ name: "year", type: "number", format: "int", example: 2023 })
  year: number;

  @ApiProperty({
    name: "nextEventStartDate",
    type: "string",
    format: "date",
    required: false,
    example: "2022-04-18T15:25:24Z",
  })
  nextEventStartDate: Date;

  @ApiProperty({
    name: "startDate",
    type: "string",
    format: "date",
    required: false,
    example: "2022-04-18T15:25:24Z",
  })
  startDate: Date;

  @ApiProperty({ name: "futureStatus", type: "number", example: FutureStatus.LIVE })
  futureStatus: number;

  @ApiProperty({
    name: "endDate",
    type: "string",
    format: "date",
    required: false,
    example: "2022-04-18T15:25:24Z",
  })
  endDate: Date;

  @ApiProperty({ name: "isOpen", type: "boolean", example: false })
  isOpen: boolean;

  @ApiProperty({ type: MarketResponse, isArray: true })
  markets: MarketResponse[];
}

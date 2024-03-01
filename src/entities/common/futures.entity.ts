import { Column } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

import { Base } from "../base.entity";

import { FutureMarkets, FutureStatus } from "../../constants/system";

export default abstract class Futures extends Base {
  @ApiProperty({
    name: "tourYearId",
    type: "string",
    example: "bc8a2ac2-0111-4b99-b402-08a19a731eda",
  })
  @Column({ type: "uuid" })
  tourYearId: string;

  @ApiProperty({
    name: "types",
    type: "enum",
    enum: FutureMarkets,
  })
  @Column({ type: "text", enum: FutureMarkets })
  type: FutureMarkets;

  @ApiProperty({ name: "isMarketOpen", type: "boolean", example: "false", default: false })
  @Column({ type: "boolean", default: false })
  isMarketOpen: boolean;

  @ApiProperty({
    name: "startDate",
    type: "string",
    format: "date",
    example: "2022-04-18T15:25:24Z",
  })
  @Column({ type: "timestamptz" })
  startDate: Date;

  @ApiProperty({
    name: "endDate",
    type: "string",
    format: "date",
    example: "2022-04-18T15:25:24Z",
  })
  @Column({ type: "timestamptz" })
  endDate: Date;

  @ApiProperty({
    name: "eventDate",
    type: "string",
    format: "date",
    example: "2022-04-18T15:25:24Z",
  })
  @Column({ type: "timestamptz" })
  eventDate: Date | null;

  @ApiProperty({ name: "status", type: "number", example: 1 })
  @Column({ type: "int" })
  status: FutureStatus;
}

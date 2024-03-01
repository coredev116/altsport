import { Column } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

import { Base } from "../base.entity";

export default abstract class FutureOdds extends Base {
  @ApiProperty({
    name: "futureId",
    type: "string",
    example: "ad6b4ea1-0111-4b99-b402-08a19a731eda",
  })
  @Column({ type: "uuid" })
  futureId: string;

  @ApiProperty({
    name: "odds",
    type: "number",
    example: 30.5,
  })
  @Column({ type: "decimal" })
  odds: number;

  @ApiProperty({
    name: "probability",
    type: "number",
    example: 30.5,
  })
  @Column({ type: "decimal" })
  probability: number;

  @ApiProperty({
    name: "trueProbability",
    type: "number",
    example: 30.5,
  })
  @Column({ type: "decimal" })
  trueProbability: number;

  @ApiProperty({ name: "hasModifiedProbability", type: "boolean", example: "false" })
  @Column({ type: "boolean", default: false })
  hasModifiedProbability: boolean;
}

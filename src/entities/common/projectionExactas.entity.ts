import { Base } from "../base.entity";
import { Column, ObjectLiteral } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

import { IExactasParticipants } from "../../interfaces/markets";

export default abstract class ProjectionExactas extends Base {
  @ApiProperty({
    name: "eventId",
    type: "string",
    example: "bc8a2ac2-0111-4b99-b402-08a19a731eda",
  })
  @Column({ type: "uuid" })
  eventId: string;

  @ApiProperty({
    name: "roundHeatId",
    type: "string",
    example: "bc8a2ac2-0111-4b99-b402-08a19a731eda",
  })
  @Column({ type: "uuid" })
  roundHeatId: string;

  @ApiProperty({
    name: "participants",
    type: "json",
    example: `
        [
            {
            "firstName": "Athlete name",
            "lastName": "Athlete name",
            "eventParticipantId": "a2ac2-0111-4b99-b402-08a19a731eda"
            }
        ]
    `,
  })
  @Column({ type: "json" })
  participants: IExactasParticipants[];

  @ApiProperty({
    name: "position",
    type: "number",
    example: 1,
  })
  @Column({ type: "int" })
  position: number;

  @ApiProperty({
    name: "odds",
    type: "number",
    example: 30.5,
  })
  @Column({ type: "decimal" })
  odds: number;

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

  @ApiProperty({
    name: "probability",
    type: "number",
    example: 30.5,
  })
  @Column({ type: "decimal" })
  probability: number;

  @ApiProperty({
    name: "voided",
    type: "boolean",
    example: true,
  })
  @Column({ type: "boolean" })
  voided: boolean;

  @ApiProperty({
    name: "draw",
    type: "boolean",
    example: true,
  })
  @Column({ type: "boolean" })
  draw: boolean;

  @ApiProperty({
    name: "visible",
    type: "boolean",
    example: true,
  })
  @Column({ type: "boolean" })
  visible: boolean;

  @ApiProperty({
    name: "holdingPercentage",
    type: "number",
    example: 35.5,
    default: 100,
  })
  @Column({ type: "decimal" })
  holdingPercentage: number;

  abstract heat: ObjectLiteral;
}

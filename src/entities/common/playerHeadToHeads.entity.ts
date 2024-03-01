import { Column, ObjectLiteral } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

import { Base } from "../base.entity";

export default abstract class PlayerHeadToHeadsBase extends Base {
  @ApiProperty({
    name: "eventId",
    type: "string",
    example: "bc8a2ac2-0111-4b99-b402-08a19a731eda",
  })
  @Column({ type: "uuid" })
  eventId: string;

  @ApiProperty({
    name: "eventParticipant1Id",
    type: "string",
    example: "bc8a2ac2-0111-4b99-b402-08a19a731eda",
  })
  @Column({ type: "uuid" })
  eventParticipant1Id: string;

  @ApiProperty({
    name: "eventParticipant2Id",
    type: "string",
    example: "bc8a2ac2-0111-4b99-b402-08a19a731eda",
  })
  @Column({ type: "uuid" })
  eventParticipant2Id: string;

  @ApiProperty({
    name: "eventParticipantWinnerId",
    type: "string",
    example: "bc8a2ac2-0111-4b99-b402-08a19a731eda",
  })
  @Column({ type: "uuid" })
  eventParticipantWinnerId: string;

  @ApiProperty({
    name: "player1Position",
    type: "number",
    example: 1,
  })
  @Column({ type: "int" })
  player1Position: number;

  @ApiProperty({
    name: "player2Position",
    type: "number",
    example: 1,
  })
  @Column({ type: "int" })
  player2Position: number;

  @ApiProperty({
    name: "player1Odds",
    type: "number",
    example: 30.5,
  })
  @Column({ type: "decimal" })
  player1Odds: number;

  @ApiProperty({
    name: "player1Probability",
    type: "number",
    example: 30.5,
  })
  @Column({ type: "decimal" })
  player1Probability: number;

  @ApiProperty({
    name: "player1TrueProbability",
    type: "number",
    example: 30.5,
  })
  @Column({ type: "decimal" })
  player1TrueProbability: number;

  @ApiProperty({
    name: "player2Odds",
    type: "number",
    example: 30.5,
  })
  @Column({ type: "decimal" })
  player2Odds: number;

  @ApiProperty({
    name: "player2Probability",
    type: "number",
    example: 30.5,
  })
  @Column({ type: "decimal" })
  player2Probability: number;

  @ApiProperty({
    name: "player2TrueProbability",
    type: "number",
    example: 30.5,
  })
  @Column({ type: "decimal" })
  player2TrueProbability: number;

  @ApiProperty({
    name: "player1HasModifiedProbability",
    type: "boolean",
    example: true,
  })
  @Column({ type: "boolean" })
  player1HasModifiedProbability: boolean;

  @ApiProperty({
    name: "player2HasModifiedProbability",
    type: "boolean",
    example: true,
  })
  @Column({ type: "boolean" })
  player2HasModifiedProbability: boolean;

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
    name: "draw",
    type: "visible",
    example: false,
    default: false,
  })
  @Column({ type: "boolean" })
  visible: boolean;

  @ApiProperty({
    name: "holdingPercentage",
    type: "number",
    example: 35.5,
  })
  @Column({ type: "decimal" })
  holdingPercentage: number;

  abstract eventParticipant1: ObjectLiteral;
  abstract eventParticipant2: ObjectLiteral;
  abstract eventParticipantWinner: ObjectLiteral;
}

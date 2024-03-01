import { Base } from "../base.entity";
import { Column, Entity, Index, OneToOne, JoinColumn, ManyToOne } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

import Athletes from "./athletes.entity";
import RoundHeats from "./roundHeats.entity";

import { SportsDbSchema } from "../../constants/system";

@Entity({
  name: "scores",
  schema: SportsDbSchema.SLS,
})
export default class SLSScores extends Base {
  @ApiProperty({
    name: "eventId",
    type: "string",
    format: "uuid",
    example: "e97945e2-a627-499c-8699-9128dc46686e",
  })
  @Column({ type: "uuid" })
  @Index()
  eventId: string;

  @ApiProperty({
    name: "roundHeatId",
    type: "string",
    format: "uuid",
    example: "e97945e2-a627-499c-8699-9128dc46686e",
  })
  @Column({ type: "uuid" })
  @Index()
  roundHeatId: string;

  @ApiProperty({
    name: "athleteId",
    type: "string",
    format: "uuid",
    example: "e97945e2-a627-499c-8699-9128dc46686e",
  })
  @Column({ type: "uuid" })
  @Index()
  athleteId: string;

  @ApiProperty({
    name: "roundSeed",
    type: "number",
    example: 1,
  })
  @Column({ type: "int" })
  roundSeed: number;

  @ApiProperty({
    name: "lineScore1",
    type: "number",
    example: 2.54,
  })
  @Column({ type: "double precision" })
  lineScore1: number;

  @ApiProperty({
    name: "lineScore2",
    type: "number",
    example: 3.54,
  })
  @Column({ type: "double precision" })
  lineScore2: number;

  @ApiProperty({
    name: "roundScore",
    type: "number",
    example: 3.5,
  })
  @Column({ type: "int" })
  roundScore: number;

  @Column({ type: "text" })
  notes: string;

  @ApiProperty({
    name: "trick1Score",
    type: "number",
    format: "decimal",
    example: 10.3,
    required: true,
  })
  @Column({ type: "decimal" })
  trick1Score: number;

  @ApiProperty({
    name: "trick2Score",
    type: "number",
    format: "decimal",
    example: 10.3,
    required: true,
  })
  @Column({ type: "decimal" })
  trick2Score: number;

  @ApiProperty({
    name: "trick3Score",
    format: "decimal",
    type: "number",
    example: 10.3,
    required: true,
  })
  @Column({ type: "decimal" })
  trick3Score: number;

  @ApiProperty({
    name: "trick4Score",
    format: "decimal",
    type: "number",
    example: 10.3,
    required: true,
  })
  @Column({ type: "decimal" })
  trick4Score: number;

  @ApiProperty({
    name: "trick5Score",
    format: "decimal",
    type: "number",
    example: 10.3,
    required: true,
  })
  @Column({ type: "decimal" })
  trick5Score: number;

  @ApiProperty({
    name: "trick6Score",
    format: "decimal",
    type: "number",
    example: 10.3,
    required: true,
  })
  @Column({ type: "decimal" })
  trick6Score: number;

  @ApiProperty({
    name: "heatPosition",
    type: "number",
    example: 1,
  })
  @Column({ type: "int" })
  heatPosition: number;

  @OneToOne(() => Athletes)
  @JoinColumn({ name: "athleteId", referencedColumnName: "id" })
  athlete: Athletes;

  @ManyToOne(() => RoundHeats, (roundHeat) => roundHeat.scores)
  @JoinColumn({ name: "roundHeatId", referencedColumnName: "id" })
  heat: RoundHeats;

  constructor() {
    super();
    this.trick1Score = null;
    this.trick2Score = null;
    this.trick3Score = null;
    this.trick4Score = null;
    this.trick5Score = null;
    this.trick6Score = null;
  }
}

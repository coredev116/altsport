import { Base } from "../base.entity";
import { Entity, Column, Index, ManyToOne, OneToMany } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

import Rounds from "./rounds.entity";
import ProjectionEventHeatOutcome from "./projectionEventHeatOutcome.entity";
import ProjectionExactas from "./projectionExactas.entity";
import Scores from "./scores.entity";

import { HeatStatus, SportsDbSchema } from "../../constants/system";

@Entity({
  name: "roundHeats",
  schema: SportsDbSchema.MOTOCRS,
})
export default class MOTOCRSRoundHeats extends Base {
  @ApiProperty({
    name: "eventId",
    type: "string",
    example: "bc8a2ac2-0111-4b99-b402-08a19a731eda",
  })
  @Column({ type: "uuid" })
  @Index()
  eventId: string;

  @ApiProperty({
    name: "winnerAthleteId",
    type: "string",
    example: "bc8a2ac2-0111-4b99-b402-08a19a731eda",
  })
  @Column({ type: "uuid" })
  @Index()
  winnerAthleteId: string;

  @ApiProperty({
    name: "roundId",
    type: "string",
    example: "bc8a2ac2-0111-4b99-b402-08a19a731eda",
  })
  @Column({ type: "uuid" })
  @Index()
  roundId: string;

  @ApiProperty({
    name: "heatNo",
    type: "number",
    example: 7,
  })
  @Column({ type: "int" })
  heatNo: number;

  @ApiProperty({
    name: "heatStatus",
    type: "number",
    example: 1,
  })
  @Column({ type: "int" })
  heatStatus: number;

  @ApiProperty({
    name: "heatName",
    type: "string",
    example: "Heat 1",
  })
  @Column({ type: "text" })
  heatName: string;

  @ApiProperty({
    name: "startDate",
    type: "string",
    format: "date",
    example: "2022-02-18T15:25:24Z",
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
    name: "voidDate",
    type: "string",
    format: "date",
    example: "2022-02-19T15:25:24Z",
  })
  @Column({ type: "timestamptz" })
  voidDate: Date;

  @ApiProperty({ name: "isHeatWinnerMarketOpen", type: "boolean", example: false })
  @Column({ type: "boolean", default: false })
  isHeatWinnerMarketOpen: boolean;

  @ApiProperty({ name: "isHeatWinnerMarketVoided", type: "boolean", example: false })
  @Column({ type: "boolean", default: false })
  isHeatWinnerMarketVoided: boolean;

  @ManyToOne(() => Rounds, (round) => round.heats)
  round: Rounds;

  @OneToMany(() => ProjectionEventHeatOutcome, (eventOutcome) => eventOutcome.heat)
  heatOutcomes: ProjectionEventHeatOutcome[];

  @OneToMany(() => ProjectionExactas, (exacta) => exacta.heat)
  exactas: ProjectionExactas[];

  @OneToMany(() => Scores, (score) => score.heat)
  scores: Scores[];

  constructor() {
    super();
    this.heatStatus = HeatStatus.UPCOMING;
  }
}

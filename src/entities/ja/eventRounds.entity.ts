import { Base } from "../base.entity";
import { Entity, Column, Index, ManyToOne, OneToMany } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

import Events from "./events.entity";
import Scores from "./scores.entity";
import Odds from "./odds.entity";

import { SportsDbSchema, RoundStatus } from "../../constants/system";

@Entity({
  name: "eventRounds",
  schema: SportsDbSchema.JA,
})
export default class JAEventRounds extends Base {
  @Column({ type: "uuid" })
  @Index()
  eventId: string;

  @Column({ type: "text" })
  @Index()
  round: string;

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
    name: "roundStatus",
    type: "number",
    example: 1,
  })
  @Column({ type: "int" })
  roundStatus: RoundStatus;

  @ApiProperty({ name: "providerId", type: "string", example: "123abc" })
  @Column({ type: "text", nullable: false })
  providerId: string;

  @ManyToOne(() => Events, (event) => event.rounds)
  event: Events;

  @OneToMany(() => Scores, (score) => score.eventRound)
  scores: Scores[];

  @OneToMany(() => Odds, (odd) => odd.eventRound)
  odds: Odds[];
}

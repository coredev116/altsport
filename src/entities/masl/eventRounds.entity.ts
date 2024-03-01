import { Base } from "../base.entity";
import { Entity, Column, Index, ManyToOne, OneToMany } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

import Rounds from "./rounds.entity";
import Events from "./events.entity";
import Odds from "./odds.entity";

import { SportsDbSchema } from "../../constants/system";

@Entity({
  name: "eventRounds",
  schema: SportsDbSchema.MASL,
})
export default class MASLEventRounds extends Base {
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
    name: "roundId",
    type: "string",
    format: "uuid",
    example: "e97945e2-a627-499c-8699-9128dc46686e",
  })
  @Column({ type: "uuid" })
  @Index()
  roundId: string;

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
  roundStatus: number;

  @ApiProperty({
    name: "isSlackbotResultNotified",
    type: "boolean",
    example: false,
    default: false,
  })
  @Column({ type: "boolean" })
  isSlackbotResultNotified: boolean;

  @ManyToOne(() => Rounds, (round) => round.events)
  round: Rounds;

  @ManyToOne(() => Events, (event) => event.eventRounds)
  event: Events;

  @OneToMany(() => Odds, (odd) => odd.eventRound)
  odds: Odds[];
}

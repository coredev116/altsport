import { Base } from "../base.entity";
import { Entity, Column, Index, ManyToOne } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

import Rounds from "./rounds.entity";
import Events from "./events.entity";

import { SportsDbSchema } from "../../constants/system";

@Entity({
  name: "eventRounds",
  schema: SportsDbSchema.WSL,
})
export default class WSLEventRounds extends Base {
  @Column({ type: "uuid" })
  @Index()
  eventId: string;

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
    type: "string",
    example: "1",
  })
  @Column({ type: "text" })
  providerId: string;

  @ManyToOne(() => Rounds, (round) => round.eventRounds, { cascade: ["insert"] })
  round: Rounds;

  @ManyToOne(() => Events, (event) => event.rounds)
  event: Events;
}

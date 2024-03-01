import { Base } from "../base.entity";
import { Column, Entity, Index, OneToOne, JoinColumn, Unique } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

import Teams from "./teams.entity";
import Rounds from "./rounds.entity";
import Events from "./events.entity";

import { SportsDbSchema } from "../../constants/system";

@Entity({
  name: "scores",
  schema: SportsDbSchema.MASL,
})
@Unique("Unique_Score", ["eventId", "teamId", "roundId"])
export default class MASLScores extends Base {
  @ApiProperty({
    name: "teamId",
    type: "string",
    format: "uuid",
    example: "e97945e2-a627-499c-8699-9128dc46686e",
  })
  @Column({ type: "uuid" })
  @Index()
  teamId: string;

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
    name: "goals",
    type: "number",
    example: 1,
    default: 0,
  })
  @Column({ type: "int" })
  goals: number;

  @Column({ type: "text" })
  notes: string;

  @Column({ type: "boolean", default: false })
  isHomeTeam: boolean;

  @OneToOne(() => Teams)
  @JoinColumn({ name: "teamId", referencedColumnName: "id" })
  team: Teams;

  @OneToOne(() => Events)
  @JoinColumn({ name: "eventId", referencedColumnName: "id" })
  event: Events;

  @OneToOne(() => Rounds)
  @JoinColumn({ name: "roundId", referencedColumnName: "id" })
  round: Rounds;

  constructor() {
    super();
  }
}

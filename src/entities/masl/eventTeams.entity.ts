import { Column, Entity, Index, ManyToOne, OneToMany } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

import { Base } from "../base.entity";
import Events from "./events.entity";
import Teams from "./teams.entity";
import Odds from "./odds.entity";

import { SportsDbSchema } from "../../constants/system";

@Entity({
  name: "eventTeams",
  schema: SportsDbSchema.MASL,
})
export default class MASLEventTeams extends Base {
  @ApiProperty({
    name: "eventId",
    format: "uuid",
    type: "string",
    example: "d5590d4e-9534-4541-a702-b26a82fa23a0",
    required: true,
  })
  @Column({ type: "uuid" })
  @Index()
  eventId: string;

  @ApiProperty({
    name: "teamId",
    format: "uuid",
    type: "string",
    example: "593053",
    required: true,
  })
  @Column({ type: "uuid" })
  @Index()
  teamId: string;

  @Column({ type: "boolean", default: false })
  isHomeTeam: boolean;

  @ApiProperty({ name: "status", type: "number", example: 1, required: true })
  @Column({ type: "int" })
  status: number;

  @ManyToOne(() => Teams, (team) => team.events)
  team: Teams;

  @ManyToOne(() => Events, (event) => event.eventRounds)
  event: Events;

  @OneToMany(() => Odds, (odd) => odd.eventTeam)
  odds: Odds[];
}

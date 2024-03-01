import { Column, Entity, ManyToOne, OneToMany, OneToOne, JoinColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

import { Base } from "../base.entity";
import Events from "./events.entity";
import Teams from "./teams.entity";
import Odds from "./odds.entity";
import Athletes from "./athletes.entity";

import { SportsDbSchema } from "../../constants/system";

@Entity({
  name: "eventTeams",
  schema: SportsDbSchema.JA,
})
export default class JAEventTeams extends Base {
  @ApiProperty({
    name: "eventId",
    format: "uuid",
    type: "string",
    example: "d5590d4e-9534-4541-a702-b26a82fa23a0",
    required: true,
  })
  @Column({ type: "uuid" })
  eventId: string;

  @ApiProperty({
    name: "teamId",
    format: "uuid",
    type: "string",
    example: "593053",
    required: true,
  })
  @Column({ type: "uuid" })
  teamId: string;

  @Column({ type: "boolean", default: false })
  isHomeTeam: boolean;

  @Column({ type: "boolean", default: false })
  isServing: boolean;

  @Column({ type: "text", default: null })
  servingAthleteId: string;

  @ApiProperty({ name: "status", type: "number", example: 1, required: true })
  @Column({ type: "int" })
  status: number;

  @Column({ type: "uuid" })
  athlete1Id: string;

  @Column({ type: "uuid" })
  athlete2Id: string;

  @ManyToOne(() => Teams, (team) => team.events)
  team: Teams;

  @ManyToOne(() => Events, (event) => event.rounds)
  event: Events;

  @OneToMany(() => Odds, (odd) => odd.eventTeam)
  odds: Odds[];

  @OneToOne(() => Athletes)
  @JoinColumn({ name: "athlete1Id", referencedColumnName: "id" })
  athlete1: Athletes;

  @OneToOne(() => Athletes)
  @JoinColumn({ name: "athlete2Id", referencedColumnName: "id" })
  athlete2: Athletes;
}

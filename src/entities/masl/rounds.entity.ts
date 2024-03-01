import { Column, Entity, OneToMany } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

import { Base } from "../base.entity";
import EventRounds from "./eventRounds.entity";
import Scores from "./scores.entity";

import { SportsDbSchema } from "../../constants/system";

@Entity({
  name: "rounds",
  schema: SportsDbSchema.MASL,
})
export default class MASLRounds extends Base {
  @ApiProperty({
    name: "name",
    type: "string",
    example: "Q1",
  })
  @Column({ type: "text" })
  name: string;

  @ApiProperty({
    name: "roundNo",
    type: "number",
    example: 1,
  })
  @Column({ type: "int" })
  roundNo: number;

  @OneToMany(() => EventRounds, (event) => event.round)
  events: EventRounds[];

  @OneToMany(() => Scores, (score) => score.round)
  scores: Scores[];
}

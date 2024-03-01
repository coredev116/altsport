import { Base } from "../base.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

import Heats from "./roundHeats.entity";
import EventRounds from "./eventRounds.entity";

import { SportsDbSchema } from "../../constants/system";

@Entity({
  name: "rounds",
  schema: SportsDbSchema.WSL,
})
export default class WSLRounds extends Base {
  @ApiProperty({
    name: "name",
    type: "string",
    example: "Round of 32",
  })
  @Column({ type: "text" })
  name: string;

  @ApiProperty({
    name: "roundNo",
    type: "number",
    example: 7,
  })
  @Column({ type: "int" })
  roundNo: number;

  @OneToMany(() => EventRounds, (eventRounds) => eventRounds.round, { cascade: ["insert"] })
  eventRounds: EventRounds[];

  @OneToMany(() => Heats, (heat) => heat.round)
  heats: Heats[];
}

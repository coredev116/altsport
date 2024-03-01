import { Base } from "../base.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

import EventRounds from "./eventRounds.entity";

import { SportsDbSchema } from "../../constants/system";

@Entity({
  name: "rounds",
  schema: SportsDbSchema.PBR,
})
export default class PBRRounds extends Base {
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
}

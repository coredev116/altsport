import { Column, Entity, OneToMany } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

import { Base } from "../base.entity";
import LeagueYears from "./leagueYears.entity";

import { SportsDbSchema } from "../../constants/system";

@Entity({
  name: "leagues",
  schema: SportsDbSchema.SLS,
})
export default class SLSLeagues extends Base {
  @ApiProperty({
    name: "name",
    type: "string",
    example: "SLS",
    required: true,
  })
  @Column({ type: "text" })
  name: string;

  @ApiProperty({
    name: "gender",
    type: "string",
    example: "men",
    required: true,
  })
  @Column({ type: "text" })
  gender: string;

  @OneToMany(() => LeagueYears, (year) => year.league, { cascade: ["insert"] })
  years: LeagueYears[];
}

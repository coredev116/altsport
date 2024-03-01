import { Column, Entity, OneToMany } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

import { Base } from "../base.entity";
import LeagueYears from "./leagueYears.entity";

import { SportsDbSchema } from "../../constants/system";

@Entity({
  name: "leagues",
  schema: SportsDbSchema.MASL,
})
export default class MASLLeagues extends Base {
  @ApiProperty({
    name: "name",
    type: "string",
    example: "Major Arena Soccer League",
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

  @ApiProperty({
    name: "providerLastUpdated",
    type: "string",
    example: "2023-02-12 02:57:09 +0000",
  })
  @Column({ type: "text" })
  providerLastUpdated: string;

  @OneToMany(() => LeagueYears, (year) => year.league, { cascade: ["insert"] })
  years: LeagueYears[];
}

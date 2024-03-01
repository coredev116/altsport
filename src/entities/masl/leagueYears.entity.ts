import { Column, Entity, Index, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

import { Base } from "../base.entity";
import Leagues from "./leagues.entity";
import Events from "./events.entity";
import Futures from "./futures.entity";

import { SportsDbSchema } from "../../constants/system";

@Entity({
  name: "leagueYears",
  schema: SportsDbSchema.MASL,
})
export default class MASLLeagueYears extends Base {
  @ApiProperty({
    name: "leagueId",
    format: "uuid",
    type: "string",
    example: "d5590d4e-9534-4541-a702-b26a82fa23a0",
    required: true,
  })
  @Column({ type: "uuid" })
  @Index()
  leagueId: string;

  @ApiProperty({
    name: "year",
    type: "number",
    example: 2021,
    required: true,
  })
  @Column({ type: "int" })
  year: number;

  @ApiProperty({
    name: "providerLastUpdated",
    type: "string",
    example: "2023-02-12 02:57:09 +0000",
  })
  @Column({ type: "text" })
  providerLastUpdated: string;

  @ManyToOne(() => Events)
  @JoinColumn({ name: "id", referencedColumnName: "leagueYearId" })
  event: Events;

  @ManyToOne(() => Leagues, (league) => league.years, { cascade: ["insert"] })
  league: Leagues;

  @OneToMany(() => Events, (event) => event.leagueYear)
  @JoinColumn({ name: "id", referencedColumnName: "leagueYearId" })
  events: Events[];

  @OneToMany(() => Futures, (future) => future.tourYear)
  @JoinColumn({ name: "id", referencedColumnName: "leagueYearId" })
  futures: Futures[];
}

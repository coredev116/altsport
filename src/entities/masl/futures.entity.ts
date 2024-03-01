import { Entity, JoinColumn, OneToOne } from "typeorm";

import LeagueYears from "./leagueYears.entity";

import Futures from "../common/futures.entity";

import { SportsDbSchema } from "../../constants/system";

@Entity({
  name: "futures",
  schema: SportsDbSchema.MASL,
})
export default class MASLFutures extends Futures {
  @OneToOne(() => LeagueYears)
  @JoinColumn({ name: "tourYearId", referencedColumnName: "id" })
  tourYear: LeagueYears;
}

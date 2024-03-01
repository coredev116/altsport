import { Entity, JoinColumn, OneToOne, Column } from "typeorm";

import Teams from "./teams.entity";

import FutureOdds from "../common/futureOdds.entity";

import { SportsDbSchema } from "../../constants/system";

@Entity({
  name: "futureOdds",
  schema: SportsDbSchema.JA,
})
export default class JAFutureOdds extends FutureOdds {
  @Column({ type: "uuid" })
  teamId: string;

  athlete: null;

  @OneToOne(() => Teams)
  @JoinColumn({ name: "teamId", referencedColumnName: "id" })
  team: Teams;
}

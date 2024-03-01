import { Entity, JoinColumn, OneToOne, Column } from "typeorm";

import Teams from "./teams.entity";

import FutureOdds from "../common/clientFutureOdds.entity";

import { SportsDbSchema } from "../../constants/system";

@Entity({
  name: "clientFutureOdds",
  schema: SportsDbSchema.MASL,
})
export default class MASLClientFutureOdds extends FutureOdds {
  @Column({ type: "uuid" })
  teamId: string;

  athlete: null;

  @OneToOne(() => Teams)
  @JoinColumn({ name: "teamId", referencedColumnName: "id" })
  team: Teams;
}

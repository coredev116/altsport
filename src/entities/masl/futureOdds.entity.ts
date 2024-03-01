import { Entity, JoinColumn, OneToOne, Column } from "typeorm";

import FutureOdds from "../common/futureOdds.entity";
import Teams from "./teams.entity";

import { SportsDbSchema } from "../../constants/system";

@Entity({
  name: "futureOdds",
  schema: SportsDbSchema.MASL,
})
export default class MASLFutureOdds extends FutureOdds {
  @Column({ type: "uuid" })
  teamId: string;

  athlete: null;

  @OneToOne(() => Teams)
  @JoinColumn({ name: "teamId", referencedColumnName: "id" })
  team: Teams;
}

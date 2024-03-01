import { Entity, JoinColumn, OneToOne, OneToMany, Column } from "typeorm";

import TourYears from "./tourYears.entity";

import Futures from "../common/futures.entity";
import ClientFutureOdds from "./clientFutureOdds.entity";

import { SportsDbSchema } from "../../constants/system";

@Entity({
  name: "futures",
  schema: SportsDbSchema.WSL,
})
export default class WSLFutures extends Futures {
  @Column({ type: "text" })
  providerOpenbetFixtureId: string;

  @OneToOne(() => TourYears)
  @JoinColumn({ name: "tourYearId", referencedColumnName: "id" })
  tourYear: TourYears;

  @OneToMany(() => ClientFutureOdds, (odds) => odds.future)
  clientOdds: ClientFutureOdds[];
}

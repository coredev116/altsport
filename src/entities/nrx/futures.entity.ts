import { Entity, JoinColumn, OneToOne } from "typeorm";

import TourYears from "./tourYears.entity";

import Futures from "../common/futures.entity";

import { SportsDbSchema } from "../../constants/system";

@Entity({
  name: "futures",
  schema: SportsDbSchema.NRX,
})
export default class WRXFutures extends Futures {
  @OneToOne(() => TourYears)
  @JoinColumn({ name: "tourYearId", referencedColumnName: "id" })
  tourYear: TourYears;
}

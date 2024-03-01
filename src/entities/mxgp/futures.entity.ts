import { Entity, JoinColumn, OneToOne } from "typeorm";

import TourYears from "./tourYears.entity";

import Futures from "../common/futures.entity";

import { SportsDbSchema } from "../../constants/system";

@Entity({
  name: "futures",
  schema: SportsDbSchema.MXGP,
})
export default class MXGPFutures extends Futures {
  @OneToOne(() => TourYears)
  @JoinColumn({ name: "tourYearId", referencedColumnName: "id" })
  tourYear: TourYears;
}

import { Column, Entity, Index, ManyToOne, OneToMany, JoinColumn } from "typeorm";

import { Base } from "../base.entity";
import Tour from "./tours.entity";
import Events from "./events.entity";
import Futures from "./futures.entity";

import { SportsDbSchema } from "../../constants/system";

@Entity({
  name: "tourYears",
  schema: SportsDbSchema.PBR,
})
export default class PBRTourYears extends Base {
  @Column({ type: "uuid" })
  @Index()
  tourId: string;

  @Column({ type: "int" })
  year: number;

  @ManyToOne(() => Tour, (tour) => tour.years, { cascade: ["insert"] })
  tour: Tour;

  @ManyToOne(() => Events)
  @JoinColumn({ name: "id", referencedColumnName: "tourYearId" })
  event: Events;

  @OneToMany(() => Events, (event) => event.tourYear)
  @JoinColumn({ name: "id", referencedColumnName: "tourYearId" })
  events: Events[];

  @OneToMany(() => Futures, (future) => future.tourYear)
  @JoinColumn({ name: "id", referencedColumnName: "tourYearId" })
  futures: Futures[];
}

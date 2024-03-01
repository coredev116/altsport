import { Base } from "../base.entity";
import { Column, Entity, Index, ManyToOne } from "typeorm";

import { SportsDbSchema } from "../../constants/system";

import Events from "./events.entity";

@Entity({
  name: "simulationWeights",
  schema: SportsDbSchema.WSL,
})
export default class WSLSimulationWeights extends Base {
  @Column({ type: "uuid" })
  @Index()
  eventId: string;

  @Column({ type: "text" })
  type: string;

  @Column({ type: "int" })
  year: number;

  @Column({ type: "text" })
  location: string;

  @Column({ type: "decimal" })
  weight: number;

  @ManyToOne(() => Events, (event) => event.simulationWeights)
  event: Events;
}

import { Entity, JoinColumn, OneToOne, ManyToOne } from "typeorm";

import RoundHeats from "./roundHeats.entity";
import Events from "./events.entity";

import ProjectionExactas from "../common/projectionExactas.entity";

import { SportsDbSchema } from "../../constants/system";

@Entity({
  name: "clientProjectionExactas",
  schema: SportsDbSchema.SPR,
})
export default class SPRClientProjectionExactas extends ProjectionExactas {
  @OneToOne(() => Events)
  @JoinColumn({ name: "eventId", referencedColumnName: "id" })
  event: Events;

  @ManyToOne(() => RoundHeats, (roundHeat) => roundHeat.heatOutcomes)
  @JoinColumn({ name: "roundHeatId", referencedColumnName: "id" })
  heat: RoundHeats;
}

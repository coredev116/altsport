import { Base } from "../base.entity";
import { Column, Entity, ManyToOne } from "typeorm";

import Athletes from "./athletes.entity";
import Events from "./events.entity";

import { SportsDbSchema } from "../../constants/system";

@Entity({
  name: "eventResults",
  schema: SportsDbSchema.WSL,
})
export default class WSLEventResults extends Base {
  @Column({ type: "uuid" })
  eventId: string;

  @Column({ type: "uuid" })
  athleteId: string;

  @Column({ type: "double precision" })
  eventPoints: number;

  @Column({ type: "int" })
  eventRank: number;

  @ManyToOne(() => Events, (event) => event.id)
  event: Events;

  @ManyToOne(() => Athletes, (athlete) => athlete.id)
  athlete: Athletes;
}

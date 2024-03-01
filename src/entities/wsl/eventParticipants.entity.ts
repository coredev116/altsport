import { Base } from "../base.entity";
import { Entity, Column, Index, ManyToOne } from "typeorm";

import Events from "./events.entity";
import Athletes from "./athletes.entity";

import { SportsDbSchema } from "../../constants/system";

@Entity({
  name: "eventParticipants",
  schema: SportsDbSchema.WSL,
})
export default class WSLEventParticipants extends Base {
  @Column({ type: "uuid" })
  @Index()
  eventId: string;

  @Column({ type: "uuid" })
  @Index()
  athleteId: string;

  @Column({ type: "int" })
  seedNo: number;

  @Column({ type: "text" })
  tier: string;

  @Column({ type: "text" })
  tierSeed: string;

  @Column({ type: "decimal" })
  baseProjection: number;

  @Column({ type: "int" })
  status: number;

  @Column({ type: "text" })
  notes: string;

  @ManyToOne(() => Events, (event) => event.participants)
  event: Events;

  @ManyToOne(() => Athletes, (athlete) => athlete.participants)
  athlete: Athletes;

  constructor() {
    super();

    this.status = 1;
  }
}

import { Base } from "../base.entity";
import { Entity, Column, Index, ManyToOne } from "typeorm";

import Events from "./events.entity";
import Athletes from "./athletes.entity";

import { SportsDbSchema } from "../../constants/system";

@Entity({
  name: "eventParticipants",
  schema: SportsDbSchema.PBR,
})
export default class PBREventParticipants extends Base {
  @Column({ type: "uuid" })
  @Index()
  eventId: string;

  @Column({ type: "uuid" })
  @Index()
  athleteId: string;

  @ManyToOne(() => Events, (event) => event.participants)
  event: Events;

  @ManyToOne(() => Athletes, (athlete) => athlete.participants)
  athlete: Athletes;

  constructor() {
    super();
  }
}

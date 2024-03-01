import { Base } from "../base.entity";
import { Column, Entity, Index, OneToOne, JoinColumn, Unique } from "typeorm";

import Athletes from "./athletes.entity";
import Bulls from "./bulls.entity";

import { SportsDbSchema } from "../../constants/system";

@Entity({
  name: "scores",
  schema: SportsDbSchema.PBR,
})
@Unique("Unique_Score", ["eventId", "roundId", "athleteId", "bullId"])
export default class PBRScores extends Base {
  @Column({ type: "uuid" })
  @Index()
  eventId: string;

  @Column({ type: "uuid" })
  @Index()
  roundId: string;

  @Column({ type: "uuid" })
  @Index()
  athleteId: string;

  @Column({ type: "uuid" })
  @Index()
  bullId: string;

  @Column({ type: "double precision" })
  riderScore: number;

  @Column({ type: "double precision" })
  bullScore: number;

  @OneToOne(() => Athletes)
  @JoinColumn({ name: "athleteId", referencedColumnName: "id" })
  athlete: Athletes;

  @OneToOne(() => Bulls)
  @JoinColumn({ name: "bullId", referencedColumnName: "id" })
  bull: Bulls;
}

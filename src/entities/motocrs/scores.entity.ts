import { Base } from "../base.entity";
import { Column, Entity, Index, OneToOne, JoinColumn, ManyToOne } from "typeorm";

import Athletes from "./athletes.entity";
import RoundHeats from "./roundHeats.entity";

import { SportsDbSchema } from "../../constants/system";

@Entity({
  name: "scores",
  schema: SportsDbSchema.MOTOCRS,
})
export default class MOTOCRSScores extends Base {
  @Column({ type: "uuid" })
  @Index()
  eventId: string;

  @Column({ type: "uuid" })
  @Index()
  roundHeatId: string;

  @Column({ type: "uuid" })
  @Index()
  athleteId: string;

  @Column({ type: "int" })
  roundSeed: number;

  @Column({ type: "double precision" })
  lapTime: number;

  @Column({ type: "int" })
  heatPosition: number;

  @Column({ type: "text" })
  notes: string;

  @Column({ type: "int" })
  lapNumber: number;

  @OneToOne(() => Athletes)
  @JoinColumn({ name: "athleteId", referencedColumnName: "id" })
  athlete: Athletes;

  @ManyToOne(() => RoundHeats, (roundHeat) => roundHeat.scores)
  @JoinColumn({ name: "roundHeatId", referencedColumnName: "id" })
  heat: RoundHeats;
}

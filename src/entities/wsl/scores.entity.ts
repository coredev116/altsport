import { Base } from "../base.entity";
import { Column, Entity, Index, OneToOne, JoinColumn, ManyToOne } from "typeorm";

import Athletes from "./athletes.entity";
import RoundHeats from "./roundHeats.entity";

import { SportsDbSchema } from "../../constants/system";

@Entity({
  name: "scores",
  schema: SportsDbSchema.WSL,
})
export default class WSLScores extends Base {
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
  heatScore: number;

  @Column({ type: "int" })
  heatPosition: number;

  @Column({ type: "text" })
  notes: string;

  // @OneToMany(() => Athletes, (athlete) => athlete.roundScore)
  @OneToOne(() => Athletes)
  @JoinColumn({ name: "athleteId", referencedColumnName: "id" })
  athlete: Athletes;

  @ManyToOne(() => RoundHeats, (roundHeat) => roundHeat.scores)
  @JoinColumn({ name: "roundHeatId", referencedColumnName: "id" })
  heat: RoundHeats;
}

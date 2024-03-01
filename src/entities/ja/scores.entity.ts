import { Base } from "../base.entity";
import { Column, Entity, OneToOne, JoinColumn, Unique } from "typeorm";

import Athletes from "./athletes.entity";
import Teams from "./teams.entity";
import EventRounds from "./eventRounds.entity";

import { SportsDbSchema } from "../../constants/system";

@Entity({
  name: "scores",
  schema: SportsDbSchema.JA,
})
@Unique("Unique_Score", ["eventRoundId", "athleteId", "teamId"])
export default class JAScores extends Base {
  @Column({ type: "uuid" })
  eventId: string;

  @Column({ type: "uuid" })
  teamId: string;

  @Column({ type: "uuid" })
  athleteId: string;

  @Column({ type: "uuid" })
  eventRoundId: string;

  @Column({ type: "int" })
  score: number;

  @Column({ type: "text" })
  providerId: string;

  @OneToOne(() => Teams)
  @JoinColumn({ name: "teamId", referencedColumnName: "id" })
  team: Teams;

  @OneToOne(() => Athletes)
  @JoinColumn({ name: "athleteId", referencedColumnName: "id" })
  athlete: Athletes;

  @OneToOne(() => EventRounds)
  @JoinColumn({ name: "eventRoundId", referencedColumnName: "id" })
  eventRound: EventRounds;
}

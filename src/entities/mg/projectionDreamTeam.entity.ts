import { Base } from "../base.entity";
import { Entity, Column, Index, ManyToOne, OneToMany } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

import Events from "./events.entity";
import ProjectionDreamTeamParticipants from "./projectionDreamTeamParticipants.entity";

import { SportsDbSchema } from "../../constants/system";

@Entity({
  name: "projectionDreamTeam",
  schema: SportsDbSchema.MotoGP,
})
export default class MGProjectionDreamTeam extends Base {
  @ApiProperty({
    name: "eventId",
    type: "string",
    example: "bc8a2ac2-0111-4b99-b402-08a19a731eda",
  })
  @Column({ type: "uuid" })
  @Index()
  eventId: string;

  @ApiProperty({
    type: "string",
    example: "1b143c63cdca4b0a94ed4ad9a36d2e6b",
  })
  @Column({ type: "text" })
  providerId: string;

  @ApiProperty({
    name: "voided",
    type: "boolean",
    example: true,
  })
  @Column({ type: "boolean" })
  voided: boolean;

  @ApiProperty({
    name: "draw",
    type: "boolean",
    example: true,
  })
  @Column({ type: "boolean" })
  draw: boolean;

  @ManyToOne(() => Events, (event) => event.projectionDreamTeam)
  event: Events;

  @OneToMany(
    () => ProjectionDreamTeamParticipants,
    (participant) => participant.projectionDreamTeam,
    { cascade: true },
  )
  participants: ProjectionDreamTeamParticipants[];
}

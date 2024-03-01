import { Entity, OneToOne, JoinColumn, Column } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

import EventParticipants from "./eventParticipants.entity";
import { SportsDbSchema } from "../../constants/system";

import PlayerHeadToHeadsBase from "../common/playerHeadToHeads.entity";

@Entity({
  name: "playerHeadToHeads",
  schema: SportsDbSchema.MXGP,
})
export default class MXGPPlayerHeadToHeads extends PlayerHeadToHeadsBase {
  @ApiProperty({
    type: "string",
    example: "1b143c63cdca4b0a94ed4ad9a36d2e6b",
  })
  @Column({ type: "text" })
  providerId: string;

  @OneToOne(() => EventParticipants)
  @JoinColumn({ name: "eventParticipant1Id", referencedColumnName: "id" })
  eventParticipant1: EventParticipants;

  @OneToOne(() => EventParticipants)
  @JoinColumn({ name: "eventParticipant2Id", referencedColumnName: "id" })
  eventParticipant2: EventParticipants;

  @OneToOne(() => EventParticipants)
  @JoinColumn({ name: "eventParticipantWinnerId", referencedColumnName: "id" })
  eventParticipantWinner: EventParticipants;
}

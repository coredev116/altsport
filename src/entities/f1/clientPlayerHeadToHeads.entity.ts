import { Entity, OneToOne, JoinColumn } from "typeorm";

import EventParticipants from "./eventParticipants.entity";
import { SportsDbSchema } from "../../constants/system";

import PlayerHeadToHeadsBase from "../common/playerHeadToHeads.entity";

@Entity({
  name: "clientPlayerHeadToHeads",
  schema: SportsDbSchema.F1,
})
export default class F1ClientPlayerHeadToHeads extends PlayerHeadToHeadsBase {
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

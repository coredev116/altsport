import { Base } from "../base.entity";
import { Entity, Column, Index, OneToOne, JoinColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

import EventParticipants from "./eventParticipants.entity";

import { SportsDbSchema } from "../../constants/system";

@Entity({
  name: "projectionEventShows",
  schema: SportsDbSchema.NRX,
})
export default class WRXProjectionEventShows extends Base {
  @ApiProperty({
    name: "eventId",
    type: "string",
    example: "bc8a2ac2-0111-4b99-b402-08a19a731eda",
  })
  @Column({ type: "uuid" })
  @Index()
  eventId: string;

  @ApiProperty({
    name: "eventParticipantId",
    type: "string",
    example: "bc8a2ac2-0111-4b99-b402-08a19a731eda",
  })
  @Column({ type: "uuid" })
  @Index()
  eventParticipantId: string;

  @ApiProperty({
    name: "odds",
    type: "number",
    example: 30.5,
  })
  @Column({ type: "decimal" })
  odds: number;

  @ApiProperty({
    name: "probability",
    type: "number",
    example: 30.5,
  })
  @Column({ type: "decimal" })
  probability: number;

  @ApiProperty({
    name: "trueProbability",
    type: "number",
    example: 30.5,
  })
  @Column({ type: "decimal" })
  trueProbability: number;

  @ApiProperty({ name: "hasModifiedProbability", type: "boolean", example: "false" })
  @Column({ type: "boolean", default: false })
  hasModifiedProbability: boolean;

  @OneToOne(() => EventParticipants)
  @JoinColumn({ name: "eventParticipantId", referencedColumnName: "id" })
  participant: EventParticipants;
}

import { Base } from "../base.entity";
import { Entity, Column, Index, OneToOne, JoinColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

import EventParticipants from "./eventParticipants.entity";
import { SportsDbSchema } from "../../constants/system";

@Entity({
  name: "clientPropBets",
  schema: SportsDbSchema.MOTOCRS,
})
export default class MOTOCRSClientPropBets extends Base {
  @ApiProperty({
    name: "eventId",
    type: "string",
    format: "uuid",
    example: "e97945e2-a627-499c-8699-9128dc46686e",
  })
  @Column({ type: "uuid" })
  @Index()
  eventId: string;

  @ApiProperty({
    name: "betId",
    type: "string",
    example: "9202fa15-522b-44b7-9e0e-7032f6170f22",
  })
  @Column({ type: "uuid" })
  @Index()
  betId: string;

  @ApiProperty({
    name: "eventParticipantId",
    type: "string",
    example: "bc8a2ac2-0111-4b99-b402-08a19a731eda",
  })
  @Column({ type: "uuid" })
  @Index()
  eventParticipantId: string;

  @ApiProperty({ name: "proposition", type: "string", example: "Reaches quarterfinals" })
  @Column({ type: "text" })
  proposition: string;

  @ApiProperty({
    name: "odds",
    format: "decimal",
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
    name: "payout",
    type: "boolean",
    example: true,
  })
  @Column({ type: "boolean" })
  payout: boolean;

  @ApiProperty({
    name: "voided",
    type: "boolean",
    example: true,
  })
  @Column({ type: "boolean" })
  voided: boolean;

  @OneToOne(() => EventParticipants)
  @JoinColumn({ name: "eventParticipantId", referencedColumnName: "id" })
  eventParticipant: EventParticipants;
}

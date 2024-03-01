import { Entity, Column, OneToMany, OneToOne, JoinColumn } from "typeorm";
import { Base } from "../base.entity";

import { AthleteStatus, SportsDbSchema } from "../../constants/system";
import { ApiProperty } from "@nestjs/swagger";

import EventParticipants from "./eventParticipants.entity";

@Entity({
  name: "athletes",
  schema: SportsDbSchema.MotoGP,
})
export default class MGAthletes extends Base {
  @ApiProperty({ name: "firstName", type: "string", example: "Michael" })
  @Column({ type: "text" })
  firstName: string;

  @ApiProperty({ name: "middleName", type: "string", example: "J" })
  @Column({ type: "text", nullable: true })
  middleName: string;

  @ApiProperty({ name: "lastName", type: "string", example: "Jordan" })
  @Column({ type: "text", nullable: true })
  lastName: string;

  @ApiProperty({
    name: "dob",
    type: "string",
    format: "date",
    example: "2022-04-18T15:25:24Z",
  })
  @Column({ type: "timestamptz", nullable: true })
  dob: Date;

  @ApiProperty({ name: "gender", type: "string", example: "men" })
  @Column({ type: "text", nullable: true })
  gender: string;

  @ApiProperty({ name: "nationality", type: "string", example: "India" })
  @Column({ type: "text", nullable: true })
  nationality: string;

  @ApiProperty({ name: "stance", type: "string", example: "Regular" })
  @Column({ type: "text" })
  stance: string;

  @ApiProperty({ name: "hometown", type: "string", example: "Mumbai" })
  @Column({ type: "text", nullable: true })
  hometown: string;

  @ApiProperty({
    type: "string",
    example: "1",
  })
  @Column({ type: "text" })
  providerId: string;

  @ApiProperty({ name: "playerStatus", type: "number", example: 1 })
  @Column({ type: "int", default: AthleteStatus.ACTIVE })
  playerStatus: AthleteStatus;

  @OneToMany(() => EventParticipants, (participant) => participant.athlete)
  participants: EventParticipants[];

  @OneToOne(() => EventParticipants)
  @JoinColumn({ name: "id", referencedColumnName: "athleteId" })
  participant: EventParticipants;

  constructor() {
    super();
    this.playerStatus = AthleteStatus.ACTIVE;
  }
}

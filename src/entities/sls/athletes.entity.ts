import { Entity, Column, OneToMany, OneToOne, JoinColumn } from "typeorm";
import { Base } from "../base.entity";

import { AthleteStatus, SportsDbSchema } from "../../constants/system";
import { ApiProperty } from "@nestjs/swagger";

import EventParticipants from "./eventParticipants.entity";

@Entity({
  name: "athletes",
  schema: SportsDbSchema.SLS,
})
export default class SLSAthletes extends Base {
  @ApiProperty({ name: "firstName", type: "string", example: "Rayssa" })
  @Column({ type: "text" })
  firstName: string;

  @ApiProperty({ name: "middleName", type: "string", example: "J" })
  @Column({ type: "text", nullable: true })
  middleName: string;

  @ApiProperty({ name: "lastName", type: "string", example: "Leal" })
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

  @ApiProperty({ name: "nationality", type: "string", example: "Japan" })
  @Column({ type: "text", nullable: true })
  nationality: string;

  @ApiProperty({ name: "hometown", type: "string", example: "Tokyo" })
  @Column({ type: "text", nullable: true })
  hometown: string;

  @ApiProperty({ name: "yearStatus", type: "number", example: 1 })
  @Column({ type: "int", default: AthleteStatus.ACTIVE })
  yearStatus: AthleteStatus;

  @ApiProperty({ name: "yearPoints", type: "number", example: 0 })
  @Column({ type: "int", default: 0 })
  yearPoints: number;

  @ApiProperty({ name: "yearRank", type: "number", example: 1 })
  @Column({ type: "int" })
  yearRank: number;

  @ApiProperty({ name: "playerStatus", type: "number", example: 1 })
  @Column({ type: "int", default: AthleteStatus.ACTIVE })
  playerStatus: AthleteStatus;

  @ApiProperty({ name: "stance", type: "string", example: "Regular" })
  @Column({ type: "text" })
  stance: string;

  @ApiProperty({
    type: "string",
    example: "a3865d51-a769-11ed-8fa2-2760606e7252",
  })
  @Column({ type: "text" })
  providerId: string;

  @OneToMany(() => EventParticipants, (participant) => participant.athlete)
  participants: EventParticipants[];

  @OneToOne(() => EventParticipants)
  @JoinColumn({ name: "id", referencedColumnName: "athleteId" })
  participant: EventParticipants;

  constructor() {
    super();
    this.yearPoints = 0;
    this.yearRank = 0;
    this.yearStatus = AthleteStatus.ACTIVE;
    this.playerStatus = AthleteStatus.ACTIVE;
  }
}

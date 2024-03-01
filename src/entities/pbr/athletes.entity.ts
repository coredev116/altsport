import { Entity, Column, OneToMany, OneToOne, JoinColumn } from "typeorm";
import { Base } from "../base.entity";

import { SportsDbSchema } from "../../constants/system";
import { ApiProperty } from "@nestjs/swagger";

import EventParticipants from "./eventParticipants.entity";

@Entity({
  name: "athletes",
  schema: SportsDbSchema.PBR,
})
export default class PBRAthletes extends Base {
  @ApiProperty({ name: "firstName", type: "string", example: "Wade" })
  @Column({ type: "text" })
  firstName: string;

  @ApiProperty({ name: "middleName", type: "string", example: "J" })
  @Column({ type: "text", nullable: true })
  middleName: string;

  @ApiProperty({ name: "lastName", type: "string", example: "Leslie" })
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

  @ApiProperty({ name: "nationality", type: "string", example: "USA" })
  @Column({ type: "text", nullable: true })
  nationality: string;

  @ApiProperty({ name: "hometown", type: "string", example: "WA" })
  @Column({ type: "text", nullable: true })
  hometown: string;

  @ApiProperty({ name: "providerId", type: "string", example: "1234" })
  @Column({ type: "text" })
  providerId: string;

  @OneToMany(() => EventParticipants, (participant) => participant.athlete)
  participants: EventParticipants[];

  @OneToOne(() => EventParticipants)
  @JoinColumn({ name: "id", referencedColumnName: "athleteId" })
  participant: EventParticipants;

  constructor() {
    super();
  }
}

import { Base } from "../base.entity";
import { Entity, Column, Index, ManyToOne } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

import Events from "./events.entity";
import Athletes from "./athletes.entity";

import { SportsDbSchema } from "../../constants/system";

@Entity({
  name: "eventParticipants",
  schema: SportsDbSchema.SLS,
})
export default class SLSEventParticipants extends Base {
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
    name: "athleteId",
    type: "string",
    format: "uuid",
    example: "e97945e2-a627-499c-8699-9128dc46686e",
  })
  @Column({ type: "uuid" })
  @Index()
  athleteId: string;

  @ApiProperty({
    name: "seedNo",
    type: "number",
    example: 7,
  })
  @Column({ type: "int" })
  seedNo: number;

  @ApiProperty({
    name: "baseRoundScore",
    type: "number",
    format: "decimal",
    example: 30.2,
  })
  @Column({ type: "decimal" })
  baseRoundScore: number;

  @ApiProperty({
    name: "baseRunScore",
    type: "number",
    format: "decimal",
    example: 23.2,
  })
  @Column({ type: "decimal" })
  baseRunScore: number;

  @ApiProperty({
    name: "baseTrickScore",
    type: "number",
    format: "decimal",
    example: 5.7,
  })
  @Column({ type: "decimal" })
  baseTrickScore: number;

  @ApiProperty({
    name: "trickCompletion",
    type: "number",
    example: 3.5,
  })
  @Column({ type: "decimal" })
  trickCompletion: number;

  @ApiProperty({
    name: "status",
    type: "number",
    example: 1,
  })
  @Column({ type: "int" })
  status: number;

  @ApiProperty({
    name: "notes",
    type: "string",
    example: "Random text here",
    required: false,
  })
  @Column({ type: "text" })
  notes: string;

  @ManyToOne(() => Events, (event) => event.participants)
  event: Events;

  @ManyToOne(() => Athletes, (athlete) => athlete.participants)
  athlete: Athletes;

  constructor() {
    super();

    this.status = 1;
  }
}

import { Base } from "../base.entity";
import { Column, Entity, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

import { EventStatus, SportsDbSchema } from "../../constants/system";

import TourYears from "./tourYears.entity";
import EventRounds from "./eventRounds.entity";
import EventTeams from "./eventTeams.entity";
import Odds from "./odds.entity";

@Entity({
  name: "events",
  schema: SportsDbSchema.JA,
})
export default class JAEvents extends Base {
  @ApiProperty({
    name: "name",
    type: "string",
    example: "Ja Alia World League Match 1",
    required: true,
  })
  @Column({ type: "text" })
  name: string;

  @ApiProperty({
    name: "tourYearId",
    type: "string",
    example: "e97945e2-a627-499c-8699-9128dc46686e",
  })
  @Column({ type: "uuid" })
  tourYearId: string;

  @ApiProperty({
    name: "winnerTeamId",
    type: "string",
    example: "e97945e2-a627-499c-8699-9128dc46686e",
  })
  @Column({ type: "uuid" })
  winnerTeamId: string;

  @ApiProperty({
    name: "startDate",
    type: "string",
    format: "date",
    example: "2022-04-18T15:25:24Z",
  })
  @Column({ type: "timestamptz" })
  startDate: Date;

  @ApiProperty({
    name: "endDate",
    type: "string",
    format: "date",
    example: "2022-04-18T15:25:24Z",
  })
  @Column({ type: "timestamptz" })
  endDate: Date;

  @Column({ type: "int" })
  eventNumber: number;

  @Column({ type: "text" })
  eventType: string;

  @ApiProperty({ name: "eventStatus", type: "number", example: 1 })
  @Column({ type: "int" })
  eventStatus: number;

  @ApiProperty({ name: "eventLocation", type: "string", example: "Margaret River" })
  @Column({ type: "text" })
  eventLocation: string;

  @ApiProperty({ name: "eventLocationGroup", type: "string", example: "Margaret River Pro" })
  @Column({ type: "text" })
  eventLocationGroup: string;

  @ApiProperty({
    name: "isSimulationEnabled",
    type: "boolean",
    example: true,
    default: true,
    required: false,
  })
  @Column({ type: "boolean" })
  isSimulationEnabled: boolean;

  @ApiProperty({
    name: "isEventWinnerMarketOpen",
    type: "boolean",
    example: true,
    default: true,
    required: false,
  })
  @Column({ type: "boolean", default: false })
  isEventWinnerMarketOpen: boolean;

  @ApiProperty({ name: "providerId", type: "string", example: "123abc" })
  @Column({ type: "text", nullable: false })
  providerId: string;

  @ManyToOne(() => TourYears, (year) => year.events)
  @JoinColumn({ name: "tourYearId", referencedColumnName: "id" })
  tourYear: TourYears;

  @OneToMany(() => Odds, (odd) => odd.event)
  odds: Odds[];

  @OneToMany(() => EventRounds, (round) => round.event)
  rounds: EventRounds[];

  @OneToMany(() => EventTeams, (team) => team.event)
  teams: EventTeams[];

  constructor() {
    super();
    this.eventStatus = EventStatus.UPCOMING;
  }
}

import { Base } from "../base.entity";
import { Column, Entity, Index, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

import { EventStatus, SportsDbSchema } from "../../constants/system";

import EventParticipants from "./eventParticipants.entity";
import LeagueYears from "./leagueYears.entity";
import EventRounds from "./eventRounds.entity";

@Entity({
  name: "events",
  schema: SportsDbSchema.SLS,
})
export default class SLSEvents extends Base {
  @ApiProperty({
    name: "leagueYearId",
    type: "string",
    format: "uuid",
    example: "e97945e2-a627-499c-8699-9128dc46686e",
  })
  @Column({ type: "uuid" })
  @Index()
  leagueYearId: string;

  @ApiProperty({
    name: "winnerAthleteId",
    type: "string",
    example: "bc8a2ac2-0111-4b99-b402-08a19a731eda",
  })
  @Column({ type: "uuid" })
  @Index()
  winnerAthleteId: string;

  @ApiProperty({
    name: "name",
    type: "string",
    format: "uuid",
    example: "SLS Salt Lake City",
    required: true,
  })
  @Column({ type: "text" })
  name: string;

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

  @ApiProperty({ name: "eventNumber", type: "number", example: 1 })
  @Column({ type: "int" })
  eventNumber: number;

  @ApiProperty({ name: "eventStatus", type: "number", example: 1 })
  @Column({ type: "int" })
  eventStatus: number;

  @ApiProperty({ name: "eventLocation", type: "string", example: "Salt Lake City, Utah, USA" })
  @Column({ type: "text" })
  eventLocation: string;

  @ApiProperty({ name: "eventLocationGroup", type: "string", example: "Salt Lake City" })
  @Column({ type: "text" })
  eventLocationGroup: string;

  @ApiProperty({ name: "isEventWinnerMarketOpen", type: "boolean", example: false })
  @Column({ type: "boolean", default: false })
  isEventWinnerMarketOpen: boolean;

  @ApiProperty({
    type: "string",
    example: "a3865d51-a769-11ed-8fa2-2760606e7252",
  })
  @Column({ type: "text" })
  providerId: string;

  @ApiProperty({
    type: "string",
    example: "9",
  })
  @Column({ type: "text" })
  providerContestId: string;

  @ApiProperty({
    name: "isSimulationEnabled",
    type: "boolean",
    example: true,
    default: true,
    required: false,
  })
  @Column({ type: "boolean" })
  isSimulationEnabled: boolean;

  @OneToMany(() => EventParticipants, (participant) => participant.event)
  participants: EventParticipants[];

  @OneToMany(() => EventRounds, (round) => round.event)
  rounds: EventRounds[];

  @ManyToOne(() => LeagueYears, (year) => year.events)
  @JoinColumn({ name: "leagueYearId", referencedColumnName: "id" })
  leagueYear: LeagueYears;

  constructor() {
    super();
    this.eventStatus = EventStatus.UPCOMING;
  }
}

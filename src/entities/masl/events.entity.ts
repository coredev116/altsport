import { Base } from "../base.entity";
import { Column, Entity, Index, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

import { EventStatus, SportsDbSchema } from "../../constants/system";

import LeagueYears from "./leagueYears.entity";
import EventRounds from "./eventRounds.entity";
import EventTeams from "./eventTeams.entity";
import Odds from "./odds.entity";

@Entity({
  name: "events",
  schema: SportsDbSchema.MASL,
})
export default class MASLEvents extends Base {
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
    name: "name",
    type: "string",
    format: "uuid",
    example: "Major Arena Soccer League",
    required: true,
  })
  @Column({ type: "text" })
  name: string;

  @ApiProperty({
    name: "startDate",
    type: "string",
    format: "date",
    example: "2022-04-18T15:25:24Z",
    required: true,
  })
  @Column({ type: "timestamptz" })
  startDate: Date;

  @ApiProperty({
    name: "endDate",
    type: "string",
    format: "date",
    example: "2022-04-18T15:25:24Z",
    required: true,
  })
  @Column({ type: "timestamptz" })
  endDate: Date;

  @ApiProperty({ name: "eventStatus", type: "number", example: 1, required: true })
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
    name: "providerGameId",
    type: "string",
    example: "593053",
  })
  @Column({ type: "text" })
  providerGameId: string;

  @ApiProperty({
    name: "winnerTeamId",
    type: "string",
    format: "uuid",
    example: "e97945e2-a627-499c-8699-9128dc46686e",
  })
  @Column({ type: "uuid" })
  winnerTeamId: string;

  @ApiProperty({
    name: "providerLastUpdated",
    type: "string",
    example: "2023-02-12 02:57:09 +0000",
  })
  @Column({ type: "text" })
  providerLastUpdated: string;

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
    name: "isSlackbotResultNotified",
    type: "boolean",
    example: false,
    default: false,
  })
  @Column({ type: "boolean" })
  isSlackbotResultNotified: boolean;

  @ManyToOne(() => LeagueYears, (year) => year.events)
  @JoinColumn({ name: "leagueYearId", referencedColumnName: "id" })
  leagueYear: LeagueYears;

  @OneToMany(() => Odds, (odd) => odd.event)
  odds: Odds[];

  @OneToMany(() => EventRounds, (round) => round.event)
  rounds: EventRounds[];

  @OneToMany(() => EventRounds, (round) => round.event)
  eventRounds: EventRounds[];

  @OneToMany(() => EventTeams, (team) => team.event)
  teams: EventTeams[];

  constructor() {
    super();
    this.eventStatus = EventStatus.UPCOMING;
  }
}

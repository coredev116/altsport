import { Base } from "../base.entity";
import { Column, Entity, Index, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

import { EventStatus, SportsDbSchema } from "../../constants/system";

import EventParticipants from "./eventParticipants.entity";
import TourYears from "./tourYears.entity";
import EventRounds from "./eventRounds.entity";
import SimulationWeights from "./simulationWeights.entity";

@Entity({
  name: "events",
  schema: SportsDbSchema.WSL,
})
export default class WSLEvents extends Base {
  @ApiProperty({
    name: "tourYearId",
    type: "string",
    example: "e97945e2-a627-499c-8699-9128dc46686e",
  })
  @Column({ type: "uuid" })
  @Index()
  tourYearId: string;

  @ApiProperty({
    name: "winnerAthleteId",
    type: "string",
    example: "bc8a2ac2-0111-4b99-b402-08a19a731eda",
  })
  @Column({ type: "uuid" })
  @Index()
  winnerAthleteId: string;

  @ApiProperty({ name: "name", type: "string", example: "Billabong Pro Pipeline", required: true })
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

  @Column({ type: "int" })
  eventNumber: number;

  @ApiProperty({ name: "eventStatus", type: "number", example: 1 })
  @Column({ type: "int" })
  eventStatus: number;

  @ApiProperty({ name: "eventLocation", type: "string", example: "Margaret River" })
  @Column({ type: "text" })
  eventLocation: string;

  @ApiProperty({ name: "eventLocationGroup", type: "string", example: "Margaret River Pro" })
  @Column({ type: "text" })
  eventLocationGroup: string;

  @ApiProperty({ name: "isEventWinnerMarketOpen", type: "boolean", example: false })
  @Column({ type: "boolean", default: false })
  isEventWinnerMarketOpen: boolean;

  @ApiProperty({
    type: "string",
    example: "1",
  })
  @Column({ type: "text" })
  providerId: string;

  @ApiProperty({
    name: "isSimulationEnabled",
    type: "boolean",
    example: true,
    default: true,
    required: false,
  })
  @Column({ type: "boolean" })
  isSimulationEnabled: boolean;

  @Column({ type: "text" })
  providerOpenbetFixtureId: string;

  @OneToMany(() => EventParticipants, (participant) => participant.event)
  participants: EventParticipants[];

  @OneToMany(() => EventRounds, (round) => round.event)
  rounds: EventRounds[];

  @OneToMany(() => SimulationWeights, (simulationWeights) => simulationWeights.event)
  simulationWeights: SimulationWeights[];

  @ManyToOne(() => TourYears, (year) => year.events)
  @JoinColumn({ name: "tourYearId", referencedColumnName: "id" })
  tourYear: TourYears;

  /* @OneToOne(() => TourYears)
  @JoinColumn({ name: "tourYearId", referencedColumnName: "id" })
  public tourYear: TourYears; */

  constructor() {
    super();
    this.eventStatus = EventStatus.UPCOMING;
  }
}

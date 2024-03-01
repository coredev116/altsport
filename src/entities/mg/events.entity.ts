import { Base } from "../base.entity";
import { Column, Entity, Index, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

import { EventStatus, SportsDbSchema } from "../../constants/system";

import EventParticipants from "./eventParticipants.entity";
import TourYears from "./tourYears.entity";
import ProjectionDreamTeam from "./projectionDreamTeam.entity";
import ClientProjectionDreamTeam from "./clientProjectionDreamTeam.entity";

@Entity({
  name: "events",
  schema: SportsDbSchema.MotoGP,
})
export default class MGEvents extends Base {
  @ApiProperty({
    name: "tourYearId",
    type: "string",
    example: "e97945e2-a627-499c-8699-9128dc46686e",
  })
  @Column({ type: "uuid" })
  @Index()
  tourYearId: string;

  // @ApiProperty({
  //   name: "winnerAthleteId",
  //   type: "string",
  //   example: "bc8a2ac2-0111-4b99-b402-08a19a731eda",
  // })
  // @Column({ type: "uuid" })
  // @Index()
  // winnerAthleteId: string;

  @ApiProperty({
    name: "name",
    type: "string",
    example: "QATAR AIRWAYS GRAN PREMIO DEL",
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

  @Column({ type: "int" })
  eventNumber: number;

  @Column({ type: "int" })
  eventLap: number;

  @ApiProperty({ name: "eventStatus", type: "number", example: 1 })
  @Column({ type: "int" })
  eventStatus: number;

  @ApiProperty({ name: "eventLocation", type: "string", example: "Autodromo Internazionale Enzo" })
  @Column({ type: "text" })
  eventLocation: string;

  @ApiProperty({
    name: "eventLocationGroup",
    type: "string",
    example: "Autodromo Internazionale Enzo Group",
  })
  @Column({ type: "text" })
  eventLocationGroup: string;

  // @ApiProperty({ name: "isEventWinnerMarketOpen", type: "boolean", example: false })
  // @Column({ type: "boolean", default: false })
  // isEventWinnerMarketOpen: boolean;

  // @ApiProperty({
  //   type: "string",
  //   example: "f1r_6_23",
  // })
  // @Column({ type: "text" })
  // providerId: string;

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

  @ManyToOne(() => TourYears, (year) => year.events)
  @JoinColumn({ name: "tourYearId", referencedColumnName: "id" })
  tourYear: TourYears;

  @OneToMany(() => ProjectionDreamTeam, (projectionDreamTeam) => projectionDreamTeam.event)
  projectionDreamTeam: ProjectionDreamTeam[];

  @OneToMany(
    () => ClientProjectionDreamTeam,
    (clientProjectionDreamTeam) => clientProjectionDreamTeam.event,
  )
  clientProjectionDreamTeam: ClientProjectionDreamTeam[];

  /* @OneToOne(() => TourYears)
  @JoinColumn({ name: "tourYearId", referencedColumnName: "id" })
  public tourYear: TourYears; */

  constructor() {
    super();
    this.eventStatus = EventStatus.UPCOMING;
  }
}

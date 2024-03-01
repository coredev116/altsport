import { Entity, Column } from "typeorm";
import { Base } from "../base.entity";

import { SportsDbSchema } from "../../constants/system";
import { ApiProperty } from "@nestjs/swagger";

@Entity({
  name: "athleteStats",
  schema: SportsDbSchema.MOTOCRS,
})
export default class MOTOCRSAthleteStats extends Base {
  @ApiProperty({ name: "athlete", type: "string", example: "CADE CLASON" })
  @Column({ type: "text" })
  athlete: string;

  @ApiProperty({ name: "eventsRaced", type: "int", example: "2023" })
  @Column({ type: "int" })
  eventsRaced: number;

  @ApiProperty({ name: "eventWins", type: "int", example: "2" })
  @Column({ type: "int" })
  eventWins: number;

  @ApiProperty({ name: "placeMain", type: "int", example: "2" })
  @Column({ type: "int" })
  placeMain: number;

  @ApiProperty({ name: "avgEventPlace", type: "int", example: "2" })
  @Column({ type: "int" })
  avgEventPlace: number;

  @ApiProperty({ name: "avgLapTime", type: "decimal", example: "2.2" })
  @Column({ type: "decimal" })
  avgLapTime: number;

  @ApiProperty({ name: "avgBestLapTime", type: "decimal", example: "2.2" })
  @Column({ type: "decimal" })
  avgBestLapTime: number;

  @ApiProperty({ name: "avgQualifyingPlace", type: "int", example: "2" })
  @Column({ type: "int" })
  avgQualifyingPlace: number;

  @ApiProperty({ name: "mainEventApp", type: "int", example: "59" })
  @Column({ type: "int" })
  mainEventApp: number;

  @ApiProperty({ name: "prelimApp", type: "int", example: "2" })
  @Column({ type: "int" })
  prelimApp: number;

  @ApiProperty({ name: "avgPrelimPlace", type: "int", example: "2" })
  @Column({ type: "int" })
  avgPrelimPlace: number;

  @ApiProperty({ name: "lcqApp", type: "int", example: "2" })
  @Column({ type: "int" })
  lcqApp: number;

  @ApiProperty({ name: "avgLCQPlace", type: "int", example: "2" })
  @Column({ type: "int" })
  avgLcqPlace: number;
}

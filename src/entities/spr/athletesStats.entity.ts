import { Entity, Column } from "typeorm";
import { Base } from "../base.entity";

import { SportsDbSchema } from "../../constants/system";
import { ApiProperty } from "@nestjs/swagger";

@Entity({
  name: "athleteStats",
  schema: SportsDbSchema.SPR,
})
export default class SPRAthleteStats extends Base {
  @ApiProperty({ name: "athlete", type: "string", example: "CADE CLASON" })
  @Column({ type: "text" })
  athlete: string;

  @ApiProperty({ name: "raceName", type: "string", example: "ANAHEIM" })
  @Column({ type: "text" })
  raceName: string;

  @ApiProperty({ name: "raceClass", type: "string", example: "450SX" })
  @Column({ type: "text" })
  raceClass: string;

  @ApiProperty({ name: "raceSeason", type: "int", example: "2023" })
  @Column({ type: "int" })
  raceSeason: number;

  @ApiProperty({ name: "placeMain", type: "int", example: "2" })
  @Column({ type: "int" })
  placeMain: number;

  @ApiProperty({ name: "placeHeats", type: "int", example: "2" })
  @Column({ type: "int" })
  placeHeats: number;

  @ApiProperty({ name: "eventWin", type: "int", example: "2" })
  @Column({ type: "int" })
  eventWin: number;

  @ApiProperty({ name: "placeLCQ", type: "int", example: "2" })
  @Column({ type: "int" })
  placeLCQ: number;

  @ApiProperty({ name: "placePrelim", type: "int", example: "2" })
  @Column({ type: "int" })
  placePrelim: number;

  @ApiProperty({ name: "bestLapTime", type: "int", example: "59.899" })
  @Column({ type: "decimal" })
  bestLapTime: number;
}

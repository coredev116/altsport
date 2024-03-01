import { Base } from "../base.entity";
import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

import { SportsDbSchema } from "../../constants/system";
import {
  MASLSubMarketTypes,
  MASLMarketTypes,
  MASLBetTypes,
  MASLValueTypes,
} from "../../constants/odds";

import Events from "./events.entity";
import EventRound from "./eventRounds.entity";
import EventTeam from "./eventTeams.entity";

@Entity({
  name: "odds",
  schema: SportsDbSchema.MASL,
})
export default class MASLOdds extends Base {
  @ApiProperty({
    name: "marketType",
    format: "integer",
    type: "number",
    example: 1,
    enum: MASLMarketTypes,
  })
  @Column({ type: "integer", enum: MASLMarketTypes })
  marketType: number;

  @ApiProperty({
    name: "subMarketType",
    format: "integer",
    type: "number",
    example: 1,
    enum: MASLSubMarketTypes,
  })
  @Column({ type: "integer", enum: MASLSubMarketTypes })
  subMarketType: number;

  @ApiProperty({
    name: "betType",
    format: "integer",
    type: "number",
    example: 1,
    enum: MASLBetTypes,
  })
  @Column({ type: "integer", enum: MASLBetTypes })
  betType: number;

  @ApiProperty({
    name: "type",
    format: "integer",
    type: "number",
    example: 1,
    enum: MASLValueTypes,
  })
  @Column({ type: "integer", enum: MASLValueTypes })
  type: number;

  @ApiProperty({
    name: "eventId",
    type: "string",
    example: "bc8a2ac2-0111-4b99-b402-08a19a731eda",
  })
  @Column({ type: "uuid" })
  eventId: string;

  @ApiProperty({
    name: "eventTeamId",
    type: "string",
    example: "bc8a2ac2-0111-4b99-b402-08a19a731eda",
  })
  @Column({ type: "uuid" })
  eventTeamId: string;

  @ApiProperty({
    name: "eventRoundId",
    type: "string",
    example: "bc8a2ac2-0111-4b99-b402-08a19a731eda",
  })
  @Column({ type: "uuid" })
  eventRoundId: string;

  @ApiProperty({
    name: "odds",
    type: "number",
    example: 30.5,
  })
  @Column({ type: "decimal" })
  odds: number;

  @ApiProperty({
    name: "probability",
    type: "number",
    example: 30.5,
  })
  @Column({ type: "decimal" })
  probability: number;

  @ApiProperty({
    name: "trueProbability",
    type: "number",
    example: 30.5,
  })
  @Column({ type: "decimal" })
  trueProbability: number;

  @ApiProperty({
    name: "hasModifiedProbability",
    type: "boolean",
    example: true,
  })
  @Column({ type: "boolean" })
  hasModifiedProbability: boolean;

  @ApiProperty({
    name: "lean",
    type: "number",
    example: 1,
  })
  @Column({ type: "int" })
  lean: number;

  @ApiProperty({
    name: "playerLean",
    type: "number",
    example: 1,
  })
  @Column({ type: "int" })
  playerLean: number;

  @ApiProperty({
    name: "bias",
    type: "number",
    example: 1,
  })
  @Column({ type: "int" })
  bias: number;

  @ApiProperty({
    name: "max",
    type: "number",
    example: 1,
  })
  @Column({ type: "int" })
  max: number;

  @ApiProperty({
    name: "holdingPercentage",
    type: "number",
    example: 30.5,
  })
  @Column({ type: "decimal" })
  holdingPercentage: number;

  @ApiProperty({
    name: "calculatedValue",
    type: "number",
    example: 30.5,
  })
  @Column({ type: "decimal" })
  calculatedValue: number;

  @ApiProperty({
    name: "isMarketActive",
    type: "boolean",
    example: true,
  })
  @Column({ type: "boolean" })
  isMarketActive: boolean;

  @ApiProperty({
    name: "isSubMarketLocked",
    type: "boolean",
    example: true,
  })
  @Column({ type: "boolean" })
  isSubMarketLocked: boolean;

  @ManyToOne(() => Events, (event) => event.odds)
  event: Events;

  @ManyToOne(() => EventRound, (eventRound) => eventRound.odds)
  @JoinColumn({ name: "eventRoundId", referencedColumnName: "id" })
  eventRound: EventRound;

  @ManyToOne(() => EventTeam, (eventTeam) => eventTeam.odds)
  @JoinColumn({ name: "eventTeamId", referencedColumnName: "id" })
  eventTeam: EventTeam;
}

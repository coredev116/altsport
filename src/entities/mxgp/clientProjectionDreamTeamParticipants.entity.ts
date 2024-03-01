import { Base } from "../base.entity";
import { Entity, Column, Index, ManyToOne, JoinColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

import ClientProjectionDreamTeam from "./clientProjectionDreamTeam.entity";

import { SportsDbSchema } from "../../constants/system";

import { IApexDreamTeamParticipantsJSON } from "../../interfaces/apex";

@Entity({
  name: "clientProjectionDreamTeamParticipants",
  schema: SportsDbSchema.MXGP,
})
export default class MXGPClientProjectionDreamTeamParticipants extends Base {
  @ApiProperty({
    name: "dreamTeamId",
    type: "string",
    example: "bc8a2ac2-0111-4b99-b402-08a19a731eda",
  })
  @Column({ type: "uuid" })
  @Index()
  dreamTeamId: string;

  @ApiProperty({
    name: "participants",
    type: "json",
    example: `
        [
            {
            "firstName": "Athlete name",
            "lastName": "Athlete name",
            "eventParticipantId": "a2ac2-0111-4b99-b402-08a19a731eda"
            }
        ]
    `,
  })
  @Column({ type: "json" })
  participants: IApexDreamTeamParticipantsJSON[];

  @ApiProperty({
    name: "team",
    type: "string",
    example: "A",
  })
  @Column({ type: "text" })
  team: string;

  @ApiProperty({
    name: "odds",
    type: "number",
    example: 11.1,
  })
  @Column({ type: "decimal" })
  odds: number;

  @ApiProperty({
    name: "probability",
    type: "number",
    example: 10.2,
  })
  @Column({ type: "decimal" })
  probability: number;

  @ApiProperty({
    name: "trueProbability",
    type: "number",
    example: 30.9,
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

  @ManyToOne(
    () => ClientProjectionDreamTeam,
    (clientProjectionDreamTeam) => clientProjectionDreamTeam.participants,
  )
  @JoinColumn({ name: "dreamTeamId", referencedColumnName: "id" })
  clientProjectionDreamTeam: ClientProjectionDreamTeam;
}

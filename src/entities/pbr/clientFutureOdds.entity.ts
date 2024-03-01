import { Entity, JoinColumn, OneToOne, Column } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

import Athletes from "./athletes.entity";

import FutureOdds from "../common/clientFutureOdds.entity";

import { SportsDbSchema } from "../../constants/system";

@Entity({
  name: "clientFutureOdds",
  schema: SportsDbSchema.PBR,
})
export default class PBRClientFutureOdds extends FutureOdds {
  @ApiProperty({
    name: "athleteId",
    type: "string",
    example: "bc8a2ac2-0111-4b99-b402-08a19a731eda",
  })
  @Column({ type: "uuid" })
  athleteId: string;

  @OneToOne(() => Athletes)
  @JoinColumn({ name: "athleteId", referencedColumnName: "id" })
  athlete: Athletes;
}

import { Base } from "../base.entity";
import { Entity, Column, Index, ManyToOne, JoinColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

import { SportsDbSchema } from "../../constants/system";
import Events from "./events.entity";
import OddDerivatives from "./oddDerivatives.entity";

@Entity({
  name: "eventOddDerivatives",
  schema: SportsDbSchema.SLS,
})
export default class SLSEventOddDerivatives extends Base {
  @ApiProperty({
    name: "eventId",
    type: "string",
    format: "uuid",
    example: "e97945e2-a627-499c-8699-9128dc46686e",
  })
  @Column({ type: "uuid" })
  @Index()
  eventId: string;

  @ApiProperty({
    name: "oddDerivativeId",
    type: "string",
    format: "uuid",
    example: "e97945e2-a627-499c-8699-9128dc46686e",
  })
  @Column({ type: "uuid" })
  @Index()
  oddDerivativeId: string;

  @ApiProperty({
    name: "holdingPercentage",
    format: "integer",
    type: "number",
    example: 30.5,
  })
  @Column({ type: "integer" })
  holdingPercentage: number;

  @ManyToOne(() => Events)
  @JoinColumn({ name: "eventId", referencedColumnName: "id" })
  event: Events;

  @ManyToOne(() => OddDerivatives)
  @JoinColumn({ name: "oddDerivativeId", referencedColumnName: "id" })
  oddDerivative: OddDerivatives;
}

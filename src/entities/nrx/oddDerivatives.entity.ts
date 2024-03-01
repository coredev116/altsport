import { Base } from "../base.entity";
import { Entity, Column } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

import { SportsDbSchema } from "../../constants/system";
import { Derivatives } from "../../constants/odds";

@Entity({
  name: "oddDerivatives",
  schema: SportsDbSchema.NRX,
})
export default class WRXOddDerivatives extends Base {
  @ApiProperty({ name: "name", type: "string", example: "Event Winner" })
  @Column({ type: "text" })
  name: string;

  @ApiProperty({
    name: "type",
    format: "integer",
    type: "number",
    example: 1,
    enum: Derivatives,
  })
  @Column({ type: "integer", enum: Derivatives })
  type: number;
}

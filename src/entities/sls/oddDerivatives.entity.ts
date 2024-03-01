import { Base } from "../base.entity";
import { Entity, Column } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

import { SportsDbSchema } from "../../constants/system";

@Entity({
  name: "oddDerivatives",
  schema: SportsDbSchema.SLS,
})
export default class SLSOddDerivatives extends Base {
  @ApiProperty({ name: "name", type: "string", example: "Event Winner" })
  @Column({ type: "text" })
  name: string;

  @ApiProperty({
    name: "type",
    format: "integer",
    type: "number",
    example: 1,
  })
  @Column({ type: "integer" })
  type: number;
}

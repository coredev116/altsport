import { Column, Entity } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

import { Base } from "../base.entity";

import { SportsDbSchema } from "../../constants/system";

@Entity({
  name: "bulls",
  schema: SportsDbSchema.PBR,
})
export default class PBRBulls extends Base {
  @ApiProperty({
    name: "name",
    type: "string",
    example: "340",
    required: true,
  })
  @Column({ type: "text" })
  name: string;

  @ApiProperty({
    name: "bullNo",
    type: "string",
    example: "SA-3",
    required: true,
  })
  @Column({ type: "text" })
  bullNo: string;

  @ApiProperty({ name: "providerId", type: "string", example: "1234" })
  @Column({ type: "text" })
  providerId: string;

  @ApiProperty({
    name: "weight",
    type: "number",
    example: 1900,
  })
  @Column({ type: "int" })
  weight: number;

  @ApiProperty({
    name: "birthDate",
    type: "string",
    format: "date",
    example: "2020-04-18T15:25:24Z",
  })
  @Column({ type: "timestamptz" })
  birthDate: Date;
}

import { Column, Entity, OneToMany } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

import { Base } from "../base.entity";
import TourYears from "./tourYears.entity";

import { SportsDbSchema } from "../../constants/system";

@Entity({
  name: "tours",
  schema: SportsDbSchema.F1,
})
export default class F1Tours extends Base {
  @ApiProperty({
    name: "name",
    type: "string",
    example: "Men's Championship Tour",
    required: true,
  })
  @Column({ type: "text" })
  name: string;

  @ApiProperty({
    name: "gender",
    type: "string",
    example: "men",
    required: true,
  })
  @Column({ type: "text" })
  gender: string;

  @ApiProperty({
    type: "string",
    example: "1",
  })
  @Column({ type: "text" })
  providerId: string;

  @OneToMany(() => TourYears, (year) => year.tour, { cascade: ["insert"] })
  years: TourYears[];
}

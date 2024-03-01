import { Column, Entity, OneToMany } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

import { Base } from "../base.entity";
import TourYears from "./tourYears.entity";

import { SportsDbSchema } from "../../constants/system";

@Entity({
  name: "tours",
  schema: SportsDbSchema.SPR,
})
export default class SPRTours extends Base {
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

  @OneToMany(() => TourYears, (year) => year.tour, { cascade: ["insert"] })
  years: TourYears[];
}

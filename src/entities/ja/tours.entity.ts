import { Column, Entity, OneToMany } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

import { Base } from "../base.entity";
import TourYears from "./tourYears.entity";

import { SportsDbSchema } from "../../constants/system";

@Entity({
  name: "tours",
  schema: SportsDbSchema.JA,
})
export default class JATours extends Base {
  @ApiProperty({
    name: "name",
    type: "string",
    example: "Ja Alia World League",
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

  @ApiProperty({ name: "providerId", type: "string", example: "123abc" })
  @Column({ type: "text", nullable: false })
  providerId: string;

  @OneToMany(() => TourYears, (year) => year.tour, { cascade: ["insert"] })
  years: TourYears[];
}

import { Column, Entity, OneToMany } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

import { Base } from "../base.entity";
import TourYears from "./tourYears.entity";

import { SportsDbSchema } from "../../constants/system";

@Entity({
  name: "tours",
  schema: SportsDbSchema.PBR,
})
export default class PBRTours extends Base {
  @ApiProperty({
    name: "name",
    type: "string",
    example: "PBR Australia Season",
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

  @ApiProperty({ name: "providerId", type: "string", example: "1234" })
  @Column({ type: "text" })
  providerId: string;

  @OneToMany(() => TourYears, (year) => year.tour, { cascade: ["insert"] })
  years: TourYears[];
}

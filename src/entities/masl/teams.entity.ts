import { Column, Entity, OneToMany } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

import { Base } from "../base.entity";
import EventTeams from "./eventTeams.entity";

import { SportsDbSchema } from "../../constants/system";

@Entity({
  name: "teams",
  schema: SportsDbSchema.MASL,
})
export default class MASLTeams extends Base {
  @ApiProperty({
    name: "name",
    type: "string",
    example: "Sockers",
    required: true,
  })
  @Column({ type: "text" })
  name: string;

  @ApiProperty({
    name: "shortName",
    type: "string",
    example: "Sockers",
  })
  @Column({ type: "text" })
  shortName: string;

  @ApiProperty({
    name: "logo",
    type: "string",
    example: "sockersLogo.png",
  })
  @Column({ type: "text" })
  logo: string;

  @ApiProperty({
    name: "city",
    type: "string",
    example: "LA",
  })
  @Column({ type: "text" })
  city: string;

  @ApiProperty({
    name: "providerTeamId",
    type: "string",
    example: "114",
  })
  @Column({ type: "text" })
  providerTeamId: string;

  @OneToMany(() => EventTeams, (event) => event.team)
  events: EventTeams[];
}

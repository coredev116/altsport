import { Entity, Column, OneToMany } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

import { Base } from "./base.entity";

import ClientMarketNotifications from "./clientMarketNotifications.entity";

import { OddMarkets as Markets } from "../constants/system";

@Entity({
  name: "oddMarkets",
})
export default class OddMarkets extends Base {
  @ApiProperty({ name: "name", type: "string", example: "Heat Winner" })
  @Column({ type: "text" })
  name: string;

  @ApiProperty({ name: "key", type: "string", example: Markets.HEAT_PROJECTIONS, enum: Markets })
  @Column({ type: "text" })
  key: string;

  @OneToMany(() => ClientMarketNotifications, (row) => row.market)
  clientMarketNotifications: ClientMarketNotifications[];

  @OneToMany(() => ClientMarketNotifications, (market) => market.client)
  marketNotifications: ClientMarketNotifications[];
}

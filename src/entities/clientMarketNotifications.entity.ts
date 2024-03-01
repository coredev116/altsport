import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

import { Base } from "./base.entity";

import Clients from "./clients.entity";
import OddMarkets from "./oddMarkets.entity";

@Entity({
  name: "clientMarketNotifications",
})
export default class ClientMarketNotifications extends Base {
  @Column({ type: "uuid" })
  clientId: string;

  @Column({ type: "uuid" })
  oddMarketId: string;

  @ApiProperty({ name: "sms", type: "boolean", example: "true" })
  @Column({
    type: "boolean",
    default: true,
  })
  sms: boolean;

  @ApiProperty({ name: "email", type: "boolean", example: "true" })
  @Column({
    type: "boolean",
    default: true,
  })
  email: boolean;

  @ApiProperty({ name: "slack", type: "boolean", example: "true" })
  @Column({
    type: "boolean",
    default: true,
  })
  slack: boolean;

  @ManyToOne(() => OddMarkets, (market) => market.clientMarketNotifications)
  @JoinColumn({ name: "oddMarketId", referencedColumnName: "id" })
  market: OddMarkets;

  @ManyToOne(() => Clients, (clients) => clients.marketNotifications)
  @JoinColumn({ name: "clientId", referencedColumnName: "id" })
  client: Clients;
}

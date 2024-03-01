import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

import { Base } from "./base.entity";
import Clients from "./clients.entity";

import { SportsTypes, OddMarkets, FutureMarkets } from "../constants/system";

@Entity({
  name: "clientMarketDownloadLogs",
})
export default class ClientMarketDownloadLogs extends Base {
  @Column({ type: "uuid" })
  clientId: string;

  @ApiProperty({
    name: "marketType",
    type: "enum",
    example: OddMarkets.EVENT_WINNER_PROJECTIONS,
    enum: OddMarkets,
  })
  @Column({ type: "text", nullable: true })
  marketType: OddMarkets;

  @ApiProperty({
    name: "futureType",
    type: "enum",
    example: FutureMarkets.WINNER,
    enum: FutureMarkets,
  })
  @Column({ type: "text", nullable: true })
  futureType: FutureMarkets;

  @ApiProperty({
    name: "sportType",
    type: "enum",
    example: SportsTypes.RALLYCROSS,
    enum: SportsTypes,
  })
  @Column({ type: "text", nullable: false })
  sportType: SportsTypes;

  @ManyToOne(() => Clients, (clients) => clients.id)
  @JoinColumn({ name: "clientId", referencedColumnName: "id" })
  client: Clients;
}

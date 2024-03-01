import { Entity, Column, Index, ManyToOne, JoinColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

import { Base } from "./base.entity";
import Clients from "./clients.entity";

@Entity({
  name: "clientApiKeys",
})
export default class ClientApiKeys extends Base {
  @Column({ type: "uuid" })
  @Index()
  clientId: string;

  @ApiProperty({ name: "totalRequestCount", type: "number", example: 1 })
  @Column({ type: "int", nullable: false })
  totalRequestCount: number;

  @ApiProperty({ name: "currentRequestCount", type: "number", example: 1 })
  @Column({ type: "int", nullable: false })
  currentRequestCount: number;

  @ApiProperty({ name: "apiKey", type: "string", example: "9mRnwDdKchfgCSPalLFRwB2v6e2MFkbO" })
  @Column({ type: "text", nullable: false })
  apiKey: string;

  @ApiProperty({
    name: "expiryDate",
    type: "string",
    format: "date",
    example: "2022-04-18T15:25:24Z",
  })
  @Column({ type: "timestamptz", nullable: true })
  expiryDate: Date;

  @ManyToOne(() => Clients, (clients) => clients.id)
  @JoinColumn({ name: "clientId", referencedColumnName: "id" })
  client: Clients;
}

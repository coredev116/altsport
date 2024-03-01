import { Entity, Column, OneToMany } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { CountryCode } from "libphonenumber-js";

import { Base } from "./base.entity";

import ClientMarketNotifications from "./clientMarketNotifications.entity";

@Entity({
  name: "clients",
})
export default class Clients extends Base {
  @ApiProperty({ name: "firstName", type: "string", example: "Michael" })
  @Column({ type: "text" })
  firstName: string;

  @ApiProperty({ name: "middleName", type: "string", example: "B" })
  @Column({ type: "text", nullable: true })
  middleName: string;

  @ApiProperty({ name: "lastName", type: "string", example: "Jordan" })
  @Column({ type: "text", nullable: true })
  lastName: string;

  @ApiProperty({ name: "googleUserId", type: "string", example: "Lu6MSnQEObICWh1V8iLdB" })
  @Column({ type: "text", nullable: false })
  googleUserId: string;

  @ApiProperty({ name: "providerId", type: "string", example: "email" })
  @Column({ type: "text", nullable: false })
  providerId: string;

  @ApiProperty({ name: "username", type: "string", example: "michael@jordan.com" })
  @Column({ type: "text", nullable: false })
  username: string;

  @ApiProperty({ name: "email", type: "string", example: "michael@jordan.com" })
  @Column({ type: "text", nullable: false })
  email: string;

  @ApiProperty({ name: "password", type: "string", example: "CF757E97634F5211789341573B1850E35B7" })
  @Column({ type: "text", nullable: false })
  password: string;

  @ApiProperty({ name: "companyName", type: "string", example: "Sports Analytics" })
  @Column({ type: "text", nullable: true })
  companyName: string;

  @ApiProperty({ name: "phone", type: "string", example: "9912345678" })
  @Column({ type: "text", nullable: true })
  phone: string;

  @ApiProperty({ name: "country", type: "string", example: "US" })
  @Column({ type: "text", nullable: false, default: "US" })
  country: CountryCode;

  @ApiProperty({ name: "isPhoneVerified", type: "boolean", example: "false" })
  @Column({ type: "boolean", default: false })
  isPhoneVerified: boolean;

  @ApiProperty({ name: "isEmailVerified", type: "boolean", example: "false" })
  @Column({ type: "boolean", default: false })
  isEmailVerified: boolean;

  @ApiProperty({ name: "hasOnboarded", type: "boolean", example: "false" })
  @Column({ type: "boolean", default: false })
  hasOnboarded: boolean;

  @OneToMany(() => ClientMarketNotifications, (market) => market.client)
  marketNotifications: ClientMarketNotifications[];
}

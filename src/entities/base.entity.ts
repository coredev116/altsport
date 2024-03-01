import { ApiProperty } from "@nestjs/swagger";
import { Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

export abstract class Base {
  @ApiProperty({
    name: "id",
    type: "string",
    format: "uuid",
    example: "e97945e2-a627-499c-8699-9128dc46686e",
  })
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty({ name: "isActive", type: "boolean", example: "true" })
  @Column({
    type: "boolean",
    default: true,
  })
  isActive: boolean;

  @ApiProperty({ name: "isArchived", type: "boolean", example: "false" })
  @Column({ type: "boolean", default: false })
  isArchived: boolean;

  @ApiProperty({
    name: "createdAt",
    type: "string",
    format: "date",

    example: "2022-04-18T15:25:24Z",
  })
  @Column({ type: "timestamptz" })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    name: "updatedAt",
    type: "string",
    format: "date",

    example: "2022-04-18T15:25:24Z",
  })
  @Column({ type: "timestamptz" })
  @UpdateDateColumn()
  updatedAt: Date;
}

import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const tableName = "eventRounds";

export class createMotocrsEventRounds1685341879123 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: tableName,
        schema: SportsDbSchema.MOTOCRS,
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            isUnique: true,
            generationStrategy: "uuid",
            default: `uuid_generate_v4()`,
          },
          {
            name: "eventId",
            type: "uuid",
          },
          {
            name: "roundId",
            type: "uuid",
          },
          {
            name: "roundStatus",
            type: "int",
            isNullable: true,
          },
          {
            name: "startDate",
            type: "timestamptz",
            isNullable: true,
          },
          {
            name: "endDate",
            type: "timestamptz",
            isNullable: true,
          },
          {
            name: "isActive",
            type: "boolean",
            default: true,
          },
          {
            name: "isArchived",
            type: "boolean",
            default: false,
          },
          {
            name: "createdAt",
            type: "timestamptz",
            default: "now()",
          },
          {
            name: "updatedAt",
            type: "timestamptz",
            default: "now()",
          },
        ],
      }),
      true,
    );

    const table: Table = await queryRunner.getTable(`${SportsDbSchema.MOTOCRS}.${tableName}`);

    await Promise.all([
      queryRunner.createForeignKeys(table, [
        new TableForeignKey({
          columnNames: ["eventId"],
          referencedColumnNames: ["id"],
          referencedTableName: "events",
          referencedSchema: SportsDbSchema.MOTOCRS,
        }),
        new TableForeignKey({
          columnNames: ["roundId"],
          referencedColumnNames: ["id"],
          referencedTableName: "rounds",
          referencedSchema: SportsDbSchema.MOTOCRS,
        }),
      ]),
      queryRunner.createIndices(table, [
        new TableIndex({
          columnNames: ["eventId"],
        }),
        new TableIndex({
          columnNames: ["roundId"],
        }),
      ]),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(`${SportsDbSchema.MOTOCRS}.${tableName}`);
    await queryRunner.dropTable(table, true);
  }
}

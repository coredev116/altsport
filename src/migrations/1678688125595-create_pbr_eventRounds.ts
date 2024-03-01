import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const tableName = "eventRounds";

export class createPbrEventRounds1678688119595 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: tableName,
        schema: SportsDbSchema.PBR,
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
            name: "roundStatus",
            type: "int",
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

    const table: Table = await queryRunner.getTable(`${SportsDbSchema.PBR}.${tableName}`);

    await Promise.all([
      queryRunner.createForeignKeys(table, [
        new TableForeignKey({
          columnNames: ["eventId"],
          referencedColumnNames: ["id"],
          referencedTableName: "events",
          referencedSchema: SportsDbSchema.PBR,
        }),
        new TableForeignKey({
          columnNames: ["roundId"],
          referencedColumnNames: ["id"],
          referencedTableName: "rounds",
          referencedSchema: SportsDbSchema.PBR,
        }),
      ]),
      queryRunner.createIndices(table, [
        new TableIndex({
          columnNames: ["eventId", "roundId"],
          isUnique: true,
        }),
      ]),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(`${SportsDbSchema.PBR}.${tableName}`);
    await queryRunner.dropTable(table, true);
  }
}

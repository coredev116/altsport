import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const tableName = "scores";

export class scores1650044384437 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // this ensure we can use default: `uuid_generate_v4()`
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.createTable(
      new Table({
        name: tableName,
        schema: SportsDbSchema.WSL,
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
            name: "roundHeatId",
            type: "uuid",
          },
          {
            name: "athleteId",
            type: "uuid",
          },
          {
            name: "roundSeed",
            type: "int",
            isNullable: true,
          },
          {
            name: "heatScore",
            type: "int",
            isNullable: true,
          },
          {
            name: "heatPosition",
            type: "int",
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

    const table: Table = await queryRunner.getTable(`${SportsDbSchema.WSL}.${tableName}`);

    await Promise.all([
      queryRunner.createForeignKeys(table, [
        new TableForeignKey({
          columnNames: ["eventId"],
          referencedColumnNames: ["id"],
          referencedTableName: "events",
          referencedSchema: SportsDbSchema.WSL,
        }),
        new TableForeignKey({
          columnNames: ["roundHeatId"],
          referencedColumnNames: ["id"],
          referencedTableName: "roundHeats",
          referencedSchema: SportsDbSchema.WSL,
        }),
        new TableForeignKey({
          columnNames: ["athleteId"],
          referencedColumnNames: ["id"],
          referencedTableName: "athletes",
          referencedSchema: SportsDbSchema.WSL,
        }),
      ]),
      queryRunner.createIndices(table, [
        new TableIndex({
          columnNames: ["eventId"],
        }),
        new TableIndex({
          columnNames: ["roundHeatId"],
        }),
        new TableIndex({
          columnNames: ["athleteId"],
        }),
      ]),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(`${SportsDbSchema.WSL}.${tableName}`);
    await queryRunner.dropTable(table, true);
  }
}

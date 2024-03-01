import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const tableName = "simulationWeights";

export class createWslSimulationWeights1687861050329 implements MigrationInterface {
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
            isNullable: false,
          },
          {
            name: "type",
            type: "text",
            isNullable: false,
          },
          {
            name: "year",
            type: "int",
            isNullable: true,
          },
          {
            name: "location",
            type: "text",
            isNullable: true,
          },
          {
            name: "weight",
            type: "decimal",
            isNullable: false,
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
      ]),
      queryRunner.createIndices(table, [
        new TableIndex({
          columnNames: ["eventId"],
        }),
      ]),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(`${SportsDbSchema.WSL}.${tableName}`);
    await queryRunner.dropTable(table, true);
  }
}

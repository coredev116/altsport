import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const tableName = "tourYears";

export class f1TourYears1684904555802 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // this ensure we can use default: `uuid_generate_v4()`
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.createTable(
      new Table({
        name: tableName,
        schema: SportsDbSchema.F1,
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
            name: "tourId",
            type: "uuid",
          },
          {
            name: "year",
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

    const table: Table = await queryRunner.getTable(`${SportsDbSchema.F1}.${tableName}`);

    await Promise.all([
      queryRunner.createForeignKey(
        table,
        new TableForeignKey({
          columnNames: ["tourId"],
          referencedColumnNames: ["id"],
          referencedTableName: "tours",
          referencedSchema: SportsDbSchema.F1,
        }),
      ),
      queryRunner.createIndex(
        table,
        new TableIndex({
          columnNames: ["tourId"],
        }),
      ),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(`${SportsDbSchema.F1}.${tableName}`);
    await queryRunner.dropTable(table, true);
  }
}

import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const tableName = "tourYears";

export class createPbrTourYears1678688118599 implements MigrationInterface {
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

    const table: Table = await queryRunner.getTable(`${SportsDbSchema.PBR}.${tableName}`);

    await Promise.all([
      queryRunner.createForeignKey(
        table,
        new TableForeignKey({
          columnNames: ["tourId"],
          referencedColumnNames: ["id"],
          referencedTableName: "tours",
          referencedSchema: SportsDbSchema.PBR,
        }),
      ),
      queryRunner.createIndex(
        table,
        new TableIndex({
          columnNames: ["tourId"],
        }),
      ),
      queryRunner.createIndex(
        table,
        new TableIndex({
          columnNames: ["year", "tourId"],
          isUnique: true,
        }),
      ),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(`${SportsDbSchema.PBR}.${tableName}`);
    await queryRunner.dropTable(table, true);
  }
}

import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const tableName = "eventTeams";

export class CreateJaEventTeams1693824478135 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // this ensure we can use default: `uuid_generate_v4()`
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.createSchema(SportsDbSchema.JA, true);

    await queryRunner.createTable(
      new Table({
        name: tableName,
        schema: SportsDbSchema.JA,
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
            name: "teamId",
            type: "uuid",
          },
          {
            name: "isHomeTeam",
            type: "boolean",
            default: false,
          },
          {
            name: "status",
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

    const table: Table = await queryRunner.getTable(`${SportsDbSchema.JA}.${tableName}`);

    await Promise.all([
      queryRunner.createForeignKey(
        table,
        new TableForeignKey({
          columnNames: ["eventId"],
          referencedColumnNames: ["id"],
          referencedTableName: "events",
          referencedSchema: SportsDbSchema.JA,
        }),
      ),
      queryRunner.createIndex(
        table,
        new TableIndex({
          columnNames: ["eventId"],
        }),
      ),

      queryRunner.createForeignKey(
        table,
        new TableForeignKey({
          columnNames: ["teamId"],
          referencedColumnNames: ["id"],
          referencedTableName: "teams",
          referencedSchema: SportsDbSchema.JA,
        }),
      ),
      queryRunner.createIndex(
        table,
        new TableIndex({
          columnNames: ["teamId"],
        }),
      ),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(`${SportsDbSchema.JA}.${tableName}`);
    await queryRunner.dropTable(table, true);
  }
}

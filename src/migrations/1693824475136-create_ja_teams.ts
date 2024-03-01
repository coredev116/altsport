import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const tableName = "teams";

export class CreateJaTeams1693824475136 implements MigrationInterface {
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
            name: "name",
            type: "text",
          },
          {
            name: "shortName",
            type: "text",
            isNullable: true,
          },
          {
            name: "logo",
            type: "text",
            isNullable: true,
          },
          {
            name: "city",
            type: "text",
            isNullable: true,
          },
          {
            name: "providerTeamId",
            type: "text",
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

    await queryRunner.getTable(`${SportsDbSchema.JA}.${tableName}`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(`${SportsDbSchema.JA}.${tableName}`);
    await queryRunner.dropTable(table, true);
  }
}

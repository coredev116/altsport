import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const tableName = "athletes";

export class slsAthletes1651996273107 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: tableName,
        schema: SportsDbSchema.SLS,
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
            name: "firstName",
            type: "text",
            isNullable: false,
          },
          {
            name: "lastName",
            type: "text",
            isNullable: true,
          },
          {
            name: "dob",
            type: "timestamptz",
            isNullable: true,
          },
          {
            name: "nationality",
            type: "text",
            isNullable: true,
          },
          {
            name: "hometown",
            type: "text",
            isNullable: true,
          },
          {
            name: "yearStatus",
            type: "int",
            isNullable: true,
          },
          {
            name: "yearPoints",
            type: "int",
            isNullable: true,
          },
          {
            name: "yearRank",
            type: "int",
            isNullable: true,
          },
          {
            name: "playerStatus",
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(`${SportsDbSchema.SLS}.${tableName}`);
    await queryRunner.dropTable(table, true);
  }
}

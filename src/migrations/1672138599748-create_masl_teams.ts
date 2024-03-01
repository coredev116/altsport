import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const tableName = "teams";

export class createMaslTeams1672138599748 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createSchema(SportsDbSchema.MASL, true);

    await queryRunner.createTable(
      new Table({
        name: tableName,
        schema: SportsDbSchema.MASL,
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

    await queryRunner.getTable(`${SportsDbSchema.MASL}.${tableName}`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(`${SportsDbSchema.MASL}.${tableName}`);
    await queryRunner.dropTable(table, true);
  }
}

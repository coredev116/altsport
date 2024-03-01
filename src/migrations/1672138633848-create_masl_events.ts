import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const tableName = "events";

export class createMaslEvents1672138633848 implements MigrationInterface {
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
            name: "leagueYearId",
            type: "uuid",
          },
          {
            name: "name",
            type: "text",
          },
          {
            name: "startDate",
            type: "timestamptz",
          },
          {
            name: "endDate",
            type: "timestamptz",
          },
          {
            name: "eventStatus",
            type: "int",
          },
          {
            name: "eventLocation",
            type: "text",
            isNullable: true,
          },
          {
            name: "eventLocationGroup",
            type: "text",
            isNullable: true,
          },
          {
            name: "isEventWinnerMarketOpen",
            type: "boolean",
            default: false,
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

    const table: Table = await queryRunner.getTable(`${SportsDbSchema.MASL}.${tableName}`);

    await Promise.all([
      queryRunner.createForeignKey(
        table,
        new TableForeignKey({
          columnNames: ["leagueYearId"],
          referencedColumnNames: ["id"],
          referencedTableName: "leagueYears",
          referencedSchema: SportsDbSchema.MASL,
        }),
      ),
      queryRunner.createIndex(
        table,
        new TableIndex({
          columnNames: ["leagueYearId"],
        }),
      ),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(`${SportsDbSchema.MASL}.${tableName}`);
    await queryRunner.dropTable(table, true);
  }
}

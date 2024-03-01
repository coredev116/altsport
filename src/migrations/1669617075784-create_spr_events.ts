import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const tableName = "events";

export class createSprEvents1669617075784 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: tableName,
        schema: SportsDbSchema.SPR,
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
            name: "tourYearId",
            type: "uuid",
          },
          {
            name: "name",
            type: "text",
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
            name: "eventNumber",
            type: "int",
            isNullable: true,
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
            isNullable: true,
            default: true,
          },
          {
            name: "categoryName",
            type: "text",
            isNullable: true,
            default: null,
          },
          {
            name: "trackType",
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

    const table: Table = await queryRunner.getTable(`${SportsDbSchema.SPR}.${tableName}`);

    await Promise.all([
      queryRunner.createForeignKey(
        table,
        new TableForeignKey({
          columnNames: ["tourYearId"],
          referencedColumnNames: ["id"],
          referencedTableName: "tourYears",
          referencedSchema: SportsDbSchema.SPR,
        }),
      ),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(`${SportsDbSchema.SPR}.${tableName}`);
    await queryRunner.dropTable(table, true);
  }
}

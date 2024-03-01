import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const tableName = "events";

export class createWrxEvents1656568263495 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: tableName,
        schema: SportsDbSchema.NRX,
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

    const table: Table = await queryRunner.getTable(`${SportsDbSchema.NRX}.${tableName}`);

    await Promise.all([
      queryRunner.createForeignKey(
        table,
        new TableForeignKey({
          columnNames: ["tourYearId"],
          referencedColumnNames: ["id"],
          referencedTableName: "tourYears",
          referencedSchema: SportsDbSchema.NRX,
        }),
      ),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(`${SportsDbSchema.NRX}.${tableName}`);
    await queryRunner.dropTable(table, true);
  }
}

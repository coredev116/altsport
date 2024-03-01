import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const tableName = "eventOddDerivatives";

export class eventOddDerivatives1654574920952 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
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
          },
          {
            name: "oddDerivativeId",
            type: "uuid",
          },
          {
            name: "holdingPercentage",
            type: "decimal",
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

    const table: Table = await queryRunner.getTable(`${SportsDbSchema.WSL}.${tableName}`);

    await Promise.all([
      queryRunner.createForeignKeys(table, [
        new TableForeignKey({
          columnNames: ["eventId"],
          referencedColumnNames: ["id"],
          referencedTableName: "events",
          referencedSchema: SportsDbSchema.WSL,
        }),
        new TableForeignKey({
          columnNames: ["oddDerivativeId"],
          referencedColumnNames: ["id"],
          referencedTableName: "oddDerivatives",
          referencedSchema: SportsDbSchema.WSL,
        }),
      ]),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(`${SportsDbSchema.WSL}.${tableName}`);
    await queryRunner.dropTable(table, true);
  }
}

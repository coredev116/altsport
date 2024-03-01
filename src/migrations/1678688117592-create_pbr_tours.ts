import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const tableName = "tours";

export class createPbrTours1678688117592 implements MigrationInterface {
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
            name: "name",
            type: "text",
            isNullable: false,
          },
          {
            name: "gender",
            type: "text",
            isNullable: true,
          },
          {
            name: "providerId",
            type: "text",
            isNullable: false,
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
      queryRunner.createIndex(
        table,
        new TableIndex({
          columnNames: ["providerId"],
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

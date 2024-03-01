import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const tableName = "athletes";

export class createPbrAthletes1678688116095 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createSchema(SportsDbSchema.PBR, true);

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
            name: "firstName",
            type: "text",
            isNullable: false,
          },
          {
            name: "middleName",
            type: "text",
            isNullable: true,
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
            name: "gender",
            type: "text",
            isNullable: true,
          },
          {
            name: "hometown",
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

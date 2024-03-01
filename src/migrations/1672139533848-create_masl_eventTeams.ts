import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const tableName = "eventTeams";

export class createMaslEventTeams1672139533848 implements MigrationInterface {
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
            name: "eventId",
            type: "uuid",
          },
          {
            name: "teamId",
            type: "uuid",
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

    const table: Table = await queryRunner.getTable(`${SportsDbSchema.MASL}.${tableName}`);

    await Promise.all([
      queryRunner.createForeignKey(
        table,
        new TableForeignKey({
          columnNames: ["eventId"],
          referencedColumnNames: ["id"],
          referencedTableName: "events",
          referencedSchema: SportsDbSchema.MASL,
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
          referencedSchema: SportsDbSchema.MASL,
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
    const table: Table = await queryRunner.getTable(`${SportsDbSchema.MASL}.${tableName}`);
    await queryRunner.dropTable(table, true);
  }
}

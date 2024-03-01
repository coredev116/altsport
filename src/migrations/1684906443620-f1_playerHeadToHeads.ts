import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const tableName = "playerHeadToHeads";

export class f1PlayerHeadToHeads1684906443620 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // this ensure we can use default: `uuid_generate_v4()`
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.createTable(
      new Table({
        name: tableName,
        schema: SportsDbSchema.F1,
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
            name: "eventParticipant1Id",
            type: "uuid",
          },
          {
            name: "eventParticipant2Id",
            type: "uuid",
          },
          {
            name: "eventParticipantWinnerId",
            type: "uuid",
            isNullable: true,
          },
          {
            name: "probability_A",
            type: "decimal",
            isNullable: true,
          },
          {
            name: "probability_B",
            type: "decimal",
            isNullable: true,
          },
          {
            name: "probability_C",
            type: "decimal",
            isNullable: true,
          },
          {
            name: "probability_D",
            type: "decimal",
            isNullable: true,
          },
          {
            name: "voided",
            type: "boolean",
            isNullable: true,
            default: false,
          },
          {
            name: "draw",
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

    const table: Table = await queryRunner.getTable(`${SportsDbSchema.F1}.${tableName}`);

    await Promise.all([
      queryRunner.createForeignKeys(table, [
        new TableForeignKey({
          columnNames: ["eventId"],
          referencedColumnNames: ["id"],
          referencedTableName: "events",
          referencedSchema: SportsDbSchema.F1,
        }),
        new TableForeignKey({
          columnNames: ["eventParticipant1Id"],
          referencedColumnNames: ["id"],
          referencedTableName: "eventParticipants",
          referencedSchema: SportsDbSchema.F1,
        }),
        new TableForeignKey({
          columnNames: ["eventParticipant2Id"],
          referencedColumnNames: ["id"],
          referencedTableName: "eventParticipants",
          referencedSchema: SportsDbSchema.F1,
        }),
        new TableForeignKey({
          columnNames: ["eventParticipantWinnerId"],
          referencedColumnNames: ["id"],
          referencedTableName: "eventParticipants",
          referencedSchema: SportsDbSchema.F1,
        }),
      ]),
      queryRunner.createIndices(table, [
        new TableIndex({
          columnNames: ["eventId"],
        }),
      ]),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(`${SportsDbSchema.F1}.${tableName}`);
    await queryRunner.dropTable(table, true);
  }
}

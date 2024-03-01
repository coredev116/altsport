import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const tableName = `${SportsDbSchema.JA}.clientOdds`;

export class CreateJaClientOdds1696420522252 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // this ensure we can use default: `uuid_generate_v4()`
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.createTable(
      new Table({
        name: tableName,
        schema: SportsDbSchema.JA,
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
            name: "marketType",
            type: "int",
            isNullable: false,
          },
          {
            name: "subMarketType",
            type: "int",
            isNullable: true,
          },
          {
            name: "type",
            type: "int",
            isNullable: true,
          },
          {
            name: "eventId",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "eventTeamId",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "eventRoundId",
            type: "uuid",
            isNullable: true,
          },
          {
            name: "odds",
            type: "decimal",
            isNullable: true,
          },
          {
            name: "probability",
            type: "decimal",
            isNullable: true,
          },
          {
            name: "trueProbability",
            type: "decimal",
            isNullable: true,
          },
          {
            name: "hasModifiedProbability",
            type: "boolean",
            default: false,
          },
          {
            name: "lean",
            type: "int",
            isNullable: true,
          },
          {
            name: "bias",
            type: "int",
            isNullable: true,
          },
          {
            name: "weights",
            type: "int",
            isArray: true,
            isNullable: true,
          },
          {
            name: "max",
            type: "int",
            isNullable: true,
          },
          {
            name: "holdingPercentage",
            type: "decimal",
            isNullable: true,
          },
          {
            name: "calculatedValue",
            type: "decimal",
            isNullable: true,
          },
          {
            name: "betType",
            type: "int",
            isNullable: true,
          },
          {
            name: "isMarketActive",
            type: "boolean",
            default: true,
          },
          {
            name: "isSubMarketLocked",
            type: "boolean",
            default: false,
          },
          {
            name: "prop",
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

    const table: Table = await queryRunner.getTable(tableName);

    await Promise.all([
      queryRunner.createForeignKeys(table, [
        new TableForeignKey({
          columnNames: ["eventId"],
          referencedColumnNames: ["id"],
          referencedTableName: "events",
          referencedSchema: SportsDbSchema.JA,
        }),
        new TableForeignKey({
          columnNames: ["eventTeamId"],
          referencedColumnNames: ["id"],
          referencedTableName: "eventTeams",
          referencedSchema: SportsDbSchema.JA,
        }),
        new TableForeignKey({
          columnNames: ["eventRoundId"],
          referencedColumnNames: ["id"],
          referencedTableName: "eventRounds",
          referencedSchema: SportsDbSchema.JA,
        }),
      ]),
      queryRunner.createIndices(table, [
        new TableIndex({
          columnNames: ["eventId"],
        }),
        new TableIndex({
          columnNames: ["eventTeamId"],
        }),
        new TableIndex({
          columnNames: ["eventRoundId"],
        }),
      ]),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(tableName);
    await queryRunner.dropTable(table, true);
  }
}

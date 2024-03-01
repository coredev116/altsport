import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const tableName = `${SportsDbSchema.MASL}.odds`;

export class ModifyMaslCreateOdds1702032869787 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
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
            // default: `uuid_generate_v4()`,
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
            isNullable: false,
          },
          {
            name: "probability",
            type: "decimal",
            isNullable: false,
          },
          {
            name: "trueProbability",
            type: "decimal",
            isNullable: false,
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
            name: "playerLean",
            type: "int",
            default: 0,
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
          referencedSchema: SportsDbSchema.MASL,
        }),
        new TableForeignKey({
          columnNames: ["eventTeamId"],
          referencedColumnNames: ["id"],
          referencedTableName: "eventTeams",
          referencedSchema: SportsDbSchema.MASL,
        }),
        new TableForeignKey({
          columnNames: ["eventRoundId"],
          referencedColumnNames: ["id"],
          referencedTableName: "eventRounds",
          referencedSchema: SportsDbSchema.MASL,
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

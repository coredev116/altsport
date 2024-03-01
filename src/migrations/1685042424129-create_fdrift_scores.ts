import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const tableName = "scores";

export class createFdriftScores1685042424129 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: tableName,
        schema: SportsDbSchema.FDRIFT,
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
            name: "roundHeatId",
            type: "uuid",
          },
          {
            name: "athleteId",
            type: "uuid",
          },
          {
            name: "roundSeed",
            type: "int",
            isNullable: true,
          },
          {
            name: "lapTime",
            type: "decimal",
            isNullable: true,
          },
          {
            name: "jokerLapTime",
            type: "decimal",
            isNullable: true,
          },
          {
            name: "penaltyTime",
            type: "decimal",
            isNullable: true,
          },
          {
            name: "totalLapTime",
            type: "decimal",
            isNullable: true,
          },
          {
            name: "heatPosition",
            type: "int",
            isNullable: true,
          },
          {
            name: "lapNumber",
            type: "int",
            isNullable: true,
          },
          {
            name: "notes",
            type: "text",
            isNullable: true,
          },
          {
            name: "isBye",
            type: "boolean",
            default: false,
          },
          {
            name: "isJoker",
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

    const table: Table = await queryRunner.getTable(`${SportsDbSchema.FDRIFT}.${tableName}`);

    await Promise.all([
      queryRunner.createForeignKeys(table, [
        new TableForeignKey({
          columnNames: ["eventId"],
          referencedColumnNames: ["id"],
          referencedTableName: "events",
          referencedSchema: SportsDbSchema.FDRIFT,
        }),
        new TableForeignKey({
          columnNames: ["roundHeatId"],
          referencedColumnNames: ["id"],
          referencedTableName: "roundHeats",
          referencedSchema: SportsDbSchema.FDRIFT,
        }),
        new TableForeignKey({
          columnNames: ["athleteId"],
          referencedColumnNames: ["id"],
          referencedTableName: "athletes",
          referencedSchema: SportsDbSchema.FDRIFT,
        }),
      ]),
      queryRunner.createIndices(table, [
        new TableIndex({
          columnNames: ["eventId"],
        }),
        new TableIndex({
          columnNames: ["roundHeatId"],
        }),
      ]),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(`${SportsDbSchema.FDRIFT}.${tableName}`);
    await queryRunner.dropTable(table, true);
  }
}

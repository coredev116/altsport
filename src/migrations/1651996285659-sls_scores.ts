import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const tableName = "scores";

export class slsScores1651996285659 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: tableName,
        schema: SportsDbSchema.SLS,
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
            name: "runScore",
            type: "int",
            isNullable: true,
          },
          {
            name: "roundScore",
            type: "int",
            isNullable: true,
          },
          {
            name: "trick1Score",
            type: "int",
            isNullable: true,
          },
          {
            name: "trick2Score",
            type: "int",
            isNullable: true,
          },
          {
            name: "trick3Score",
            type: "int",
            isNullable: true,
          },
          {
            name: "trick4Score",
            type: "int",
            isNullable: true,
          },
          {
            name: "trick5Score",
            type: "int",
            isNullable: true,
          },
          {
            name: "trick6Score",
            type: "int",
            isNullable: true,
          },
          {
            name: "heatPosition",
            type: "int",
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

    const table: Table = await queryRunner.getTable(`${SportsDbSchema.SLS}.${tableName}`);

    await Promise.all([
      queryRunner.createForeignKeys(table, [
        new TableForeignKey({
          columnNames: ["eventId"],
          referencedColumnNames: ["id"],
          referencedTableName: "events",
          referencedSchema: SportsDbSchema.SLS,
        }),
        new TableForeignKey({
          columnNames: ["roundHeatId"],
          referencedColumnNames: ["id"],
          referencedTableName: "roundHeats",
          referencedSchema: SportsDbSchema.SLS,
        }),
        new TableForeignKey({
          columnNames: ["athleteId"],
          referencedColumnNames: ["id"],
          referencedTableName: "athletes",
          referencedSchema: SportsDbSchema.SLS,
        }),
      ]),
      queryRunner.createIndices(table, [
        new TableIndex({
          columnNames: ["eventId"],
        }),
        new TableIndex({
          columnNames: ["roundHeatId"],
        }),
        new TableIndex({
          columnNames: ["athleteId"],
        }),
      ]),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(`${SportsDbSchema.SLS}.${tableName}`);
    await queryRunner.dropTable(table, true);
  }
}

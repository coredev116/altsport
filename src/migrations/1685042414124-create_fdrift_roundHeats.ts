import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const tableName = "roundHeats";

export class createFdriftRoundHeats1685042414124 implements MigrationInterface {
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
            name: "roundId",
            type: "uuid",
          },
          {
            name: "providerRunId",
            type: "text",
            isNullable: true,
          },
          {
            name: "heatName",
            type: "text",
          },
          {
            name: "heatNo",
            type: "int",
          },
          {
            name: "heatStatus",
            type: "int",
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
            name: "isHeatWinnerMarketOpen",
            type: "boolean",
            isNullable: true,
            default: true,
          },
          {
            name: "isHeatWinnerMarketVoided",
            type: "boolean",
            default: false,
          },
          {
            name: "voidDate",
            type: "timestamptz",
            isNullable: true,
            default: null,
          },
          {
            name: "winnerAthleteId",
            type: "uuid",
            default: null,
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
          columnNames: ["roundId"],
          referencedColumnNames: ["id"],
          referencedTableName: "rounds",
          referencedSchema: SportsDbSchema.FDRIFT,
        }),
        new TableForeignKey({
          columnNames: ["winnerAthleteId"],
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
          columnNames: ["roundId"],
        }),
      ]),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(`${SportsDbSchema.FDRIFT}.${tableName}`);
    await queryRunner.dropTable(table, true);
  }
}

import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const tableName = `${SportsDbSchema.WSL}.playerHeadToHeads`;

export class createHeadToHeadWsl1656781295805 implements MigrationInterface {
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
            name: "player1Position",
            type: "int",
            isNullable: true,
          },
          {
            name: "player2Position",
            type: "int",
            isNullable: true,
          },
          {
            name: "player1Odds",
            type: "decimal",
            isNullable: true,
          },
          {
            name: "player2Odds",
            type: "decimal",
            isNullable: true,
          },
          {
            name: "player1Probability",
            type: "decimal",
            isNullable: true,
            default: 0,
          },
          {
            name: "player2Probability",
            type: "decimal",
            isNullable: true,
            default: 0,
          },
          {
            name: "player1TrueProbability",
            type: "decimal",
            isNullable: true,
            default: 0,
          },
          {
            name: "player2TrueProbability",
            type: "decimal",
            isNullable: true,
            default: 0,
          },
          {
            name: "player1HasModifiedProbability",
            type: "boolean",
            isNullable: true,
            default: false,
          },
          {
            name: "player2HasModifiedProbability",
            type: "boolean",
            isNullable: true,
            default: false,
          },
          {
            name: "holdingPercentage",
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
          referencedSchema: SportsDbSchema.WSL,
        }),
        new TableForeignKey({
          columnNames: ["eventParticipant1Id"],
          referencedColumnNames: ["id"],
          referencedTableName: "eventParticipants",
          referencedSchema: SportsDbSchema.WSL,
        }),
        new TableForeignKey({
          columnNames: ["eventParticipant2Id"],
          referencedColumnNames: ["id"],
          referencedTableName: "eventParticipants",
          referencedSchema: SportsDbSchema.WSL,
        }),
        new TableForeignKey({
          columnNames: ["eventParticipantWinnerId"],
          referencedColumnNames: ["id"],
          referencedTableName: "eventParticipants",
          referencedSchema: SportsDbSchema.WSL,
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
    const table: Table = await queryRunner.getTable(tableName);
    await queryRunner.dropTable(table, true);
  }
}

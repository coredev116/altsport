import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
  TableColumnOptions,
} from "typeorm";

import { SportsDbSchema } from "../constants/system";

const nrxTableName = `${SportsDbSchema.NRX}.clientPlayerHeadToHeads`;
const wslTableName = `${SportsDbSchema.WSL}.clientPlayerHeadToHeads`;
const slsTableName = `${SportsDbSchema.SLS}.clientPlayerHeadToHeads`;

const columns: TableColumnOptions[] = [
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
];

export class createClientPlayerHeadToHeads1666785376885 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await Promise.all([
      queryRunner.createTable(
        new Table({
          name: nrxTableName,
          schema: SportsDbSchema.NRX,
          columns,
        }),
        true,
      ),
      queryRunner.createTable(
        new Table({
          name: wslTableName,
          schema: SportsDbSchema.WSL,
          columns,
        }),
        true,
      ),
      queryRunner.createTable(
        new Table({
          name: slsTableName,
          schema: SportsDbSchema.SLS,
          columns,
        }),
        true,
      ),
    ]);

    const nrxTable: Table = await queryRunner.getTable(nrxTableName);
    const wslTable: Table = await queryRunner.getTable(wslTableName);
    const slsTable: Table = await queryRunner.getTable(slsTableName);

    await Promise.all([
      //wsl
      queryRunner.createForeignKeys(wslTable, [
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
      queryRunner.createIndices(wslTable, [
        new TableIndex({
          columnNames: ["eventId"],
        }),
      ]),

      //sls
      queryRunner.createForeignKeys(slsTable, [
        new TableForeignKey({
          columnNames: ["eventId"],
          referencedColumnNames: ["id"],
          referencedTableName: "events",
          referencedSchema: SportsDbSchema.SLS,
        }),
        new TableForeignKey({
          columnNames: ["eventParticipant1Id"],
          referencedColumnNames: ["id"],
          referencedTableName: "eventParticipants",
          referencedSchema: SportsDbSchema.SLS,
        }),
        new TableForeignKey({
          columnNames: ["eventParticipant2Id"],
          referencedColumnNames: ["id"],
          referencedTableName: "eventParticipants",
          referencedSchema: SportsDbSchema.SLS,
        }),
        new TableForeignKey({
          columnNames: ["eventParticipantWinnerId"],
          referencedColumnNames: ["id"],
          referencedTableName: "eventParticipants",
          referencedSchema: SportsDbSchema.SLS,
        }),
      ]),
      queryRunner.createIndices(slsTable, [
        new TableIndex({
          columnNames: ["eventId"],
        }),
      ]),

      //nrx
      queryRunner.createForeignKeys(nrxTable, [
        new TableForeignKey({
          columnNames: ["eventId"],
          referencedColumnNames: ["id"],
          referencedTableName: "events",
          referencedSchema: SportsDbSchema.NRX,
        }),
        new TableForeignKey({
          columnNames: ["eventParticipant1Id"],
          referencedColumnNames: ["id"],
          referencedTableName: "eventParticipants",
          referencedSchema: SportsDbSchema.NRX,
        }),
        new TableForeignKey({
          columnNames: ["eventParticipant2Id"],
          referencedColumnNames: ["id"],
          referencedTableName: "eventParticipants",
          referencedSchema: SportsDbSchema.NRX,
        }),
        new TableForeignKey({
          columnNames: ["eventParticipantWinnerId"],
          referencedColumnNames: ["id"],
          referencedTableName: "eventParticipants",
          referencedSchema: SportsDbSchema.NRX,
        }),
      ]),
      queryRunner.createIndices(nrxTable, [
        new TableIndex({
          columnNames: ["eventId"],
        }),
      ]),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const nrxTable: Table = await queryRunner.getTable(nrxTableName);
    await queryRunner.dropTable(nrxTable, true);

    const wslTable: Table = await queryRunner.getTable(wslTableName);
    await queryRunner.dropTable(wslTable, true);

    const slsTable: Table = await queryRunner.getTable(slsTableName);
    await queryRunner.dropTable(slsTable, true);
  }
}

import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
  TableColumnOptions,
} from "typeorm";

import { SportsDbSchema } from "../constants/system";

const nrxTableName = `${SportsDbSchema.NRX}.clientProjectionEventOutcome`;
const wslTableName = `${SportsDbSchema.WSL}.clientProjectionEventOutcome`;
const slsTableName = `${SportsDbSchema.SLS}.clientProjectionEventOutcome`;

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
    name: "eventParticipantId",
    type: "uuid",
  },
  {
    name: "position",
    type: "int",
  },
  {
    name: "odds",
    type: "decimal",
  },
  {
    name: "trueProbability",
    type: "decimal",
    isNullable: true,
    default: 0,
  },
  {
    name: "hasModifiedProbability",
    type: "boolean",
    isNullable: true,
    default: false,
  },
  {
    name: "probability",
    type: "decimal",
    isNullable: true,
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
];

export class createClientProjectionEventOutcome1666785375585 implements MigrationInterface {
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
          columnNames: ["eventParticipantId"],
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
          columnNames: ["eventParticipantId"],
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
          columnNames: ["eventParticipantId"],
          referencedColumnNames: ["id"],
          referencedTableName: "eventParticipants",
          referencedSchema: SportsDbSchema.NRX,
        }),
      ]),
      queryRunner.createIndices(nrxTable, [
        new TableIndex({
          columnNames: ["eventId"],
        }),
        new TableIndex({
          columnNames: ["eventParticipantId"],
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

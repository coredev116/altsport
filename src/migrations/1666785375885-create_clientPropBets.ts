import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableColumnOptions,
} from "typeorm";

import { SportsDbSchema } from "../constants/system";

const nrxTableName = `${SportsDbSchema.NRX}.clientPropBets`;
const wslTableName = `${SportsDbSchema.WSL}.clientPropBets`;
const slsTableName = `${SportsDbSchema.SLS}.clientPropBets`;

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
    isNullable: true,
  },
  {
    name: "proposition",
    type: "text",
  },
  {
    name: "odds",
    type: "decimal",
  },
  {
    name: "voided",
    type: "boolean",
    default: false,
  },
  {
    name: "payout",
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

export class createClientPropBets1666785375885 implements MigrationInterface {
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

import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
  TableColumnOptions,
} from "typeorm";

import { SportsDbSchema } from "../constants/system";

const mxgpTableName = `${SportsDbSchema.MXGP}.clientProjectionDreamTeam`;
const f1TableName = `${SportsDbSchema.F1}.clientProjectionDreamTeam`;
const mgTableName = `${SportsDbSchema.MotoGP}.clientProjectionDreamTeam`;

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
    isNullable: false,
  },
  {
    name: "voided",
    type: "boolean",
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

export class CreateF1MgMxgpProjectionDreamTeam1688382853552 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // this ensure we can use default: `uuid_generate_v4()`
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await Promise.all([
      queryRunner.createTable(
        new Table({
          name: mxgpTableName,
          schema: SportsDbSchema.MXGP,
          columns,
        }),
        true,
      ),
      queryRunner.createTable(
        new Table({
          name: f1TableName,
          schema: SportsDbSchema.F1,
          columns,
        }),
        true,
      ),
      queryRunner.createTable(
        new Table({
          name: mgTableName,
          schema: SportsDbSchema.MotoGP,
          columns,
        }),
        true,
      ),
    ]);

    const mxgpTable: Table = await queryRunner.getTable(`${mxgpTableName}`);
    const f1Table: Table = await queryRunner.getTable(`${f1TableName}`);
    const mgTable: Table = await queryRunner.getTable(`${mgTableName}`);

    await Promise.all([
      queryRunner.createForeignKeys(mxgpTable, [
        new TableForeignKey({
          columnNames: ["eventId"],
          referencedColumnNames: ["id"],
          referencedTableName: "events",
          referencedSchema: SportsDbSchema.MXGP,
        }),
      ]),
      queryRunner.createIndices(mxgpTable, [
        new TableIndex({
          columnNames: ["eventId"],
        }),
      ]),

      queryRunner.createForeignKeys(f1Table, [
        new TableForeignKey({
          columnNames: ["eventId"],
          referencedColumnNames: ["id"],
          referencedTableName: "events",
          referencedSchema: SportsDbSchema.F1,
        }),
      ]),
      queryRunner.createIndices(f1Table, [
        new TableIndex({
          columnNames: ["eventId"],
        }),
      ]),

      queryRunner.createForeignKeys(mgTable, [
        new TableForeignKey({
          columnNames: ["eventId"],
          referencedColumnNames: ["id"],
          referencedTableName: "events",
          referencedSchema: SportsDbSchema.MotoGP,
        }),
      ]),
      queryRunner.createIndices(mgTable, [
        new TableIndex({
          columnNames: ["eventId"],
        }),
      ]),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const mxgpTable: Table = await queryRunner.getTable(`${mxgpTableName}`);
    const f1Table: Table = await queryRunner.getTable(`${f1TableName}`);
    const mgTable: Table = await queryRunner.getTable(`${mgTableName}`);
    await Promise.all([
      queryRunner.dropTable(mxgpTable, true),
      queryRunner.dropTable(f1Table, true),
      queryRunner.dropTable(mgTable, true),
    ]);
  }
}

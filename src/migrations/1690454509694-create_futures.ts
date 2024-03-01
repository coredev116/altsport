import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableColumnOptions,
} from "typeorm";

import { SportsDbSchema } from "../constants/system";

const f1TableName = `${SportsDbSchema.F1}.futures`;
const fdriftTableName = `${SportsDbSchema.FDRIFT}.futures`;
const motocrsTableName = `${SportsDbSchema.MOTOCRS}.futures`;
const motogpTableName = `${SportsDbSchema.MotoGP}.futures`;
const mxgpTableName = `${SportsDbSchema.MXGP}.futures`;
const nrxTableName = `${SportsDbSchema.NRX}.futures`;
const pbrTableName = `${SportsDbSchema.PBR}.futures`;
const sprTableName = `${SportsDbSchema.SPR}.futures`;
const wslTableName = `${SportsDbSchema.WSL}.futures`;

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
    name: "tourYearId",
    type: "uuid",
    isNullable: false,
  },
  {
    name: "type",
    type: "text",
    isNullable: false,
  },
  {
    name: "isMarketOpen",
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

export class CreateFutures1690454509694 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await Promise.all([
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
          name: fdriftTableName,
          schema: SportsDbSchema.FDRIFT,
          columns,
        }),
        true,
      ),

      queryRunner.createTable(
        new Table({
          name: motocrsTableName,
          schema: SportsDbSchema.MOTOCRS,
          columns,
        }),
        true,
      ),

      queryRunner.createTable(
        new Table({
          name: motogpTableName,
          schema: SportsDbSchema.MotoGP,
          columns,
        }),
        true,
      ),

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
          name: nrxTableName,
          schema: SportsDbSchema.NRX,
          columns,
        }),
        true,
      ),

      queryRunner.createTable(
        new Table({
          name: pbrTableName,
          schema: SportsDbSchema.PBR,
          columns,
        }),
        true,
      ),

      queryRunner.createTable(
        new Table({
          name: sprTableName,
          schema: SportsDbSchema.SPR,
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
    ]);

    const f1Table: Table = await queryRunner.getTable(f1TableName);
    const fdriftTable: Table = await queryRunner.getTable(fdriftTableName);
    const motocrsTable: Table = await queryRunner.getTable(motocrsTableName);
    const motogpTable: Table = await queryRunner.getTable(motogpTableName);
    const mxgpTable: Table = await queryRunner.getTable(mxgpTableName);
    const nrxTable: Table = await queryRunner.getTable(nrxTableName);
    const pbrTable: Table = await queryRunner.getTable(pbrTableName);
    const sprTable: Table = await queryRunner.getTable(sprTableName);
    const wslTable: Table = await queryRunner.getTable(wslTableName);

    await Promise.all([
      queryRunner.createForeignKeys(f1Table, [
        new TableForeignKey({
          columnNames: ["tourYearId"],
          referencedColumnNames: ["id"],
          referencedTableName: "tourYears",
          referencedSchema: SportsDbSchema.F1,
        }),
      ]),

      queryRunner.createForeignKeys(fdriftTable, [
        new TableForeignKey({
          columnNames: ["tourYearId"],
          referencedColumnNames: ["id"],
          referencedTableName: "tourYears",
          referencedSchema: SportsDbSchema.FDRIFT,
        }),
      ]),

      queryRunner.createForeignKeys(motocrsTable, [
        new TableForeignKey({
          columnNames: ["tourYearId"],
          referencedColumnNames: ["id"],
          referencedTableName: "tourYears",
          referencedSchema: SportsDbSchema.MOTOCRS,
        }),
      ]),

      queryRunner.createForeignKeys(motogpTable, [
        new TableForeignKey({
          columnNames: ["tourYearId"],
          referencedColumnNames: ["id"],
          referencedTableName: "tourYears",
          referencedSchema: SportsDbSchema.MotoGP,
        }),
      ]),

      queryRunner.createForeignKeys(mxgpTable, [
        new TableForeignKey({
          columnNames: ["tourYearId"],
          referencedColumnNames: ["id"],
          referencedTableName: "tourYears",
          referencedSchema: SportsDbSchema.MXGP,
        }),
      ]),

      queryRunner.createForeignKeys(nrxTable, [
        new TableForeignKey({
          columnNames: ["tourYearId"],
          referencedColumnNames: ["id"],
          referencedTableName: "tourYears",
          referencedSchema: SportsDbSchema.NRX,
        }),
      ]),

      queryRunner.createForeignKeys(pbrTable, [
        new TableForeignKey({
          columnNames: ["tourYearId"],
          referencedColumnNames: ["id"],
          referencedTableName: "tourYears",
          referencedSchema: SportsDbSchema.PBR,
        }),
      ]),

      queryRunner.createForeignKeys(sprTable, [
        new TableForeignKey({
          columnNames: ["tourYearId"],
          referencedColumnNames: ["id"],
          referencedTableName: "tourYears",
          referencedSchema: SportsDbSchema.SPR,
        }),
      ]),

      queryRunner.createForeignKeys(wslTable, [
        new TableForeignKey({
          columnNames: ["tourYearId"],
          referencedColumnNames: ["id"],
          referencedTableName: "tourYears",
          referencedSchema: SportsDbSchema.WSL,
        }),
      ]),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const f1Table: Table = await queryRunner.getTable(f1TableName);
    await queryRunner.dropTable(f1Table, true);

    const fdriftTable: Table = await queryRunner.getTable(fdriftTableName);
    await queryRunner.dropTable(fdriftTable, true);

    const motocrsTable: Table = await queryRunner.getTable(motocrsTableName);
    await queryRunner.dropTable(motocrsTable, true);

    const motogpTable: Table = await queryRunner.getTable(motogpTableName);
    await queryRunner.dropTable(motogpTable, true);

    const mxgpTable: Table = await queryRunner.getTable(mxgpTableName);
    await queryRunner.dropTable(mxgpTable, true);

    const nrxTable: Table = await queryRunner.getTable(nrxTableName);
    await queryRunner.dropTable(nrxTable, true);

    const pbrTable: Table = await queryRunner.getTable(pbrTableName);
    await queryRunner.dropTable(pbrTable, true);

    const sprTable: Table = await queryRunner.getTable(sprTableName);
    await queryRunner.dropTable(sprTable, true);

    const wslTable: Table = await queryRunner.getTable(wslTableName);
    await queryRunner.dropTable(wslTable, true);
  }
}

import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableColumnOptions,
} from "typeorm";

import { SportsDbSchema } from "../constants/system";

const f1TableName = `${SportsDbSchema.F1}.clientFutureOdds`;
const fdriftTableName = `${SportsDbSchema.FDRIFT}.clientFutureOdds`;
const motocrsTableName = `${SportsDbSchema.MOTOCRS}.clientFutureOdds`;
const motogpTableName = `${SportsDbSchema.MotoGP}.clientFutureOdds`;
const mxgpTableName = `${SportsDbSchema.MXGP}.clientFutureOdds`;
const nrxTableName = `${SportsDbSchema.NRX}.clientFutureOdds`;
const pbrTableName = `${SportsDbSchema.PBR}.clientFutureOdds`;
const sprTableName = `${SportsDbSchema.SPR}.clientFutureOdds`;
const wslTableName = `${SportsDbSchema.WSL}.clientFutureOdds`;
const slsTableName = `${SportsDbSchema.SLS}.clientFutureOdds`;
const maslTableName = `${SportsDbSchema.MASL}.clientFutureOdds`;

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
    name: "futureId",
    type: "uuid",
    isNullable: false,
  },
  {
    name: "athleteId",
    type: "uuid",
    isNullable: false,
  },
  {
    name: "odds",
    type: "decimal",
    default: 0,
  },
  {
    name: "trueProbability",
    type: "decimal",
    default: 0,
  },
  {
    name: "hasModifiedProbability",
    type: "boolean",
    default: false,
  },
  {
    name: "probability",
    type: "decimal",
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

export class CreateClientFutureOdds1690802259823 implements MigrationInterface {
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

      queryRunner.createTable(
        new Table({
          name: slsTableName,
          schema: SportsDbSchema.SLS,
          columns,
        }),
        true,
      ),

      queryRunner.createTable(
        new Table({
          name: maslTableName,
          schema: SportsDbSchema.MASL,
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
    const slsTable: Table = await queryRunner.getTable(slsTableName);
    const maslTable: Table = await queryRunner.getTable(maslTableName);

    await Promise.all([
      queryRunner.createForeignKeys(f1Table, [
        new TableForeignKey({
          columnNames: ["athleteId"],
          referencedColumnNames: ["id"],
          referencedTableName: "athletes",
          referencedSchema: SportsDbSchema.F1,
        }),
      ]),

      queryRunner.createForeignKeys(fdriftTable, [
        new TableForeignKey({
          columnNames: ["athleteId"],
          referencedColumnNames: ["id"],
          referencedTableName: "athletes",
          referencedSchema: SportsDbSchema.FDRIFT,
        }),
      ]),

      queryRunner.createForeignKeys(motocrsTable, [
        new TableForeignKey({
          columnNames: ["athleteId"],
          referencedColumnNames: ["id"],
          referencedTableName: "athletes",
          referencedSchema: SportsDbSchema.MOTOCRS,
        }),
      ]),

      queryRunner.createForeignKeys(motogpTable, [
        new TableForeignKey({
          columnNames: ["athleteId"],
          referencedColumnNames: ["id"],
          referencedTableName: "athletes",
          referencedSchema: SportsDbSchema.MotoGP,
        }),
      ]),

      queryRunner.createForeignKeys(mxgpTable, [
        new TableForeignKey({
          columnNames: ["athleteId"],
          referencedColumnNames: ["id"],
          referencedTableName: "athletes",
          referencedSchema: SportsDbSchema.MXGP,
        }),
      ]),

      queryRunner.createForeignKeys(nrxTable, [
        new TableForeignKey({
          columnNames: ["athleteId"],
          referencedColumnNames: ["id"],
          referencedTableName: "athletes",
          referencedSchema: SportsDbSchema.NRX,
        }),
      ]),

      queryRunner.createForeignKeys(pbrTable, [
        new TableForeignKey({
          columnNames: ["athleteId"],
          referencedColumnNames: ["id"],
          referencedTableName: "athletes",
          referencedSchema: SportsDbSchema.PBR,
        }),
      ]),

      queryRunner.createForeignKeys(sprTable, [
        new TableForeignKey({
          columnNames: ["athleteId"],
          referencedColumnNames: ["id"],
          referencedTableName: "athletes",
          referencedSchema: SportsDbSchema.SPR,
        }),
      ]),

      queryRunner.createForeignKeys(wslTable, [
        new TableForeignKey({
          columnNames: ["athleteId"],
          referencedColumnNames: ["id"],
          referencedTableName: "athletes",
          referencedSchema: SportsDbSchema.WSL,
        }),
      ]),

      queryRunner.createForeignKeys(slsTable, [
        new TableForeignKey({
          columnNames: ["athleteId"],
          referencedColumnNames: ["id"],
          referencedTableName: "athletes",
          referencedSchema: SportsDbSchema.SLS,
        }),
      ]),

      queryRunner.createForeignKeys(maslTable, [
        new TableForeignKey({
          columnNames: ["athleteId"],
          referencedColumnNames: ["id"],
          referencedTableName: "teams",
          referencedSchema: SportsDbSchema.MASL,
        }),
      ]),

      //futureId
      queryRunner.createForeignKeys(f1Table, [
        new TableForeignKey({
          columnNames: ["futureId"],
          referencedColumnNames: ["id"],
          referencedTableName: "futures",
          referencedSchema: SportsDbSchema.F1,
        }),
      ]),

      queryRunner.createForeignKeys(fdriftTable, [
        new TableForeignKey({
          columnNames: ["futureId"],
          referencedColumnNames: ["id"],
          referencedTableName: "futures",
          referencedSchema: SportsDbSchema.FDRIFT,
        }),
      ]),

      queryRunner.createForeignKeys(motocrsTable, [
        new TableForeignKey({
          columnNames: ["futureId"],
          referencedColumnNames: ["id"],
          referencedTableName: "futures",
          referencedSchema: SportsDbSchema.MOTOCRS,
        }),
      ]),

      queryRunner.createForeignKeys(motogpTable, [
        new TableForeignKey({
          columnNames: ["futureId"],
          referencedColumnNames: ["id"],
          referencedTableName: "futures",
          referencedSchema: SportsDbSchema.MotoGP,
        }),
      ]),

      queryRunner.createForeignKeys(mxgpTable, [
        new TableForeignKey({
          columnNames: ["futureId"],
          referencedColumnNames: ["id"],
          referencedTableName: "futures",
          referencedSchema: SportsDbSchema.MXGP,
        }),
      ]),

      queryRunner.createForeignKeys(nrxTable, [
        new TableForeignKey({
          columnNames: ["futureId"],
          referencedColumnNames: ["id"],
          referencedTableName: "futures",
          referencedSchema: SportsDbSchema.NRX,
        }),
      ]),

      queryRunner.createForeignKeys(pbrTable, [
        new TableForeignKey({
          columnNames: ["futureId"],
          referencedColumnNames: ["id"],
          referencedTableName: "futures",
          referencedSchema: SportsDbSchema.PBR,
        }),
      ]),

      queryRunner.createForeignKeys(sprTable, [
        new TableForeignKey({
          columnNames: ["futureId"],
          referencedColumnNames: ["id"],
          referencedTableName: "futures",
          referencedSchema: SportsDbSchema.SPR,
        }),
      ]),

      queryRunner.createForeignKeys(wslTable, [
        new TableForeignKey({
          columnNames: ["futureId"],
          referencedColumnNames: ["id"],
          referencedTableName: "futures",
          referencedSchema: SportsDbSchema.WSL,
        }),
      ]),

      queryRunner.createForeignKeys(slsTable, [
        new TableForeignKey({
          columnNames: ["futureId"],
          referencedColumnNames: ["id"],
          referencedTableName: "futures",
          referencedSchema: SportsDbSchema.SLS,
        }),
      ]),

      queryRunner.createForeignKeys(maslTable, [
        new TableForeignKey({
          columnNames: ["futureId"],
          referencedColumnNames: ["id"],
          referencedTableName: "futures",
          referencedSchema: SportsDbSchema.MASL,
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

    const slsTable: Table = await queryRunner.getTable(slsTableName);
    await queryRunner.dropTable(slsTable, true);

    const maslTable: Table = await queryRunner.getTable(maslTableName);
    await queryRunner.dropTable(maslTable, true);
  }
}

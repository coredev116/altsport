import { MigrationInterface, QueryRunner, Table, TableColumn, TableColumnOptions } from "typeorm";

import { SportsDbSchema, FutureStatus } from "../constants/system";

const tableName: string = "futures";

const sports = [
  SportsDbSchema.WSL,
  SportsDbSchema.SLS,
  SportsDbSchema.NRX,
  SportsDbSchema.SPR,
  SportsDbSchema.F1,
  SportsDbSchema.MotoGP,
  SportsDbSchema.MOTOCRS,
  SportsDbSchema.FDRIFT,
  SportsDbSchema.MXGP,
  SportsDbSchema.MASL,
  SportsDbSchema.PBR,
];
const sportTables = sports.map((sport) => `${sport}.${tableName}`);

const columnStatus: TableColumnOptions = {
  name: "status",
  type: "int",
  isNullable: false,
  default: FutureStatus.LIVE,
};
const columnStartDate: TableColumnOptions = {
  name: "startDate",
  type: "timestamptz",
  isNullable: true,
};
const columnEndDate: TableColumnOptions = {
  name: "endDate",
  type: "timestamptz",
  isNullable: true,
};

export class ModifyFutures1690802049877 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tables: Table[] = await Promise.all(
      sportTables.map((sportTable) => queryRunner.getTable(sportTable)),
    );

    await Promise.all(
      tables.map(async (table) => {
        await queryRunner.addColumn(table, new TableColumn(columnStatus));
        await queryRunner.addColumn(table, new TableColumn(columnStartDate));
        return queryRunner.addColumn(table, new TableColumn(columnEndDate));
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tables: Table[] = await Promise.all(
      sportTables.map((sportTable) => queryRunner.getTable(sportTable)),
    );

    await Promise.all(
      tables.map(async (table) => {
        await queryRunner.dropColumn(table, "status");
        await queryRunner.dropColumn(table, "startDate");
        return queryRunner.dropColumn(table, "endDate");
      }),
    );
  }
}

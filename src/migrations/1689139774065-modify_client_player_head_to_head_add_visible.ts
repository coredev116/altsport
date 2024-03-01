import { MigrationInterface, QueryRunner, Table, TableColumn, TableColumnOptions } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const tableName: string = "clientPlayerHeadToHeads";
// at the time this migration was created, these were the only sports that supported it
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
];
const sportTables = sports.map((sport) => `${sport}.${tableName}`);

const columnName: string = "visible";

const columnAttrs: TableColumnOptions = {
  name: columnName,
  type: "boolean",
  default: true,
};

export class ModifyClientPlayerHeadToHeadAddVisible1689139774065 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tables: Table[] = await Promise.all(
      sportTables.map((sportTable) => queryRunner.getTable(sportTable)),
    );

    await Promise.all(
      tables.map((table) => queryRunner.addColumn(table, new TableColumn(columnAttrs))),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tables: Table[] = await Promise.all(
      sportTables.map((sportTable) => queryRunner.getTable(sportTable)),
    );

    await Promise.all(tables.map((table) => queryRunner.dropColumn(table, columnName)));
  }
}

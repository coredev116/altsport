import { MigrationInterface, QueryRunner, TableColumn, Table } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const clientsTableName = `clientPropBets`;
const tradersPropBetsTableName = `propBets`;

const schemas = [SportsDbSchema.NRX, SportsDbSchema.SLS, SportsDbSchema.SPR, SportsDbSchema.WSL];

const traderTableNames: string[] = schemas.map((schema) => `${schema}.${tradersPropBetsTableName}`);
const clientTableNames: string[] = schemas.map((schema) => `${schema}.${clientsTableName}`);

export class modifyPropBetsAddUniqueKey1679588903107 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const traderTables: Table[] = await Promise.all(
      traderTableNames.map((tableName) => queryRunner.getTable(tableName)),
    );
    const clientTables: Table[] = await Promise.all(
      clientTableNames.map((tableName) => queryRunner.getTable(tableName)),
    );

    const propBetKeyTrader: TableColumn = new TableColumn({
      name: "betId",
      type: "uuid",
      generationStrategy: "uuid",
      default: `uuid_generate_v4()`,
    });
    const propBetKeyClient: TableColumn = new TableColumn({
      name: "betId",
      type: "uuid",
      default: null,
      isNullable: true,
    });

    await Promise.all([
      ...traderTables.map((table) => queryRunner.addColumn(table, propBetKeyTrader)),
      ...clientTables.map((table) => queryRunner.addColumn(table, propBetKeyClient)),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const traderTables: Table[] = await Promise.all(
      traderTableNames.map((tableName) => queryRunner.getTable(tableName)),
    );
    const clientTables: Table[] = await Promise.all(
      clientTableNames.map((tableName) => queryRunner.getTable(tableName)),
    );

    await Promise.all([
      ...traderTables.map((table) => queryRunner.dropColumn(table, "betId")),
      ...clientTables.map((table) => queryRunner.dropColumn(table, "betId")),
    ]);
  }
}

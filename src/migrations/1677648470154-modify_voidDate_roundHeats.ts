import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const wslTableName = `${SportsDbSchema.WSL}.roundHeats`;
const slsTableName = `${SportsDbSchema.SLS}.roundHeats`;
const nrxTableName = `${SportsDbSchema.NRX}.roundHeats`;
const sprTableName = `${SportsDbSchema.SPR}.roundHeats`;

export class modifyVoidDateRoundHeats1677648470154 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const wslTable: Table = await queryRunner.getTable(wslTableName);
    const slsTable: Table = await queryRunner.getTable(slsTableName);
    const nrxTable: Table = await queryRunner.getTable(nrxTableName);
    const sprTable: Table = await queryRunner.getTable(sprTableName);

    await Promise.all([
      queryRunner.addColumn(
        wslTable,
        new TableColumn({
          name: "voidDate",
          type: "timestamptz",
          isNullable: true,
          default: null,
        }),
      ),
      queryRunner.addColumn(
        slsTable,
        new TableColumn({
          name: "voidDate",
          type: "timestamptz",
          isNullable: true,
          default: null,
        }),
      ),
      queryRunner.addColumn(
        nrxTable,
        new TableColumn({
          name: "voidDate",
          type: "timestamptz",
          isNullable: true,
          default: null,
        }),
      ),
      queryRunner.addColumn(
        sprTable,
        new TableColumn({
          name: "voidDate",
          type: "timestamptz",
          isNullable: true,
          default: null,
        }),
      ),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const wslTable: Table = await queryRunner.getTable(wslTableName);
    const slsTable: Table = await queryRunner.getTable(slsTableName);
    const nrxTable: Table = await queryRunner.getTable(nrxTableName);
    const sprTable: Table = await queryRunner.getTable(sprTableName);

    await Promise.all([
      queryRunner.dropColumn(wslTable, "voidDate"),
      queryRunner.dropColumn(slsTable, "voidDate"),
      queryRunner.dropColumn(nrxTable, "voidDate"),
      queryRunner.dropColumn(sprTable, "voidDate"),
    ]);
  }
}

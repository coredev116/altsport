import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const wslTableName = `${SportsDbSchema.WSL}.playerHeadToHeads`;
const slsTableName = `${SportsDbSchema.SLS}.playerHeadToHeads`;
const nrxTableName = `${SportsDbSchema.NRX}.playerHeadToHeads`;

export class modifyPlayerHeadToHeadsAddDraw1664948027363 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const wslTable: Table = await queryRunner.getTable(wslTableName);
    const slsTable: Table = await queryRunner.getTable(slsTableName);
    const nrxTable: Table = await queryRunner.getTable(nrxTableName);

    await Promise.all([
      queryRunner.addColumn(
        wslTable,
        new TableColumn({
          name: "draw",
          type: "boolean",
          default: false,
        }),
      ),
      queryRunner.addColumn(
        slsTable,
        new TableColumn({
          name: "draw",
          type: "boolean",
          default: false,
        }),
      ),
      queryRunner.addColumn(
        nrxTable,
        new TableColumn({
          name: "draw",
          type: "boolean",
          default: false,
        }),
      ),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const wslTable: Table = await queryRunner.getTable(wslTableName);
    const slsTable: Table = await queryRunner.getTable(slsTableName);
    const nrxTable: Table = await queryRunner.getTable(nrxTableName);

    await Promise.all([
      queryRunner.dropColumn(wslTable, "draw"),

      queryRunner.dropColumn(slsTable, "draw"),

      queryRunner.dropColumn(nrxTable, "draw"),
    ]);
  }
}

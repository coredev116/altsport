import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const slsTableName = `${SportsDbSchema.SLS}.propBets`;
const wslTableName = `${SportsDbSchema.WSL}.propBets`;

export class modifyPayoutPropBets1654839806340 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const slsTable: Table = await queryRunner.getTable(slsTableName);
    const wslTable: Table = await queryRunner.getTable(wslTableName);

    await Promise.all([
      queryRunner.addColumns(slsTable, [
        new TableColumn({
          name: "payout",
          type: "boolean",
          isNullable: true,
          default: false,
        }),
      ]),
      queryRunner.addColumns(wslTable, [
        new TableColumn({
          name: "payout",
          type: "boolean",
          isNullable: true,
          default: false,
        }),
      ]),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const slsTable: Table = await queryRunner.getTable(slsTableName);
    const wslTable: Table = await queryRunner.getTable(wslTableName);

    await Promise.all([
      queryRunner.dropColumns(slsTable, ["payout"]),
      queryRunner.dropColumns(wslTable, ["payout"]),
    ]);
  }
}

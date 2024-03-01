import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { SportsDbSchema } from "../constants/system";

const slsTableName = `${SportsDbSchema.SLS}.propBets`;
const wslTableName = `${SportsDbSchema.WSL}.propBets`;

export class modifyRenameOddToOdds1654194051099 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const slsTable: Table = await queryRunner.getTable(slsTableName);
    const wslTable: Table = await queryRunner.getTable(wslTableName);

    await Promise.all([
      queryRunner.renameColumn(slsTable, "odd", "odds"),
      queryRunner.renameColumn(wslTable, "odd", "odds"),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const slsTable: Table = await queryRunner.getTable(slsTableName);
    const wslTable: Table = await queryRunner.getTable(wslTableName);

    await Promise.all([
      queryRunner.renameColumn(slsTable, "odds", "odd"),
      queryRunner.renameColumn(wslTable, "odds", "odd"),
    ]);
  }
}

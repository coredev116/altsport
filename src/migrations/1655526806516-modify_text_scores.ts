import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const slsTableName = `${SportsDbSchema.SLS}.scores`;
const wslTableName = `${SportsDbSchema.WSL}.scores`;

export class modifyTextScores1655526806516 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const slsTable: Table = await queryRunner.getTable(slsTableName);
    const wslTable: Table = await queryRunner.getTable(wslTableName);

    await Promise.all([
      queryRunner.addColumns(slsTable, [
        new TableColumn({
          name: "notes",
          type: "text",
          isNullable: true,
        }),
      ]),
      queryRunner.addColumns(wslTable, [
        new TableColumn({
          name: "notes",
          type: "text",
          isNullable: true,
        }),
      ]),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const slsTable: Table = await queryRunner.getTable(slsTableName);
    const wslTable: Table = await queryRunner.getTable(wslTableName);

    await Promise.all([
      queryRunner.dropColumns(slsTable, ["notes"]),
      queryRunner.dropColumns(wslTable, ["notes"]),
    ]);
  }
}

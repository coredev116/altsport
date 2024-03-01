import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const slsTableName = `${SportsDbSchema.SLS}.athletes`;
const wslTableName = `${SportsDbSchema.WSL}.athletes`;

export class modifyMiddlenameAthletes1655728277564 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const slsTable: Table = await queryRunner.getTable(slsTableName);
    const wslTable: Table = await queryRunner.getTable(wslTableName);

    await Promise.all([
      queryRunner.addColumns(slsTable, [
        new TableColumn({
          name: "middleName",
          type: "text",
          isNullable: true,
        }),
      ]),
      queryRunner.addColumns(wslTable, [
        new TableColumn({
          name: "middleName",
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
      queryRunner.dropColumns(slsTable, ["middleName"]),
      queryRunner.dropColumns(wslTable, ["middleName"]),
    ]);
  }
}

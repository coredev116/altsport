import { MigrationInterface, QueryRunner, TableColumn, Table } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const slsTableName = `${SportsDbSchema.SLS}.playerHeadToHeads`;

export class modifyHoldingPercentagePlayerHeadToHeads1655287415908 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const slsTable: Table = await queryRunner.getTable(slsTableName);

    await Promise.all([
      queryRunner.addColumns(slsTable, [
        new TableColumn({
          name: "holdingPercentage",
          type: "decimal",
          isNullable: true,
        }),
      ]),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const slsTable: Table = await queryRunner.getTable(slsTableName);

    await Promise.all([queryRunner.dropColumns(slsTable, ["holdingPercentage"])]);
  }
}

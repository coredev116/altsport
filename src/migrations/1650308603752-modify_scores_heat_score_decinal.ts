import { MigrationInterface, QueryRunner, TableColumn, Table } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const tableName = `${SportsDbSchema.WSL}.scores`;

export class modifyScoresHeatScoreDecinal1650308603752 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(tableName);

    await queryRunner.dropColumn(table, "heatScore");

    await queryRunner.addColumn(
      table,
      new TableColumn({
        name: "heatScore",
        type: "decimal",
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(tableName);

    await queryRunner.dropColumn(table, "heatScore");

    await queryRunner.addColumn(
      table,
      new TableColumn({
        name: "heatScore",
        type: "int",
        isNullable: true,
      }),
    );
  }
}

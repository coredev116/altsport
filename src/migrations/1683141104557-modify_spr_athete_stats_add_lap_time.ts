import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const tableName = `${SportsDbSchema.SPR}.athleteStats`;

export class ModifySprAtheteStatsAddLapTime1683141104557 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(tableName);

    const bestLapTime: TableColumn = new TableColumn({
      name: "bestLapTime",
      type: "decimal",
      default: null,
      isNullable: true,
    });

    await queryRunner.addColumn(table, bestLapTime);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(tableName);

    await queryRunner.dropColumn(table, "bestLapTime");
  }
}

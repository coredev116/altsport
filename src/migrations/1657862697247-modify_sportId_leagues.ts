import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const slsTableName = `${SportsDbSchema.SLS}.leagues`;

export class modifySportIdLeagues1657862697247 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const slsTable: Table = await queryRunner.getTable(slsTableName);

    await queryRunner.dropColumn(slsTable, "sportId");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const slsTable: Table = await queryRunner.getTable(slsTableName);

    await queryRunner.addColumn(
      slsTable,
      new TableColumn({
        name: "sportId",
        type: "uuid",
        isNullable: true,
      }),
    );
  }
}

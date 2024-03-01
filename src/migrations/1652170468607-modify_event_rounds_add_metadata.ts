import { MigrationInterface, QueryRunner, TableColumn, Table } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const tableName = `${SportsDbSchema.SLS}.eventRounds`;

export class modifyEventRoundsAddMetadata1652170468607 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(tableName);

    await queryRunner.addColumns(table, [
      new TableColumn({
        name: "startDate",
        type: "timestamptz",
        isNullable: true,
      }),
      new TableColumn({
        name: "endDate",
        type: "timestamptz",
        isNullable: true,
      }),
      new TableColumn({
        name: "roundStatus",
        type: "int",
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(tableName);

    await queryRunner.dropColumns(table, ["startDate", "endDate", "roundStatus"]);
  }
}

import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const tableName = `${SportsDbSchema.NRX}.scores`;

export class modifyScoresAddStatus1660072363778 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(tableName);
    await Promise.all([
      queryRunner.addColumns(table, [
        new TableColumn({
          name: "status",
          type: "text",
          isNullable: true,
          default: null,
        }),
      ]),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(tableName);
    await queryRunner.dropColumns(table, ["isDnf"]);
  }
}

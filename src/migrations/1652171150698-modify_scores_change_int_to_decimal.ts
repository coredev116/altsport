import { MigrationInterface, QueryRunner, TableColumn, Table } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const tableName = `${SportsDbSchema.SLS}.scores`;

const columns = [
  "runScore",
  "roundScore",
  "trick1Score",
  "trick2Score",
  "trick3Score",
  "trick4Score",
  "trick5Score",
  "trick6Score",
];

export class modifyScoresChangeIntToDecimal1652171150698 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(tableName);

    await Promise.all(
      columns.map((column) =>
        queryRunner.changeColumn(
          table,
          column,
          new TableColumn({
            name: column,
            type: "decimal",
            default: 0,
            isNullable: true,
          }),
        ),
      ),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(tableName);

    await Promise.all(
      columns.map((column) =>
        queryRunner.changeColumn(
          table,
          column,
          new TableColumn({
            name: column,
            type: "int",
            default: 0,
          }),
        ),
      ),
    );
  }
}

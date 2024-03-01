import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const tableName = `${SportsDbSchema.SLS}.scores`;

const columns = [
  "trick1Score",
  "trick2Score",
  "trick3Score",
  "trick4Score",
  "trick5Score",
  "trick6Score",
];

export class modifySlsScoresAddTrickScores1652388579061 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(tableName);

    await queryRunner.addColumns(
      table,
      columns.map(
        (column) =>
          new TableColumn({
            name: column,
            type: "decimal",
            default: 0,
            isNullable: true,
          }),
      ),
    );

    await queryRunner.dropColumn(table, "trickScore");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(tableName);
    await queryRunner.dropColumns(table, columns);

    await queryRunner.addColumn(
      table,
      new TableColumn({
        name: "trickScore",
        type: "decimal",
        default: 0,
        isNullable: true,
      }),
    );
  }
}

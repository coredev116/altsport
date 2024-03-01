import { MigrationInterface, QueryRunner, TableColumn, Table } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const tableName = `${SportsDbSchema.SLS}.scores`;

export class modifySlsScoresAddLineScores1678946231499 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(tableName);

    await Promise.all([
      queryRunner.addColumns(table, [
        new TableColumn({
          name: "lineScore1",
          type: "decimal",
          default: 0,
          isNullable: true,
        }),
        new TableColumn({
          name: "lineScore2",
          type: "decimal",
          default: 0,
          isNullable: true,
        }),
      ]),
    ]);

    await queryRunner.manager.transaction(async (manager) => {
      await manager.query(`UPDATE ${tableName} set "lineScore1" = "runScore" `);
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(tableName);

    await Promise.all([queryRunner.dropColumns(table, ["lineScore1", "lineScore2"])]);
  }
}

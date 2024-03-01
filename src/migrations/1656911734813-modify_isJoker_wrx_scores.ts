import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const tableName = `${SportsDbSchema.NRX}.scores`;

export class modifyIsJokerWrxScores1656911734813 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(tableName);
    await Promise.all([
      queryRunner.addColumns(table, [
        new TableColumn({
          name: "lapNumber",
          type: "int",
          isNullable: true,
        }),
        new TableColumn({
          name: "isJoker",
          type: "boolean",
          default: false,
        }),
        new TableColumn({
          name: "isBye",
          type: "boolean",
          default: false,
        }),
      ]),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(tableName);
    await queryRunner.dropColumns(table, ["lapNumber", "isJoker", "isBye"]);
  }
}

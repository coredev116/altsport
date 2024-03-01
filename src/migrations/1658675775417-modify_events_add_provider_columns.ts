import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const tableName = `${SportsDbSchema.NRX}.events`;

export class modifyEventsAddProviderColumns1658675775417 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(tableName);
    await Promise.all([
      queryRunner.addColumns(table, [
        new TableColumn({
          name: "providerRunId",
          type: "text",
          isNullable: true,
          default: null,
        }),
        new TableColumn({
          name: "categoryName",
          type: "text",
          isNullable: true,
          default: null,
        }),
      ]),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(tableName);
    await queryRunner.dropColumns(table, ["providerRunId", "categoryName"]);
  }
}

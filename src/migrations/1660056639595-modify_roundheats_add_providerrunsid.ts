import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const tableName = `${SportsDbSchema.NRX}.roundHeats`;

export class modifyRoundheatsAddProviderrunsid1660056639595 implements MigrationInterface {
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
      ]),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(tableName);
    await queryRunner.dropColumns(table, ["providerRunId"]);
  }
}

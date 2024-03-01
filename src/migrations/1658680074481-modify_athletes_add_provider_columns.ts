import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const tableName = `${SportsDbSchema.NRX}.athletes`;

export class modifyAthletesAddProviderColumns1658680074481 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(tableName);
    await Promise.all([
      queryRunner.addColumns(table, [
        new TableColumn({
          name: "providerEntryId",
          type: "text",
          isNullable: true,
          default: null,
        }),
        new TableColumn({
          name: "startNumber",
          type: "text",
          isNullable: true,
          default: null,
        }),
      ]),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(tableName);
    await queryRunner.dropColumns(table, ["providerEntryId", "startNumber"]);
  }
}

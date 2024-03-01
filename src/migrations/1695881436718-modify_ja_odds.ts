import { MigrationInterface, QueryRunner, TableColumn, Table } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const tableName = `${SportsDbSchema.JA}.odds`;

export class ModifyJaOdds1695881436718 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(tableName);

    await Promise.all([
      queryRunner.addColumns(table, [
        new TableColumn({
          name: "betType",
          type: "int",
          isNullable: true,
        }),
        new TableColumn({
          name: "isMarketActive",
          type: "boolean",
          default: true,
        }),
        new TableColumn({
          name: "isSubMarketLocked",
          type: "boolean",
          default: false,
        }),
        new TableColumn({
          name: "prop",
          type: "text",
          isNullable: true,
        }),
      ]),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(tableName);
    await Promise.all([
      queryRunner.dropColumns(table, ["betType", "isMarketActive", "isSubMarketLocked", "prop"]),
    ]);
  }
}

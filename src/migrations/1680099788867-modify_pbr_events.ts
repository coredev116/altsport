import { MigrationInterface, QueryRunner, TableColumn, Table } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const tableName = `${SportsDbSchema.PBR}.events`;

export class modifyPbrEvents1680000071056 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(tableName);

    await queryRunner.changeColumn(
      table,
      "eventNumber",
      new TableColumn({
        name: "eventNumber",
        type: "text",
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(tableName);

    await queryRunner.changeColumn(
      table,
      "eventNumber",
      new TableColumn({
        name: "eventNumber",
        type: "int",
        isNullable: true,
      }),
    );
  }
}

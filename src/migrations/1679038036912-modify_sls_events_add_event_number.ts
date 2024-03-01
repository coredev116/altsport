import { MigrationInterface, QueryRunner, TableColumn, Table } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const tableName = `${SportsDbSchema.SLS}.events`;

export class modifySlsEventsAddEventNumber1679038036912 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(tableName);

    await Promise.all([
      queryRunner.addColumns(table, [
        new TableColumn({
          name: "eventNumber",
          type: "int",
          default: 0,
          isNullable: true,
        }),
      ]),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(tableName);

    await Promise.all([queryRunner.dropColumns(table, ["eventNumber"])]);
  }
}

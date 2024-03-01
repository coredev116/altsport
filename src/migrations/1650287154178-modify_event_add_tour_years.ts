import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey, Table } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const tableName = `${SportsDbSchema.WSL}.events`;

export class modifyEventAddTourYears1650287154178 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(tableName);

    const tourIdForeignKey: TableForeignKey = table.foreignKeys.find(
      (foreignKey) =>
        foreignKey.columnNames.includes("tourId") && foreignKey.columnNames.length === 1,
    );

    await queryRunner.dropForeignKey(table, tourIdForeignKey);
    await queryRunner.dropColumn(table, "tourId");

    await queryRunner.addColumn(
      table,
      new TableColumn({
        name: "tourYearId",
        type: "uuid",
      }),
    );
    await queryRunner.createForeignKey(
      table,
      new TableForeignKey({
        columnNames: ["tourYearId"],
        referencedColumnNames: ["id"],
        referencedTableName: "tourYears",
        referencedSchema: SportsDbSchema.WSL,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(tableName);

    const tourYearIdForeignKey: TableForeignKey = table.foreignKeys.find(
      (foreignKey) =>
        foreignKey.columnNames.includes("tourYearId") && foreignKey.columnNames.length === 1,
    );

    await queryRunner.dropForeignKey(table, tourYearIdForeignKey);
    await queryRunner.dropColumn(table, "tourYearId");

    await queryRunner.addColumn(
      table,
      new TableColumn({
        name: "tourId",
        type: "uuid",
      }),
    );
    await queryRunner.createForeignKey(
      table,
      new TableForeignKey({
        columnNames: ["tourId"],
        referencedColumnNames: ["id"],
        referencedTableName: "tours",
        referencedSchema: SportsDbSchema.WSL,
      }),
    );
  }
}

import { MigrationInterface, QueryRunner, Table, TableColumn, TableColumnOptions } from "typeorm";

const columnName: string = "futureType";
const marketTypeColumnName: string = "marketType";
const tableName: string = "clientMarketDownloadLogs";

const columnAttrs: TableColumnOptions = {
  name: columnName,
  type: "text",
  isNullable: true,
  default: null,
};

export class ModifyClientMarketDownloadAddFuture1692683701964 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(tableName);
    await Promise.all([
      queryRunner.addColumn(table, new TableColumn(columnAttrs)),
      queryRunner.query(
        `ALTER TABLE "${tableName}" ALTER COLUMN "${marketTypeColumnName}" DROP NOT NULL`,
      ),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(tableName);
    // Skipping the unsetting of the not null
    await Promise.all([queryRunner.dropColumn(table, columnName)]);
  }
}

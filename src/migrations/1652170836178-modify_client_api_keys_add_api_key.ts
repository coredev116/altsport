import { MigrationInterface, QueryRunner, TableColumn, Table } from "typeorm";

const tableName = "clientApiKeys";

export class modifyClientApiKeysAddApiKey1652170836178 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(tableName);

    await queryRunner.addColumns(table, [
      new TableColumn({
        name: "apiKey",
        type: "text",
        isNullable: false,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(tableName);

    await queryRunner.dropColumns(table, ["apiKey"]);
  }
}

import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

const tableName = `clients`;

export class modifyClient1660635111344 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(tableName);

    await Promise.all([
      queryRunner.addColumns(table, [
        new TableColumn({
          name: "phone",
          type: "text",
          isNullable: true,
        }),
        new TableColumn({
          name: "companyName",
          type: "text",
          isNullable: true,
        }),
      ]),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(tableName);

    await queryRunner.dropColumns(table, ["phone", "companyName"]);
  }
}

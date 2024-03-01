import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

const tableName = "users";

export class modifyUsersAddPhone1678733876244 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(tableName);

    await Promise.all([
      queryRunner.addColumn(
        table,
        new TableColumn({
          name: "phone",
          type: "text",
          isNullable: true,
          default: null,
        }),
      ),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(tableName);

    await Promise.all([queryRunner.dropColumn(table, "phone")]);
  }
}

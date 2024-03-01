import { MigrationInterface, QueryRunner, TableColumn, Table } from "typeorm";

const tableName = "clientApiKeys";

export class modifyExpiryToClientApiKeys1652873471019 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(tableName);

    await queryRunner.addColumns(table, [
      new TableColumn({
        name: "expiryDate",
        type: "timestamptz",
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(tableName);

    await queryRunner.dropColumns(table, ["expiryDate"]);
  }
}

import { MigrationInterface, QueryRunner, Table } from "typeorm";

const tableName = "clientApiKeys";

export class modifyClientApiKeysRename1652170610352 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(tableName);

    await queryRunner.renameColumn(table, "currentRequesCount", "currentRequestCount");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(tableName);

    await queryRunner.renameColumn(table, "currentRequestCount", "currentRequesCount");
  }
}

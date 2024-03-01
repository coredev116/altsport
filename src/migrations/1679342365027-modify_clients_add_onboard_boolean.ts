import { MigrationInterface, QueryRunner, TableColumn, Table } from "typeorm";

const clientsTableName = `clients`;

export class modifyClientsAddOnboardBoolean1679342365027 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const clientsTable: Table = await queryRunner.getTable(clientsTableName);

    const hasOnboardedColumn: TableColumn = new TableColumn({
      name: "hasOnboarded",
      type: "boolean",
      default: false,
    });

    await queryRunner.addColumn(clientsTable, hasOnboardedColumn);

    await queryRunner.manager.transaction(async (manager) => {
      await manager.query(`UPDATE ${clientsTableName} set "hasOnboarded" = true`);
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const clientsTable: Table = await queryRunner.getTable(clientsTableName);

    await queryRunner.dropColumn(clientsTable, "hasOnboarded");
  }
}

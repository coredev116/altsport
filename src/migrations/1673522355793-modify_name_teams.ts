import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";
import { SportsDbSchema } from "../constants/system";

const tableName = `${SportsDbSchema.MASL}.teams`;

export class modifyNameTeams1673522355793 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(tableName);

    await queryRunner.changeColumn(
      table,
      "name",
      new TableColumn({
        name: "name",
        type: "text",
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(tableName);

    await queryRunner.changeColumn(
      table,
      "name",
      new TableColumn({
        name: "name",
        type: "text",
      }),
    );
  }
}

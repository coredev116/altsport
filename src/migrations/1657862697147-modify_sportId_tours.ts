import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const wslTableName = `${SportsDbSchema.WSL}.tours`;

export class modifySportIdTours1657862697147 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const wslTable: Table = await queryRunner.getTable(wslTableName);

    await queryRunner.dropColumn(wslTable, "sportId");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const wslTable: Table = await queryRunner.getTable(wslTableName);

    await queryRunner.addColumn(
      wslTable,
      new TableColumn({
        name: "sportId",
        type: "uuid",
        isNullable: true,
      }),
    );
  }
}

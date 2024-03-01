import { MigrationInterface, QueryRunner, TableColumn, Table } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const tableName = `${SportsDbSchema.JA}.odds`;

export class ModifyJaOdds1695723177123 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(tableName);

    await Promise.all([
      queryRunner.addColumn(
        table,
        new TableColumn({
          name: "calculatedValue",
          type: "decimal",
          isNullable: true,
        }),
      ),
      queryRunner.query(`ALTER TABLE ${tableName} ALTER COLUMN "eventRoundId" DROP NOT NULL`),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(tableName);
    await Promise.all([
      queryRunner.dropColumn(table, "calculatedValue"),
      queryRunner.query(`ALTER TABLE ${tableName} ALTER COLUMN "eventRoundId" SET NOT NULL`),
    ]);
  }
}

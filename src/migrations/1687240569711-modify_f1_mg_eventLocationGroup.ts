import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const f1TableName = `${SportsDbSchema.F1}.events`;
const mgTableName = `${SportsDbSchema.MotoGP}.events`;

export class modifyF1MgEventLocationGroup1687240569711 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const f1Table: Table = await queryRunner.getTable(f1TableName);
    const mgTable: Table = await queryRunner.getTable(mgTableName);

    await Promise.all([
      queryRunner.addColumn(
        f1Table,
        new TableColumn({
          name: "eventLocationGroup",
          type: "text",
          isNullable: true,
        }),
      ),
      queryRunner.addColumn(
        mgTable,
        new TableColumn({
          name: "eventLocationGroup",
          type: "text",
          isNullable: true,
        }),
      ),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const f1Table: Table = await queryRunner.getTable(f1TableName);
    const mgTable: Table = await queryRunner.getTable(mgTableName);

    await Promise.all([
      queryRunner.dropColumn(f1Table, "eventLocationGroup"),
      queryRunner.dropColumn(mgTable, "eventLocationGroup"),
    ]);
  }
}

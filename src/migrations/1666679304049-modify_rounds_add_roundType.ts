import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const nrxTableName = `${SportsDbSchema.NRX}.rounds`;

export class modifyRoundsAddRoundType1666679304049 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const nrxTable: Table = await queryRunner.getTable(nrxTableName);

    await queryRunner.addColumn(
      nrxTable,
      new TableColumn({
        name: "roundType",
        type: "text",
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const nrxTable: Table = await queryRunner.getTable(nrxTableName);

    await queryRunner.dropColumn(nrxTable, "roundType");
  }
}

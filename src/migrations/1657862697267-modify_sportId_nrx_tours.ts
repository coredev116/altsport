import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const nrxTableName = `${SportsDbSchema.NRX}.tours`;

export class modifySportIdNrxTours1657862697267 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const nrxTable: Table = await queryRunner.getTable(nrxTableName);

    await queryRunner.dropColumn(nrxTable, "sportId");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const nrxTable: Table = await queryRunner.getTable(nrxTableName);

    await queryRunner.addColumn(
      nrxTable,
      new TableColumn({
        name: "sportId",
        type: "uuid",
        isNullable: true,
      }),
    );
  }
}

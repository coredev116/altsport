import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const nrxTableName = `${SportsDbSchema.NRX}.eventParticipants`;

export class modifyEventParticipantsAddBaseHeadLapTime1664532514556 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const nrxTable: Table = await queryRunner.getTable(nrxTableName);

    await queryRunner.addColumn(
      nrxTable,
      new TableColumn({
        name: "baseHeadLapTime",
        type: "decimal",
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const nrxTable: Table = await queryRunner.getTable(nrxTableName);

    await queryRunner.dropColumn(nrxTable, "baseHeadLapTime");
  }
}

import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const nrxTableName = `${SportsDbSchema.NRX}.eventParticipants`;

export class modifyEventParticipantsAddSoloCrashRate1665994711661 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const nrxTable: Table = await queryRunner.getTable(nrxTableName);

    await queryRunner.addColumn(
      nrxTable,
      new TableColumn({
        name: "soloCrashRate",
        type: "decimal",
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const nrxTable: Table = await queryRunner.getTable(nrxTableName);

    await queryRunner.dropColumn(nrxTable, "soloCrashRate");
  }
}

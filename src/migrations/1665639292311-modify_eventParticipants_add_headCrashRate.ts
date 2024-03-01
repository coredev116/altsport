import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const nrxTableName = `${SportsDbSchema.NRX}.eventParticipants`;

export class modifyEventParticipantsAddHeadCrashRate1665639292311 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const nrxTable: Table = await queryRunner.getTable(nrxTableName);

    await Promise.all([
      queryRunner.addColumn(
        nrxTable,
        new TableColumn({
          name: "headCrashRate",
          type: "decimal",
          isNullable: true,
        }),
      ),
      queryRunner.addColumn(
        nrxTable,
        new TableColumn({
          name: "raceCrashRate",
          type: "decimal",
          isNullable: true,
        }),
      ),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const nrxTable: Table = await queryRunner.getTable(nrxTableName);

    await Promise.all([
      queryRunner.dropColumn(nrxTable, "headCrashRate"),
      queryRunner.dropColumn(nrxTable, "raceCrashRate"),
    ]);
  }
}

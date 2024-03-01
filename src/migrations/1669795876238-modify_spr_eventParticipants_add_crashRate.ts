import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const sprTableName = `${SportsDbSchema.SPR}.eventParticipants`;

export class modifySprEventParticipantsAddCrashRate1669725876238 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const sprTable: Table = await queryRunner.getTable(sprTableName);

    await Promise.all([
      queryRunner.addColumn(
        sprTable,
        new TableColumn({
          name: "soloCrashRate",
          type: "decimal",
          isNullable: true,
        }),
      ),
      queryRunner.addColumn(
        sprTable,
        new TableColumn({
          name: "headCrashRate",
          type: "decimal",
          isNullable: true,
        }),
      ),
      queryRunner.addColumn(
        sprTable,
        new TableColumn({
          name: "raceCrashRate",
          type: "decimal",
          isNullable: true,
        }),
      ),
      queryRunner.addColumn(
        sprTable,
        new TableColumn({
          name: "baseHeadLapTime",
          type: "decimal",
          isNullable: true,
        }),
      ),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const sprTable: Table = await queryRunner.getTable(sprTableName);

    await Promise.all([
      queryRunner.dropColumn(sprTable, "soloCrashRate"),
      queryRunner.dropColumn(sprTable, "headCrashRate"),
      queryRunner.dropColumn(sprTable, "raceCrashRate"),
      queryRunner.dropColumn(sprTable, "baseHeadLapTime"),
    ]);
  }
}

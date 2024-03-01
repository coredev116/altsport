import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const eventRoundsTableName = `${SportsDbSchema.SLS}.eventRounds`;

const COLUMN_NAME_PROVIDER_ID = "providerId";

export class ModifySlsEventRoundsDropUniqueContestId1682507410298 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(eventRoundsTableName);

    const tableIndex: TableIndex = table.indices.find(
      (row) =>
        row.columnNames.includes(COLUMN_NAME_PROVIDER_ID) &&
        row.columnNames.length === 1 &&
        row.isUnique,
    );

    await queryRunner.dropIndex(table, tableIndex);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(eventRoundsTableName);

    await queryRunner.createIndex(
      table,
      new TableIndex({
        columnNames: [COLUMN_NAME_PROVIDER_ID],
        isUnique: true,
      }),
    );
  }
}

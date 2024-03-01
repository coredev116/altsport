import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const eventsTableName = `${SportsDbSchema.SLS}.events`;

const COLUMN_NAME_PROVIDER_CONTEST_ID = "providerContestId";

export class ModifySlsEventsDropUniqueContestId1682506595825 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const eventsTable: Table = await queryRunner.getTable(eventsTableName);

    const tableIndex: TableIndex = eventsTable.indices.find(
      (row) =>
        row.columnNames.includes(COLUMN_NAME_PROVIDER_CONTEST_ID) &&
        row.columnNames.length === 1 &&
        row.isUnique,
    );

    await queryRunner.dropIndex(eventsTable, tableIndex);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const eventsTable: Table = await queryRunner.getTable(eventsTableName);

    await queryRunner.createIndex(
      eventsTable,
      new TableIndex({
        columnNames: [COLUMN_NAME_PROVIDER_CONTEST_ID],
        isUnique: true,
      }),
    );
  }
}

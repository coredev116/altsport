import { MigrationInterface, QueryRunner, Table, TableColumn, TableIndex } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const athletesTableName = `${SportsDbSchema.SLS}.athletes`;
const eventRoundsTableName = `${SportsDbSchema.SLS}.eventRounds`;
const eventsTableName = `${SportsDbSchema.SLS}.events`;
const heatsTableName = `${SportsDbSchema.SLS}.roundHeats`;

const COLUMN_NAME_PROVIDER_ID = "providerId";
const COLUMN_NAME_PROVIDER_CONTEST_ID = "providerContestId";
const COLUMN_NAME_PROVIDER_LAST_UPDATE = "providerLastUpdatedDate";

export class modifySlsAddProviderIds1681390719027 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const athletesTable: Table = await queryRunner.getTable(athletesTableName);
    const eventRoundsTable: Table = await queryRunner.getTable(eventRoundsTableName);
    const eventsTable: Table = await queryRunner.getTable(eventsTableName);
    const heatsTable: Table = await queryRunner.getTable(heatsTableName);
    const providerIdTables: Table[] = [athletesTable, eventRoundsTable, eventsTable];
    const contestIdTables: Table[] = [eventsTable];
    const lastUpdatedTables: Table[] = [eventRoundsTable, heatsTable];

    await Promise.all([
      providerIdTables.map((table) =>
        queryRunner.addColumn(
          table,
          new TableColumn({
            name: COLUMN_NAME_PROVIDER_ID,
            type: "text",
            default: null,
            isNullable: true,
          }),
        ),
      ),
      contestIdTables.map((table) =>
        queryRunner.addColumn(
          table,
          new TableColumn({
            name: COLUMN_NAME_PROVIDER_CONTEST_ID,
            type: "text",
            default: null,
            isNullable: true,
          }),
        ),
      ),
      lastUpdatedTables.map((table) =>
        queryRunner.addColumn(
          table,
          new TableColumn({
            name: COLUMN_NAME_PROVIDER_LAST_UPDATE,
            type: "timestamptz",
            default: null,
            isNullable: true,
          }),
        ),
      ),
    ]);
    await Promise.all([
      // intentionally skipped event from unique index because in case of SLS the content id is unique
      [athletesTable, eventRoundsTable].map((table) =>
        queryRunner.createIndex(
          table,
          new TableIndex({
            columnNames: [COLUMN_NAME_PROVIDER_ID],
            isUnique: true,
          }),
        ),
      ),
      contestIdTables.map((table) =>
        queryRunner.createIndex(
          table,
          new TableIndex({
            columnNames: [COLUMN_NAME_PROVIDER_CONTEST_ID],
            isUnique: true,
          }),
        ),
      ),
      lastUpdatedTables.map((table) =>
        queryRunner.createIndex(
          table,
          new TableIndex({
            columnNames: [COLUMN_NAME_PROVIDER_LAST_UPDATE],
            isUnique: true,
          }),
        ),
      ),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const athletesTable: Table = await queryRunner.getTable(athletesTableName);
    const eventRoundsTable: Table = await queryRunner.getTable(eventRoundsTableName);
    const eventsTable: Table = await queryRunner.getTable(eventsTableName);
    const heatsTable: Table = await queryRunner.getTable(heatsTableName);
    const providerIdTables: Table[] = [athletesTable, eventRoundsTable, eventsTable];
    const contestIdTables: Table[] = [eventsTable];
    const lastUpdatedTables: Table[] = [eventRoundsTable, heatsTable];

    await Promise.all([
      providerIdTables.map((table) => queryRunner.dropColumn(table, COLUMN_NAME_PROVIDER_ID)),
      contestIdTables.map((table) =>
        queryRunner.dropColumn(table, COLUMN_NAME_PROVIDER_CONTEST_ID),
      ),
      lastUpdatedTables.map((table) =>
        queryRunner.dropColumn(table, COLUMN_NAME_PROVIDER_LAST_UPDATE),
      ),
    ]);
  }
}

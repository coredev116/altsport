import { MigrationInterface, QueryRunner, Table, TableColumn, TableIndex } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const athletesTableName = `${SportsDbSchema.WSL}.athletes`;
const eventRoundsTableName = `${SportsDbSchema.WSL}.eventRounds`;
const eventsTableName = `${SportsDbSchema.WSL}.events`;
const heatsTableName = `${SportsDbSchema.WSL}.roundHeats`;
const toursTableName = `${SportsDbSchema.WSL}.tours`;

const COLUMN_NAME_PROVIDER_ID = "providerId";

export class modifyWslAddProviderIdsForApi1679903633729 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const athletesTable: Table = await queryRunner.getTable(athletesTableName);
    const eventRoundsTable: Table = await queryRunner.getTable(eventRoundsTableName);
    const eventsTable: Table = await queryRunner.getTable(eventsTableName);
    const heatsTable: Table = await queryRunner.getTable(heatsTableName);
    const toursTable: Table = await queryRunner.getTable(toursTableName);
    const tables: Table[] = [athletesTable, eventRoundsTable, eventsTable, heatsTable, toursTable];

    await Promise.all(
      tables.map((table) =>
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
    );
    await Promise.all(
      tables.map((table) =>
        queryRunner.createIndex(
          table,
          new TableIndex({
            columnNames: [COLUMN_NAME_PROVIDER_ID],
          }),
        ),
      ),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const athletesTable: Table = await queryRunner.getTable(athletesTableName);
    const eventRoundsTable: Table = await queryRunner.getTable(eventRoundsTableName);
    const eventsTable: Table = await queryRunner.getTable(eventsTableName);
    const heatsTable: Table = await queryRunner.getTable(heatsTableName);
    const toursTable: Table = await queryRunner.getTable(toursTableName);
    const tables: Table[] = [athletesTable, eventRoundsTable, eventsTable, heatsTable, toursTable];

    await Promise.all(
      tables.map((table) => queryRunner.dropColumn(table, COLUMN_NAME_PROVIDER_ID)),
    );
  }
}

import { MigrationInterface, QueryRunner, Table, TableColumn, TableIndex } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const eventsTableName = `events`;
const eventRoundsTableName = `eventRounds`;
const heatsTableName = `roundHeats`;
const athletesTableName = `athletes`;

const COLUMN_NAME_PROVIDER_ID = "providerId";

export class modifyWslRoundHeatsAddUniqueProvider1681031671580 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tables: {
      table: Table;
      tableName: string;
    }[] = await Promise.all(
      [eventsTableName, eventRoundsTableName, heatsTableName, athletesTableName].map(
        async (tableName) => {
          return {
            table: await queryRunner.getTable(`${SportsDbSchema.WSL}.${tableName}`),
            tableName,
          };
        },
      ),
    );

    // drop existing indices for provider column
    await Promise.all(
      tables.map(async ({ table }) => {
        const column: TableColumn = table.findColumnByName(COLUMN_NAME_PROVIDER_ID);

        const indices: TableIndex[] = table.findColumnIndices(column);
        const providerIndex = indices.find(
          (row) =>
            row.columnNames.length === 1 && row.columnNames.includes(COLUMN_NAME_PROVIDER_ID),
        );

        await queryRunner.dropIndex(table, providerIndex);
      }),
    );

    await Promise.all(
      tables.map(({ table }) =>
        queryRunner.createIndex(
          table,
          new TableIndex({
            columnNames: [COLUMN_NAME_PROVIDER_ID],
            isUnique: true,
          }),
        ),
      ),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tables: {
      table: Table;
      tableName: string;
    }[] = await Promise.all(
      [eventsTableName, eventRoundsTableName, heatsTableName, athletesTableName].map(
        async (tableName) => {
          return {
            table: await queryRunner.getTable(`${SportsDbSchema.WSL}.${tableName}`),
            tableName,
          };
        },
      ),
    );

    // drop existing indices for provider column
    await Promise.all(
      tables.map(async ({ table }) => {
        const column: TableColumn = table.findColumnByName(COLUMN_NAME_PROVIDER_ID);

        const indices: TableIndex[] = table.findColumnIndices(column);
        const providerIndex = indices.find(
          (row) =>
            row.columnNames.length === 1 && row.columnNames.includes(COLUMN_NAME_PROVIDER_ID),
        );

        await queryRunner.dropIndex(table, providerIndex);
      }),
    );

    await Promise.all(
      tables.map(({ table }) =>
        queryRunner.createIndex(
          table,
          new TableIndex({
            columnNames: [COLUMN_NAME_PROVIDER_ID],
          }),
        ),
      ),
    );
  }
}

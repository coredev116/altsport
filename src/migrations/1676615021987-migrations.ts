import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const eventsTableName = `${SportsDbSchema.MASL}.events`;
const leaguesTableName = `${SportsDbSchema.MASL}.leagues`;
const leagueYearsTableName = `${SportsDbSchema.MASL}.leagueYears`;

export class migrations1676615021987 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const eventsTable: Table = await queryRunner.getTable(eventsTableName);
    const leaguesTable: Table = await queryRunner.getTable(leaguesTableName);
    const leagueYearsTable: Table = await queryRunner.getTable(leagueYearsTableName);

    const column: TableColumn = new TableColumn({
      name: "providerLastUpdated",
      type: "text",
      isNullable: true,
      default: null,
    });

    await Promise.all([
      queryRunner.addColumn(eventsTable, column),
      queryRunner.addColumn(leaguesTable, column),
      queryRunner.addColumn(leagueYearsTable, column),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const eventsTable: Table = await queryRunner.getTable(eventsTableName);
    const leaguesTable: Table = await queryRunner.getTable(leaguesTableName);
    const leagueYearsTable: Table = await queryRunner.getTable(leagueYearsTableName);

    await Promise.all([
      queryRunner.dropColumn(eventsTable, "providerLastUpdated"),
      queryRunner.dropColumn(leaguesTable, "providerLastUpdated"),
      queryRunner.dropColumn(leagueYearsTable, "providerLastUpdated"),
    ]);
  }
}

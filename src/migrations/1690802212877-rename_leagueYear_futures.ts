import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const tableName: string = "futures";

const sports = [SportsDbSchema.SLS, SportsDbSchema.MASL];
const sportTables = sports.map((sport) => `${sport}.${tableName}`);

export class RenameLeagueYearFutures1690802212877 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tables: Table[] = await Promise.all(
      sportTables.map((sportTable) => queryRunner.getTable(sportTable)),
    );

    await Promise.all(
      tables.map((table) => queryRunner.renameColumn(table, "leagueYearId", "tourYearId")),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tables: Table[] = await Promise.all(
      sportTables.map((sportTable) => queryRunner.getTable(sportTable)),
    );

    await Promise.all(
      tables.map((table) => queryRunner.renameColumn(table, "tourYearId", "leagueYearId")),
    );
  }
}

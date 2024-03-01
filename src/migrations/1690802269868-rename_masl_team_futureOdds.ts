import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const tableName: string = "futureOdds";

const sports = [SportsDbSchema.MASL];
const sportTables = sports.map((sport) => `${sport}.${tableName}`);

export class RenameMASLTeamFutureOdds1690802269868 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tables: Table[] = await Promise.all(
      sportTables.map((sportTable) => queryRunner.getTable(sportTable)),
    );

    await Promise.all(
      tables.map((table) => queryRunner.renameColumn(table, "teamId", "athleteId")),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tables: Table[] = await Promise.all(
      sportTables.map((sportTable) => queryRunner.getTable(sportTable)),
    );

    await Promise.all(
      tables.map((table) => queryRunner.renameColumn(table, "athleteId", "teamId")),
    );
  }
}

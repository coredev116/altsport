import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const maslScoresTableName = `${SportsDbSchema.MASL}.scores`;

export class addTableIndexes1677693386780 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const maslScoresTable: Table = await queryRunner.getTable(maslScoresTableName);

    await Promise.all([
      queryRunner.createIndices(maslScoresTable, [
        new TableIndex({
          columnNames: ["isHomeTeam", "teamId"],
          name: `${maslScoresTableName}_isHomeTeam_teamId`,
        }),
      ]),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const maslScoresTable: Table = await queryRunner.getTable(maslScoresTableName);

    await Promise.all([
      queryRunner.dropIndex(maslScoresTable, `${maslScoresTableName}_isHomeTeam_teamId`),
    ]);
  }
}

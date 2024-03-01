import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const slsTableName = `${SportsDbSchema.SLS}.playerHeadToHeads`;

export class modifyHasModifiedProbabilityPlayerHeadToHeads1654756924768
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const slsTable: Table = await queryRunner.getTable(slsTableName);
    await Promise.all([
      queryRunner.addColumns(slsTable, [
        new TableColumn({
          name: "player1HasModifiedProbability",
          type: "boolean",
          isNullable: true,
          default: false,
        }),
        new TableColumn({
          name: "player2HasModifiedProbability",
          type: "boolean",
          isNullable: true,
          default: false,
        }),
      ]),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const slsTable: Table = await queryRunner.getTable(slsTableName);
    await queryRunner.dropColumns(slsTable, [
      "player1HasModifiedProbability",
      "player2HasModifiedProbability",
    ]);
  }
}

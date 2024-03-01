import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const scoresTableName = `${SportsDbSchema.MASL}.scores`;

export class modifyMaslScoresAddHomeTeam1677592250269 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(scoresTableName);

    await Promise.all([
      queryRunner.addColumn(
        table,
        new TableColumn({
          name: "isHomeTeam",
          type: "boolean",
          default: false,
        }),
      ),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(scoresTableName);

    await Promise.all([queryRunner.dropColumn(table, "isHomeTeam")]);
  }
}

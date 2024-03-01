import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const sprTableName = `${SportsDbSchema.SPR}.scores`;

export class modifySprScoresDropTimeColumns1670958361077 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const sprTable: Table = await queryRunner.getTable(sprTableName);

    await Promise.all([
      queryRunner.dropColumn(sprTable, "jokerLapTime"),
      queryRunner.dropColumn(sprTable, "penaltyTime"),
      queryRunner.dropColumn(sprTable, "totalLapTime"),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const sprTable: Table = await queryRunner.getTable(sprTableName);

    await Promise.all([
      queryRunner.addColumn(
        sprTable,
        new TableColumn({
          name: "jokerLapTime",
          type: "decimal",
          isNullable: true,
        }),
      ),
      queryRunner.addColumn(
        sprTable,
        new TableColumn({
          name: "penaltyTime",
          type: "decimal",
          isNullable: true,
        }),
      ),
      queryRunner.addColumn(
        sprTable,
        new TableColumn({
          name: "totalLapTime",
          type: "decimal",
          isNullable: true,
        }),
      ),
    ]);
  }
}

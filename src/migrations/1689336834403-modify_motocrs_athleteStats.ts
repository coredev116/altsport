import { MigrationInterface, QueryRunner, TableColumn, Table } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const tableName = `${SportsDbSchema.MOTOCRS}.athleteStats`;

export class ModifyMotocrsAthleteStats1689336834403 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(tableName);

    await queryRunner.addColumns(table, [
      new TableColumn({
        name: "raceName",
        type: "text",
        isNullable: false,
      }),
      new TableColumn({
        name: "raceClass",
        type: "text",
        isNullable: false,
      }),
      new TableColumn({
        name: "raceSeason",
        type: "int",
        isNullable: false,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(tableName);
    await queryRunner.dropColumns(table, ["raceName", "raceClass", "raceSeason"]);
  }
}

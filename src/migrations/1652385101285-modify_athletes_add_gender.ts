import { MigrationInterface, QueryRunner, TableColumn, Table } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const tableName = "athletes";

export class modifyAthletesAddGender1652385101285 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const wslAthletetable: Table = await queryRunner.getTable(`${SportsDbSchema.WSL}.${tableName}`);
    const slsAthletetable: Table = await queryRunner.getTable(`${SportsDbSchema.SLS}.${tableName}`);

    await queryRunner.addColumn(
      wslAthletetable,
      new TableColumn({
        name: "gender",
        type: "text",
        default: null,
        isNullable: true,
      }),
    );
    await queryRunner.addColumn(
      slsAthletetable,
      new TableColumn({
        name: "gender",
        type: "text",
        default: null,
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const wslAthletetable: Table = await queryRunner.getTable(`${SportsDbSchema.WSL}.${tableName}`);
    const slsAthletetable: Table = await queryRunner.getTable(`${SportsDbSchema.SLS}.${tableName}`);

    await queryRunner.dropColumn(wslAthletetable, "gender");
    await queryRunner.dropColumn(slsAthletetable, "gender");
  }
}

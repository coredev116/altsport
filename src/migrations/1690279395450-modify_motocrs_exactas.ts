import { MigrationInterface, QueryRunner, TableColumn, Table } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const tableName = `${SportsDbSchema.MOTOCRS}.projectionExactas`;
const clientTableName = `${SportsDbSchema.MOTOCRS}.clientProjectionExactas`;

export class ModifyMotocrsExactas1690279395450 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(tableName);
    const clientTable: Table = await queryRunner.getTable(clientTableName);

    await Promise.all([
      queryRunner.addColumns(table, [
        new TableColumn({
          name: "draw",
          type: "boolean",
          default: false,
        }),
        new TableColumn({
          name: "voided",
          type: "boolean",
          default: false,
        }),
        new TableColumn({
          name: "visible",
          type: "boolean",
          default: false,
        }),
        new TableColumn({
          name: "holdingPercentage",
          type: "decimal",
          default: 100,
        }),
      ]),
      queryRunner.addColumns(clientTable, [
        new TableColumn({
          name: "draw",
          type: "boolean",
          default: false,
        }),
        new TableColumn({
          name: "voided",
          type: "boolean",
          default: false,
        }),
        new TableColumn({
          name: "visible",
          type: "boolean",
          default: false,
        }),
        new TableColumn({
          name: "holdingPercentage",
          type: "decimal",
          default: 100,
        }),
      ]),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(tableName);
    const clientTable: Table = await queryRunner.getTable(clientTableName);
    await Promise.all([
      queryRunner.dropColumns(table, ["draw", "voided", "visible", "holdingPercentage"]),
      queryRunner.dropColumns(clientTable, ["draw", "voided", "visible", "holdingPercentage"]),
    ]);
  }
}

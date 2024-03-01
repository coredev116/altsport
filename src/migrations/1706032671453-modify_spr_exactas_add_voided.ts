import { MigrationInterface, QueryRunner, TableColumn, Table } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const projectionExactas = `${SportsDbSchema.SPR}.projectionExactas`;
const clientProjectionExactas = `${SportsDbSchema.SPR}.clientProjectionExactas`;

const columnNames: string[] = ["draw", "voided", "visible", "holdingPercentage"];

export class ModifySprExactasAddVoided1706032671453 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const projectionExactasTable: Table = await queryRunner.getTable(`${projectionExactas}`);
    const clientProjectionExactasTable: Table = await queryRunner.getTable(
      `${clientProjectionExactas}`,
    );

    const colummns = [
      new TableColumn({
        name: "draw",
        type: "boolean",
        isNullable: false,
        default: false,
      }),
      new TableColumn({
        name: "voided",
        type: "boolean",
        isNullable: false,
        default: false,
      }),
      new TableColumn({
        name: "visible",
        type: "boolean",
        isNullable: false,
        default: false,
      }),
      new TableColumn({
        name: "holdingPercentage",
        type: "decimal",
        isNullable: true,
        default: 0,
      }),
    ];

    await Promise.all([
      queryRunner.addColumns(projectionExactasTable, colummns),
      queryRunner.addColumns(clientProjectionExactasTable, colummns),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const projectionExactasTable: Table = await queryRunner.getTable(`${projectionExactas}`);
    const clientProjectionExactasTable: Table = await queryRunner.getTable(
      `${clientProjectionExactas}`,
    );

    await Promise.all([
      queryRunner.dropColumns(projectionExactasTable, columnNames),
      queryRunner.dropColumns(clientProjectionExactasTable, columnNames),
    ]);
  }
}

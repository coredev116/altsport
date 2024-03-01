import { MigrationInterface, QueryRunner, TableColumn, Table } from "typeorm";
import { SportsDbSchema } from "../constants/system";

const slsEventTableName = `${SportsDbSchema.SLS}.events`;
const slsRoundHeatTableName = `${SportsDbSchema.SLS}.roundHeats`;
const wslEventTableName = `${SportsDbSchema.WSL}.events`;
const wslRoundHeatTableName = `${SportsDbSchema.WSL}.roundHeats`;

export class modifyEventsRoundHeatsAddMarketOpenBoolean1653558014701 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const slsEventTable: Table = await queryRunner.getTable(slsEventTableName);
    const slsRoundHeatTable: Table = await queryRunner.getTable(slsRoundHeatTableName);
    const wslEventTable: Table = await queryRunner.getTable(wslEventTableName);
    const wslRoundHeatTable: Table = await queryRunner.getTable(wslRoundHeatTableName);

    const eventColumn: TableColumn = new TableColumn({
      name: "isEventWinnerMarketOpen",
      type: "boolean",
      isNullable: true,
      default: true,
    });
    const eventHeatColumn: TableColumn = new TableColumn({
      name: "isHeatWinnerMarketOpen",
      type: "boolean",
      isNullable: true,
      default: true,
    });

    await Promise.all([
      queryRunner.addColumns(slsEventTable, [eventColumn]),
      queryRunner.addColumns(slsRoundHeatTable, [eventHeatColumn]),
      queryRunner.addColumns(wslEventTable, [eventColumn]),
      queryRunner.addColumns(wslRoundHeatTable, [eventHeatColumn]),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const slsEventTable: Table = await queryRunner.getTable(slsEventTableName);
    const slsRoundHeatTable: Table = await queryRunner.getTable(slsRoundHeatTableName);
    const wslEventTable: Table = await queryRunner.getTable(wslEventTableName);
    const wslRoundHeatTable: Table = await queryRunner.getTable(wslRoundHeatTableName);

    await Promise.all([
      queryRunner.dropColumns(slsEventTable, ["isEventWinnerMarketOpen"]),
      queryRunner.dropColumns(slsRoundHeatTable, ["isHeatWinnerMarketOpen"]),
      queryRunner.dropColumns(wslEventTable, ["isEventWinnerMarketOpen"]),
      queryRunner.dropColumns(wslRoundHeatTable, ["isHeatWinnerMarketOpen"]),
    ]);
  }
}

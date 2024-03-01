import { MigrationInterface, QueryRunner, TableColumn, Table } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const eventRoundTableName = `${SportsDbSchema.MASL}.eventRounds`;
const eventTableName = `${SportsDbSchema.MASL}.events`;

export class ModifyMaslEventRoundsAddSlackbotNotification1705156649533
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const eventRoundTable: Table = await queryRunner.getTable(eventRoundTableName);
    const eventTable: Table = await queryRunner.getTable(eventTableName);

    await Promise.all([
      queryRunner.addColumn(
        eventRoundTable,
        new TableColumn({
          name: "isSlackbotResultNotified",
          type: "boolean",
          isNullable: false,
          default: false,
        }),
      ),
      queryRunner.addColumn(
        eventTable,
        new TableColumn({
          name: "isSlackbotResultNotified",
          type: "boolean",
          isNullable: false,
          default: false,
        }),
      ),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const eventRoundTable: Table = await queryRunner.getTable(eventRoundTableName);
    const eventTable: Table = await queryRunner.getTable(eventTableName);

    await Promise.all([
      queryRunner.dropColumn(eventRoundTable, "isSlackbotNotified"),
      queryRunner.dropColumn(eventTable, "isSlackbotNotified"),
    ]);
  }
}

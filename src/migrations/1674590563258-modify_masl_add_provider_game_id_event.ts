import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const eventsTableName = `${SportsDbSchema.MASL}.events`;

export class modifyMaslAddProviderGameIdEvent1674590563258 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(eventsTableName);

    await Promise.all([
      queryRunner.addColumn(
        table,
        new TableColumn({
          name: "providerGameId",
          type: "text",
          isNullable: true,
        }),
      ),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(eventsTableName);

    await Promise.all([queryRunner.dropColumn(table, "providerGameId")]);
  }
}

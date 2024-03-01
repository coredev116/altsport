import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const eventsTableName = `${SportsDbSchema.WSL}.eventParticipants`;

export class modifyWslEventParticipantsAddTiers1676959445464 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(eventsTableName);

    await Promise.all([
      queryRunner.addColumn(
        table,
        new TableColumn({
          name: "tier",
          type: "text",
          isNullable: true,
        }),
      ),
      queryRunner.addColumn(
        table,
        new TableColumn({
          name: "tierSeed",
          type: "text",
          isNullable: true,
        }),
      ),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(eventsTableName);

    await Promise.all([
      queryRunner.dropColumn(table, "tier"),
      queryRunner.dropColumn(table, "tierSeed"),
    ]);
  }
}

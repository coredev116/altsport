import { MigrationInterface, QueryRunner, TableColumn, Table } from "typeorm";
import { SportsDbSchema } from "../constants/system";

const slsTableName = `${SportsDbSchema.SLS}.eventParticipants`;
const wslTableName = `${SportsDbSchema.WSL}.eventParticipants`;

export class modifyEventParticipantsAddNotes1654093795305 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const slsTable: Table = await queryRunner.getTable(slsTableName);
    const wslTable: Table = await queryRunner.getTable(wslTableName);

    await Promise.all([
      queryRunner.addColumns(slsTable, [
        new TableColumn({
          name: "notes",
          type: "text",
          isNullable: true,
        }),
      ]),
      queryRunner.addColumns(wslTable, [
        new TableColumn({
          name: "notes",
          type: "text",
          isNullable: true,
        }),
      ]),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const slsTable: Table = await queryRunner.getTable(slsTableName);
    const wslTable: Table = await queryRunner.getTable(wslTableName);

    await queryRunner.dropColumns(slsTable, ["notes"]);
    await queryRunner.dropColumns(wslTable, ["notes"]);
  }
}

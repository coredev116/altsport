import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const slsTableName = `${SportsDbSchema.SLS}.propBets`;
const wslTableName = `${SportsDbSchema.WSL}.propBets`;

export class modifyVoidedPropBets1656308042573 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const slsTable: Table = await queryRunner.getTable(slsTableName);
    const wslTable: Table = await queryRunner.getTable(wslTableName);

    await Promise.all([
      queryRunner.addColumns(slsTable, [
        new TableColumn({
          name: "voided",
          type: "boolean",
          default: false,
        }),
      ]),
      queryRunner.addColumns(wslTable, [
        new TableColumn({
          name: "voided",
          type: "boolean",
          default: false,
        }),
      ]),

      queryRunner.changeColumn(
        slsTable,
        "eventParticipantId",
        new TableColumn({
          name: "eventParticipantId",
          type: "uuid",
          isNullable: true,
        }),
      ),
      queryRunner.changeColumn(
        wslTable,
        "eventParticipantId",
        new TableColumn({
          name: "eventParticipantId",
          type: "uuid",
          isNullable: true,
        }),
      ),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const slsTable: Table = await queryRunner.getTable(slsTableName);
    const wslTable: Table = await queryRunner.getTable(wslTableName);

    await Promise.all([
      queryRunner.dropColumns(slsTable, ["voided"]),
      queryRunner.dropColumns(wslTable, ["voided"]),
    ]);

    // revert the nullability as well
    // clear all existing rows and revert
    await Promise.all([
      queryRunner.clearTable(slsTable.name),
      queryRunner.clearTable(wslTable.name),
    ]);

    await Promise.all([
      queryRunner.changeColumn(
        slsTable,
        "eventParticipantId",
        new TableColumn({
          name: "eventParticipantId",
          type: "uuid",
          isNullable: false,
        }),
      ),
      queryRunner.changeColumn(
        wslTable,
        "eventParticipantId",
        new TableColumn({
          name: "eventParticipantId",
          type: "uuid",
          isNullable: false,
        }),
      ),
    ]);
  }
}

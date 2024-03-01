import { MigrationInterface, QueryRunner, TableColumn, Table } from "typeorm";
import { SportsDbSchema } from "../constants/system";

const slsTableName = `${SportsDbSchema.SLS}.athletes`;
const wslTableName = `${SportsDbSchema.WSL}.athletes`;

export class modifyStanceColAthletes1653299727727 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableSls: Table = await queryRunner.getTable(slsTableName);
    const tableWls: Table = await queryRunner.getTable(wslTableName);

    const column: TableColumn = new TableColumn({
      name: "stance",
      type: "text",
      isNullable: true,
      default: null,
    });

    await Promise.all([
      queryRunner.addColumns(tableSls, [column]),
      queryRunner.addColumns(tableWls, [column]),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tableSls: Table = await queryRunner.getTable(slsTableName);
    const tableWls: Table = await queryRunner.getTable(wslTableName);

    await Promise.all([
      queryRunner.dropColumns(tableSls, ["stance"]),
      queryRunner.dropColumns(tableWls, ["stance"]),
    ]);
  }
}

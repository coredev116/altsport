import { MigrationInterface, QueryRunner, Table, TableColumn, TableColumnOptions } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const tableName: string = "playerHeadToHeads";
// at the time this migration was created, these were the only sports that supported it
const sports = [
  SportsDbSchema.WSL,
  SportsDbSchema.SLS,
  SportsDbSchema.NRX,
  SportsDbSchema.SPR,
  SportsDbSchema.F1,
  SportsDbSchema.MotoGP,
  SportsDbSchema.MOTOCRS,
  SportsDbSchema.FDRIFT,
  SportsDbSchema.MXGP,
];
const sportTables = sports.map((sport) => `${sport}.${tableName}`);

const columnName: string = "visible";

const columnAttrs: TableColumnOptions = {
  name: columnName,
  type: "boolean",
  default: false,
};

export class ModifyHeadHeadAddVisible1688973206149 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tables: Table[] = await Promise.all(
      sportTables.map((sportTable) => queryRunner.getTable(sportTable)),
    );

    await Promise.all(
      tables.map((table) => queryRunner.addColumn(table, new TableColumn(columnAttrs))),
    );

    // for all existing head to heads, set them as visible
    // newer ones will follow the new rule

    await Promise.all(
      sports.map((sport) =>
        queryRunner.query(
          `UPDATE "${sport}"."${tableName}" SET visible = true WHERE visible = false`,
        ),
      ),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tables: Table[] = await Promise.all(
      sportTables.map((sportTable) => queryRunner.getTable(sportTable)),
    );

    await Promise.all(tables.map((table) => queryRunner.dropColumn(table, columnName)));
  }
}

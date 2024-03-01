import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableColumnOptions,
  TableForeignKey,
} from "typeorm";

import { SportsDbSchema } from "../constants/system";

const tableName: string = "futureOdds";

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
  SportsDbSchema.MASL,
  SportsDbSchema.PBR,
];
const sportTables = sports.map((sport) => `${sport}.${tableName}`);

const columnStatus: TableColumnOptions = {
  name: "futureId",
  type: "uuid",
  isNullable: false,
};

export class ModifyFutureOdds1690802179842 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tables: Table[] = await Promise.all(
      sportTables.map((sportTable) => queryRunner.getTable(sportTable)),
    );

    await Promise.all(
      tables.map(async (table, index) => {
        await queryRunner.addColumn(table, new TableColumn(columnStatus));

        return queryRunner.createForeignKey(
          table,
          new TableForeignKey({
            columnNames: ["futureId"],
            referencedColumnNames: ["id"],
            referencedTableName: "futures",
            referencedSchema: sports[index],
          }),
        );
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tables: Table[] = await Promise.all(
      sportTables.map((sportTable) => queryRunner.getTable(sportTable)),
    );

    await Promise.all(tables.map((table) => queryRunner.dropColumn(table, "futureId")));
  }
}

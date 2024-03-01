import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const tableName: string = "clientFutureOdds";

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

export class ModifyClientFutureOdds1690960293324 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tables: Table[] = await Promise.all(
      sportTables.map((sportTable) => queryRunner.getTable(sportTable)),
    );

    await Promise.all(
      tables.map(async (table, index) => {
        await queryRunner.dropForeignKey(
          table,
          new TableForeignKey({
            columnNames: ["futureId"],
            referencedColumnNames: ["id"],
            referencedTableName: "futures",
            referencedSchema: sports[index],
          }),
        );
        return queryRunner.createForeignKey(
          table,
          new TableForeignKey({
            columnNames: ["futureId"],
            referencedColumnNames: ["id"],
            referencedTableName: "clientFutures",
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

    await Promise.all(
      tables.map(async (table, index) => {
        await queryRunner.dropForeignKey(
          table,
          new TableForeignKey({
            columnNames: ["futureId"],
            referencedColumnNames: ["id"],
            referencedTableName: "clientFutures",
            referencedSchema: sports[index],
          }),
        );
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
}

import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const tableNames: string[] = ["events", "roundHeats"];

const affectedTableNames: {
  schema: string;
  tableName: string;
}[] = [];

[SportsDbSchema.WSL, SportsDbSchema.SLS, SportsDbSchema.NRX, SportsDbSchema.SPR].forEach(
  (schema) => {
    tableNames.forEach((tableName) => {
      affectedTableNames.push({
        schema,
        tableName: `${schema}.${tableName}`,
      });
    });
  },
);

export class modifyOddsAddHeatWinner1669830703687 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tables: {
      schema: string;
      table: Table;
    }[] = await Promise.all(
      affectedTableNames.map(async (row) => {
        return {
          table: await queryRunner.getTable(row.tableName),
          schema: row.schema,
        };
      }),
    );

    await Promise.all(
      tables.map((row) =>
        queryRunner.addColumn(
          row.table,
          new TableColumn({
            name: "winnerAthleteId",
            type: "uuid",
            default: null,
            isNullable: true,
          }),
        ),
      ),
    );

    await Promise.all(
      tables.map((row) =>
        queryRunner.createForeignKeys(row.table, [
          new TableForeignKey({
            columnNames: ["winnerAthleteId"],
            referencedColumnNames: ["id"],
            referencedTableName: "athletes",
            referencedSchema: row.schema,
          }),
        ]),
      ),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tables: {
      schema: string;
      table: Table;
    }[] = await Promise.all(
      affectedTableNames.map(async (row) => {
        return {
          table: await queryRunner.getTable(row.tableName),
          schema: row.schema,
        };
      }),
    );

    await Promise.all(tables.map((row) => queryRunner.dropColumn(row.table, "winnerAthleteId")));
  }
}

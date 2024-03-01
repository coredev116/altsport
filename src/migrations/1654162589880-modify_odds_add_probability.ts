import { MigrationInterface, QueryRunner, TableColumn, Table } from "typeorm";
import { SportsDbSchema } from "../constants/system";

const tableNames: string[] = [
  `${SportsDbSchema.SLS}.projectionEventHeatOutcome`,
  `${SportsDbSchema.SLS}.projectionEventOutcome`,
  //   `${SportsDbSchema.SLS}.playerHeadToHeads`,
  `${SportsDbSchema.SLS}.propBets`,
  `${SportsDbSchema.WSL}.projectionEventHeatOutcome`,
  `${SportsDbSchema.WSL}.projectionEventOutcome`,
  `${SportsDbSchema.WSL}.propBets`,
];

const headToHeadTableName = `${SportsDbSchema.SLS}.playerHeadToHeads`;

export class modifyOddsAddProbability1654162589880 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tables: Table[] = await Promise.all(
      tableNames.map((tableName) => queryRunner.getTable(tableName)),
    );
    const headToHeadTable: Table = await queryRunner.getTable(headToHeadTableName);

    // for each table, add the probability column
    await Promise.all([
      ...tables.map((table) =>
        queryRunner.addColumn(
          table,
          new TableColumn({
            name: "probability",
            type: "decimal",
            isNullable: true,
            default: 0,
          }),
        ),
      ),
      queryRunner.addColumn(
        headToHeadTable,
        new TableColumn({
          name: "player1Probability",
          type: "decimal",
          isNullable: true,
          default: 0,
        }),
      ),
      queryRunner.addColumn(
        headToHeadTable,
        new TableColumn({
          name: "player2Probability",
          type: "decimal",
          isNullable: true,
          default: 0,
        }),
      ),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tables: Table[] = await Promise.all(
      tableNames.map((tableName) => queryRunner.getTable(tableName)),
    );
    const headToHeadTable: Table = await queryRunner.getTable(headToHeadTableName);

    await Promise.all([
      ...tables.map((table) => queryRunner.dropColumn(table, "probability")),
      queryRunner.dropColumns(headToHeadTable, ["player1Probability", "player2Probability"]),
    ]);
  }
}

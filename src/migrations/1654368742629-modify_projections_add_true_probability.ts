import { MigrationInterface, QueryRunner, TableColumn, Table } from "typeorm";
import { SportsDbSchema } from "../constants/system";

const tableNames: string[] = [
  `${SportsDbSchema.SLS}.projectionEventHeatOutcome`,
  `${SportsDbSchema.SLS}.projectionEventOutcome`,
  `${SportsDbSchema.WSL}.projectionEventHeatOutcome`,
  `${SportsDbSchema.WSL}.projectionEventOutcome`,
];

const headToHeadTableName = `${SportsDbSchema.SLS}.playerHeadToHeads`;

export class modifyProjectionsAddTrueProbability1654368742629 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tables: Table[] = await Promise.all(
      tableNames.map((tableName) => queryRunner.getTable(tableName)),
    );
    const headToHeadTable: Table = await queryRunner.getTable(headToHeadTableName);

    // for each table, add the true probability column
    await Promise.all([
      ...tables.map((table) =>
        queryRunner.addColumns(table, [
          new TableColumn({
            name: "trueProbability",
            type: "decimal",
            isNullable: true,
            default: 0,
          }),
          new TableColumn({
            name: "hasModifiedProbability",
            type: "boolean",
            isNullable: true,
            default: false,
          }),
        ]),
      ),
      queryRunner.addColumns(headToHeadTable, [
        new TableColumn({
          name: "player1TrueProbability",
          type: "decimal",
          isNullable: true,
          default: 0,
        }),
        new TableColumn({
          name: "player2TrueProbability",
          type: "decimal",
          isNullable: true,
          default: 0,
        }),
      ]),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tables: Table[] = await Promise.all(
      tableNames.map((tableName) => queryRunner.getTable(tableName)),
    );
    const headToHeadTable: Table = await queryRunner.getTable(headToHeadTableName);

    await Promise.all([
      ...tables.map((table) =>
        queryRunner.dropColumns(table, ["trueProbability", "hasModifiedProbability"]),
      ),
      queryRunner.dropColumns(headToHeadTable, [
        "player1TrueProbability",
        "player2TrueProbability",
      ]),
    ]);
  }
}

import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";
import { SportsDbSchema } from "../constants/system";

const f1ClientHeadToHeadTableName = `${SportsDbSchema.F1}.clientPlayerHeadToHeads`;
const f1HeadToHeadTableName = `${SportsDbSchema.F1}.playerHeadToHeads`;
const mgpClientHeadToHeadTableName = `${SportsDbSchema.MotoGP}.clientPlayerHeadToHeads`;
const mgpHeadToHeadTableName = `${SportsDbSchema.MotoGP}.playerHeadToHeads`;

const tableNames: string[] = [
  f1ClientHeadToHeadTableName,
  mgpClientHeadToHeadTableName,
  f1HeadToHeadTableName,
  mgpHeadToHeadTableName,
];

export class ModifyApexF1MotogpHeadHeadOdds1687179579536 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tables: Table[] = await Promise.all(
      tableNames.map((tableName) => queryRunner.getTable(tableName)),
    );

    await Promise.all(
      tables.map((table) =>
        queryRunner.dropColumns(
          table,
          table.columns.filter((column) =>
            ["probability_A", "probability_B", "probability_C", "probability_D"].includes(
              column.name,
            ),
          ),
        ),
      ),
    );

    await Promise.all(
      tables.map((table) =>
        queryRunner.addColumns(table, [
          new TableColumn({
            name: "player1Position",
            type: "int",
            isNullable: true,
          }),
          new TableColumn({
            name: "player2Position",
            type: "int",
            isNullable: true,
          }),
          new TableColumn({
            name: "player1Odds",
            type: "decimal",
            default: 0,
          }),
          new TableColumn({
            name: "player2Odds",
            type: "decimal",
            default: 0,
          }),
          new TableColumn({
            name: "player1Probability",
            type: "decimal",
            default: 0,
          }),
          new TableColumn({
            name: "player1TrueProbability",
            type: "decimal",
            default: 0,
          }),
          new TableColumn({
            name: "player2Probability",
            type: "decimal",
            default: 0,
          }),
          new TableColumn({
            name: "player2TrueProbability",
            type: "decimal",
            default: 0,
          }),
          new TableColumn({
            name: "player1HasModifiedProbability",
            type: "boolean",
            default: false,
          }),
          new TableColumn({
            name: "player2HasModifiedProbability",
            type: "boolean",
            default: false,
          }),
          new TableColumn({
            name: "holdingPercentage",
            type: "decimal",
            default: 0,
          }),
        ]),
      ),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tables: Table[] = await Promise.all(
      tableNames.map((tableName) => queryRunner.getTable(tableName)),
    );

    await Promise.all(
      tables.map((table) =>
        queryRunner.dropColumns(
          table,
          table.columns.filter((column) =>
            [
              "player1Position",
              "player2Position",
              "player1Odds",
              "player2Odds",
              "player1Probability",
              "player2Probability",
              "player1TrueProbability",
              "player2TrueProbability",
              "player1HasModifiedProbability",
              "player2HasModifiedProbability",
              "holdingPercentage",
            ].includes(column.name),
          ),
        ),
      ),
    );

    await Promise.all(
      tables.map((table) =>
        queryRunner.addColumns(table, [
          new TableColumn({
            name: "probability_A",
            type: "decimal",
            default: 0,
          }),
          new TableColumn({
            name: "probability_B",
            type: "decimal",
            default: 0,
          }),
          new TableColumn({
            name: "probability_C",
            type: "decimal",
            default: 0,
          }),
          new TableColumn({
            name: "probability_D",
            type: "decimal",
            default: 0,
          }),
        ]),
      ),
    );
  }
}

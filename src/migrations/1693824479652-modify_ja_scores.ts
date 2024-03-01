import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  Table,
  TableForeignKey,
  TableIndex,
} from "typeorm";

import { SportsDbSchema } from "../constants/system";

const tableName = `${SportsDbSchema.JA}.scores`;

export class ModifyJaScores1693824479652 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(tableName);

    await Promise.all([
      queryRunner.addColumns(table, [
        new TableColumn({
          name: "teamId",
          type: "uuid",
          isNullable: true,
        }),
        new TableColumn({
          name: "eventRoundId",
          type: "uuid",
          isNullable: true,
        }),
      ]),
    ]);

    await Promise.all([
      queryRunner.createForeignKey(
        table,
        new TableForeignKey({
          columnNames: ["teamId"],
          referencedColumnNames: ["id"],
          referencedTableName: "teams",
          referencedSchema: SportsDbSchema.JA,
        }),
      ),
      queryRunner.createIndex(
        table,
        new TableIndex({
          columnNames: ["teamId"],
        }),
      ),

      queryRunner.createForeignKey(
        table,
        new TableForeignKey({
          columnNames: ["eventRoundId"],
          referencedColumnNames: ["id"],
          referencedTableName: "eventRounds",
          referencedSchema: SportsDbSchema.JA,
        }),
      ),
      queryRunner.createIndex(
        table,
        new TableIndex({
          columnNames: ["eventRoundId"],
        }),
      ),

      queryRunner.query(
        `ALTER TABLE ${tableName} ADD CONSTRAINT Unique_Score UNIQUE ("eventRoundId","teamId","athleteId")`,
      ),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(tableName);
    await Promise.all([
      queryRunner.query(
        `ALTER TABLE ${tableName} DROP CONSTRAINT Unique_Score UNIQUE ("eventRoundId","teamId","athleteId")`,
      ),

      queryRunner.dropColumns(table, ["teamId", "eventRoundId"]),
    ]);
  }
}

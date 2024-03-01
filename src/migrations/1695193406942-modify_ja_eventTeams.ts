import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  Table,
  TableForeignKey,
  TableIndex,
} from "typeorm";

import { SportsDbSchema } from "../constants/system";

const tableName = `${SportsDbSchema.JA}.eventTeams`;

export class ModifyJaEventTeams1695193406942 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(tableName);

    await Promise.all([
      queryRunner.addColumns(table, [
        new TableColumn({
          name: "athlete1Id",
          type: "uuid",
          isNullable: true,
        }),
        new TableColumn({
          name: "athlete2Id",
          type: "uuid",
          isNullable: true,
        }),
      ]),
    ]);

    await Promise.all([
      queryRunner.createForeignKey(
        table,
        new TableForeignKey({
          columnNames: ["athlete1Id"],
          referencedColumnNames: ["id"],
          referencedTableName: "athletes",
          referencedSchema: SportsDbSchema.JA,
        }),
      ),
      queryRunner.createIndex(
        table,
        new TableIndex({
          columnNames: ["athlete1Id"],
        }),
      ),

      queryRunner.createForeignKey(
        table,
        new TableForeignKey({
          columnNames: ["athlete2Id"],
          referencedColumnNames: ["id"],
          referencedTableName: "athletes",
          referencedSchema: SportsDbSchema.JA,
        }),
      ),
      queryRunner.createIndex(
        table,
        new TableIndex({
          columnNames: ["athlete2Id"],
        }),
      ),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(tableName);
    await Promise.all([queryRunner.dropColumns(table, ["athlete1Id", "athlete2Id"])]);
  }
}

import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableColumnOptions,
} from "typeorm";

import { SportsDbSchema } from "../constants/system";

const slsTableName = `${SportsDbSchema.SLS}.futureOdds`;

const columns: TableColumnOptions[] = [
  {
    name: "id",
    type: "uuid",
    isPrimary: true,
    isUnique: true,
    generationStrategy: "uuid",
    default: `uuid_generate_v4()`,
  },
  {
    name: "athleteId",
    type: "uuid",
    isNullable: false,
  },
  {
    name: "odds",
    type: "decimal",
    default: 0,
  },
  {
    name: "trueProbability",
    type: "decimal",
    default: 0,
  },
  {
    name: "hasModifiedProbability",
    type: "boolean",
    default: false,
  },
  {
    name: "probability",
    type: "decimal",
    default: 0,
  },
  {
    name: "isActive",
    type: "boolean",
    default: true,
  },
  {
    name: "isArchived",
    type: "boolean",
    default: false,
  },
  {
    name: "createdAt",
    type: "timestamptz",
    default: "now()",
  },
  {
    name: "updatedAt",
    type: "timestamptz",
    default: "now()",
  },
];

export class CreateSLSFutureOdds1690455220612 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await Promise.all([
      queryRunner.createTable(
        new Table({
          name: slsTableName,
          schema: SportsDbSchema.SLS,
          columns,
        }),
        true,
      ),
    ]);

    const slsTable: Table = await queryRunner.getTable(slsTableName);

    await Promise.all([
      queryRunner.createForeignKeys(slsTable, [
        new TableForeignKey({
          columnNames: ["athleteId"],
          referencedColumnNames: ["id"],
          referencedTableName: "athletes",
          referencedSchema: SportsDbSchema.SLS,
        }),
      ]),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const slsTable: Table = await queryRunner.getTable(slsTableName);
    await queryRunner.dropTable(slsTable, true);
  }
}

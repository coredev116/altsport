import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableColumnOptions,
} from "typeorm";

import { SportsDbSchema } from "../constants/system";

const jaTableName = `${SportsDbSchema.JA}.clientFutureOdds`;

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
    name: "futureId",
    type: "uuid",
    isNullable: false,
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

export class CreateJaClientFutureOdds1692799911956 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await Promise.all([
      queryRunner.createTable(
        new Table({
          name: jaTableName,
          schema: SportsDbSchema.JA,
          columns,
        }),
        true,
      ),
    ]);

    const jaTable: Table = await queryRunner.getTable(jaTableName);

    await Promise.all([
      queryRunner.createForeignKeys(jaTable, [
        new TableForeignKey({
          columnNames: ["athleteId"],
          referencedColumnNames: ["id"],
          referencedTableName: "athletes",
          referencedSchema: SportsDbSchema.JA,
        }),
      ]),

      queryRunner.createForeignKeys(jaTable, [
        new TableForeignKey({
          columnNames: ["futureId"],
          referencedColumnNames: ["id"],
          referencedTableName: "clientFutures",
          referencedSchema: SportsDbSchema.JA,
        }),
      ]),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const jaTable: Table = await queryRunner.getTable(jaTableName);
    await queryRunner.dropTable(jaTable, true);
  }
}

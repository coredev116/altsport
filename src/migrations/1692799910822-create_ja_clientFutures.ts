import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableColumnOptions,
} from "typeorm";

import { SportsDbSchema, FutureStatus } from "../constants/system";

const jaTableName = `${SportsDbSchema.JA}.clientFutures`;

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
    name: "tourYearId",
    type: "uuid",
    isNullable: false,
  },
  {
    name: "type",
    type: "text",
    isNullable: false,
  },
  {
    name: "isMarketOpen",
    type: "boolean",
    default: false,
  },
  {
    name: "startDate",
    type: "timestamptz",
    isNullable: true,
  },
  {
    name: "endDate",
    type: "timestamptz",
    isNullable: true,
  },
  {
    name: "status",
    type: "int",
    isNullable: false,
    default: FutureStatus.LIVE,
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

export class CreateJaClientFutures1692799910822 implements MigrationInterface {
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
          columnNames: ["tourYearId"],
          referencedColumnNames: ["id"],
          referencedTableName: "tourYears",
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

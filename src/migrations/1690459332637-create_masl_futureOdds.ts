import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableColumnOptions,
} from "typeorm";

import { SportsDbSchema } from "../constants/system";

const maslTableName = `${SportsDbSchema.MASL}.futureOdds`;

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
    name: "teamId",
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

export class CreateMaslFutureOdds1690459332637 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await Promise.all([
      queryRunner.createTable(
        new Table({
          name: maslTableName,
          schema: SportsDbSchema.MASL,
          columns,
        }),
        true,
      ),
    ]);

    const maslTable: Table = await queryRunner.getTable(maslTableName);

    await Promise.all([
      queryRunner.createForeignKeys(maslTable, [
        new TableForeignKey({
          columnNames: ["teamId"],
          referencedColumnNames: ["id"],
          referencedTableName: "teams",
          referencedSchema: SportsDbSchema.MASL,
        }),
      ]),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const maslTable: Table = await queryRunner.getTable(maslTableName);
    await queryRunner.dropTable(maslTable, true);
  }
}

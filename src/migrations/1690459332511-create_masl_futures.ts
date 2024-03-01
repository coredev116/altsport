import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableColumnOptions,
} from "typeorm";

import { SportsDbSchema } from "../constants/system";

const maslTableName = `${SportsDbSchema.MASL}.futures`;

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
    name: "leagueYearId",
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

export class CreateMaslFutures1690459332511 implements MigrationInterface {
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
          columnNames: ["leagueYearId"],
          referencedColumnNames: ["id"],
          referencedTableName: "leagueYears",
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

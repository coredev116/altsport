import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableColumnOptions,
} from "typeorm";

import { SportsDbSchema } from "../constants/system";

const futuresTableName: string = "futures";
const clientFuturesTableName: string = "clientFutures";
const clientFutureOddsTableName: string = "clientFutureOdds";

const sports: SportsDbSchema[] = [
  SportsDbSchema.F1,
  SportsDbSchema.FDRIFT,
  SportsDbSchema.MOTOCRS,
  SportsDbSchema.MotoGP,
  SportsDbSchema.MXGP,
  SportsDbSchema.NRX,
  SportsDbSchema.PBR,
  SportsDbSchema.SPR,
  SportsDbSchema.WSL,
  SportsDbSchema.SLS,
  SportsDbSchema.MASL,
  SportsDbSchema.JA,
];

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

export class ModifyFuturesDropClientFutures1693145917525 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // loop through the client tables and clear the client odds and then drop the client table
    await Promise.all(
      sports.map((sport) =>
        queryRunner.query(`TRUNCATE TABLE ${sport}."${clientFutureOddsTableName}"`),
      ),
    );

    await Promise.all(
      sports.map(async (sport) => {
        const clientFuturesTable: Table = await queryRunner.getTable(
          `${sport}.${clientFuturesTableName}`,
        );
        const clientFutureOddsTable: Table = await queryRunner.getTable(
          `${sport}.${clientFutureOddsTableName}`,
        );

        // drop the foreign key constraint and remap to the futures table
        const foreignKey: TableForeignKey = clientFutureOddsTable.foreignKeys.find(
          (foreignKeyItem) =>
            foreignKeyItem.columnNames.includes("futureId") &&
            foreignKeyItem.columnNames.length === 1,
        );
        await queryRunner.dropForeignKey(clientFutureOddsTable, foreignKey);

        // map to the futures table instead
        await queryRunner.createForeignKeys(clientFutureOddsTable, [
          new TableForeignKey({
            columnNames: ["futureId"],
            referencedColumnNames: ["id"],
            referencedTableName: `${sport}.${futuresTableName}`,
            referencedSchema: sport,
          }),
        ]);

        await queryRunner.dropTable(clientFuturesTable, true);
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await Promise.all(
      sports.map((sport) =>
        queryRunner.query(`TRUNCATE TABLE ${sport}."${clientFutureOddsTableName}"`),
      ),
    );

    await Promise.all(
      sports.map((sport) =>
        queryRunner.createTable(
          new Table({
            name: `${sport}.${clientFuturesTableName}`,
            schema: sport,
            columns,
          }),
          true,
        ),
      ),
    );

    await Promise.all(
      sports.map(async (sport) => {
        const clientFutureOddsTable: Table = await queryRunner.getTable(
          `${sport}.${clientFutureOddsTableName}`,
        );

        // drop the foreign key constraint and remap to the futures table
        const foreignKey: TableForeignKey = clientFutureOddsTable.foreignKeys.find(
          (foreignKeyItem) =>
            foreignKeyItem.columnNames.includes("futureId") &&
            foreignKeyItem.columnNames.length === 1,
        );
        await queryRunner.dropForeignKey(clientFutureOddsTable, foreignKey);

        // map to the futures table instead
        await queryRunner.createForeignKeys(clientFutureOddsTable, [
          new TableForeignKey({
            columnNames: ["futureId"],
            referencedColumnNames: ["id"],
            referencedTableName: `${sport}.${clientFuturesTableName}`,
            referencedSchema: sport,
          }),
        ]);
      }),
    );
  }
}

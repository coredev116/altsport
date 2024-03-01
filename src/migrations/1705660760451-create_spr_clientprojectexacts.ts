import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
  TableColumnOptions,
} from "typeorm";

import { SportsDbSchema } from "../constants/system";

const projectionExactas = `${SportsDbSchema.SPR}.projectionExactas`;
const clientProjectionExactas = `${SportsDbSchema.SPR}.clientProjectionExactas`;

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
    name: "eventId",
    type: "uuid",
    isNullable: false,
  },
  {
    name: "roundHeatId",
    type: "uuid",
    isNullable: true,
  },
  {
    name: "participants",
    type: "json",
    isNullable: false,
  },
  {
    name: "position",
    type: "int",
    isNullable: false,
  },
  {
    name: "odds",
    type: "decimal",
    default: 0,
  },
  {
    name: "probability",
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
export class CreateSprClientprojectexacts1705660760451 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await Promise.all([
      queryRunner.createTable(
        new Table({
          name: projectionExactas,
          schema: SportsDbSchema.SPR,
          columns,
        }),
        true,
      ),
      queryRunner.createTable(
        new Table({
          name: clientProjectionExactas,
          schema: SportsDbSchema.SPR,
          columns,
        }),
        true,
      ),
    ]);

    const projectionExactasTable: Table = await queryRunner.getTable(`${projectionExactas}`);
    const clientProjectionExactasTable: Table = await queryRunner.getTable(
      `${clientProjectionExactas}`,
    );

    await Promise.all([
      queryRunner.createForeignKeys(projectionExactasTable, [
        new TableForeignKey({
          columnNames: ["eventId"],
          referencedColumnNames: ["id"],
          referencedTableName: "events",
          referencedSchema: SportsDbSchema.SPR,
        }),
      ]),
      queryRunner.createIndices(projectionExactasTable, [
        new TableIndex({
          columnNames: ["eventId"],
        }),
      ]),

      queryRunner.createForeignKeys(clientProjectionExactasTable, [
        new TableForeignKey({
          columnNames: ["eventId"],
          referencedColumnNames: ["id"],
          referencedTableName: "events",
          referencedSchema: SportsDbSchema.SPR,
        }),
      ]),
      queryRunner.createIndices(clientProjectionExactasTable, [
        new TableIndex({
          columnNames: ["eventId"],
        }),
      ]),

      queryRunner.createForeignKeys(projectionExactasTable, [
        new TableForeignKey({
          columnNames: ["roundHeatId"],
          referencedColumnNames: ["id"],
          referencedTableName: "roundHeats",
          referencedSchema: SportsDbSchema.SPR,
        }),
      ]),
      queryRunner.createIndices(projectionExactasTable, [
        new TableIndex({
          columnNames: ["roundHeatId"],
        }),
      ]),

      queryRunner.createForeignKeys(clientProjectionExactasTable, [
        new TableForeignKey({
          columnNames: ["roundHeatId"],
          referencedColumnNames: ["id"],
          referencedTableName: "roundHeats",
          referencedSchema: SportsDbSchema.SPR,
        }),
      ]),
      queryRunner.createIndices(clientProjectionExactasTable, [
        new TableIndex({
          columnNames: ["roundHeatId"],
        }),
      ]),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const projectionExactasTable: Table = await queryRunner.getTable(projectionExactas);
    const clientProjectionExactasTable: Table = await queryRunner.getTable(clientProjectionExactas);

    await Promise.all([
      queryRunner.dropTable(projectionExactasTable, true),
      queryRunner.dropTable(clientProjectionExactasTable, true),
    ]);
  }
}

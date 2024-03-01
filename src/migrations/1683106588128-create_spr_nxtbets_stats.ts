import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const tableName = `${SportsDbSchema.SPR}.athleteStats`;

export class CreateSprNxtbetsStats1683106588128 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: tableName,
        schema: SportsDbSchema.SPR,
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            isUnique: true,
            generationStrategy: "uuid",
            default: `uuid_generate_v4()`,
          },
          {
            name: "athlete",
            type: "text",
            isNullable: false,
          },
          {
            name: "raceName",
            type: "text",
            isNullable: false,
          },
          {
            name: "raceClass",
            type: "text",
            isNullable: false,
          },
          {
            name: "raceSeason",
            type: "int",
            isNullable: false,
          },
          {
            name: "placeMain",
            type: "int",
            isNullable: true,
            default: null,
          },
          {
            name: "placeHeats",
            type: "int",
            isNullable: true,
            default: null,
          },
          {
            name: "eventWin",
            type: "int",
            isNullable: true,
            default: null,
          },
          {
            name: "placeLCQ",
            type: "int",
            isNullable: true,
            default: null,
          },
          {
            name: "placePrelim",
            type: "int",
            isNullable: true,
            default: null,
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(tableName);

    await queryRunner.dropTable(table, true);
  }
}

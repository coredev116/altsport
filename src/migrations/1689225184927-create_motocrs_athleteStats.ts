import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const tableName = `${SportsDbSchema.MOTOCRS}.athleteStats`;

export class CreateMotocrsAthleteStats1689225184927 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: tableName,
        schema: SportsDbSchema.MOTOCRS,
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
            name: "eventsRaced",
            type: "int",
            isNullable: true,
            default: null,
          },
          {
            name: "eventWins",
            type: "int",
            isNullable: true,
            default: null,
          },
          {
            name: "placeMain",
            type: "int",
            isNullable: true,
            default: null,
          },
          {
            name: "avgEventPlace",
            type: "int",
            isNullable: true,
            default: null,
          },
          {
            name: "avgLapTime",
            type: "decimal",
            isNullable: true,
            default: null,
          },
          {
            name: "avgBestLapTime",
            type: "decimal",
            isNullable: true,
            default: null,
          },
          {
            name: "avgQualifyingPlace",
            type: "int",
            isNullable: true,
            default: null,
          },
          {
            name: "mainEventApp",
            type: "int",
            isNullable: true,
            default: null,
          },
          {
            name: "prelimApp",
            type: "int",
            isNullable: true,
            default: null,
          },
          {
            name: "avgPrelimPlace",
            type: "int",
            isNullable: true,
            default: null,
          },
          {
            name: "lcqApp",
            type: "int",
            isNullable: true,
            default: null,
          },
          {
            name: "avgLcqPlace",
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

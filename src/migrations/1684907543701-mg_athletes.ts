import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const tableName = "athletes";

export class mgAthletes1684904543701 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // this ensure we can use default: `uuid_generate_v4()`
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.createSchema(SportsDbSchema.MotoGP, true);

    await queryRunner.createTable(
      new Table({
        name: tableName,
        schema: SportsDbSchema.MotoGP,
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
            name: "firstName",
            type: "text",
            isNullable: false,
          },
          {
            name: "middleName",
            type: "text",
            isNullable: true,
          },
          {
            name: "lastName",
            type: "text",
            isNullable: true,
          },
          {
            name: "dob",
            type: "timestamptz",
            isNullable: true,
          },
          {
            name: "gender",
            type: "text",
            isNullable: true,
          },
          {
            name: "nationality",
            type: "text",
            isNullable: true,
          },
          {
            name: "stance",
            type: "text",
            isNullable: true,
          },
          {
            name: "hometown",
            type: "text",
            isNullable: true,
          },
          {
            name: "providerId",
            type: "text",
            isNullable: true,
          },
          {
            name: "playerStatus",
            type: "int",
            isNullable: true,
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
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(`${SportsDbSchema.MotoGP}.${tableName}`);
    await queryRunner.dropTable(table, true);
  }
}

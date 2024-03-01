import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const tableName = "propBets";

export class createWrxPropBets1656568265672 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createSchema(SportsDbSchema.NRX, true);

    await queryRunner.createTable(
      new Table({
        name: tableName,
        schema: SportsDbSchema.NRX,
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
            name: "eventId",
            type: "uuid",
          },
          {
            name: "eventParticipantId",
            type: "uuid",
            isNullable: true,
          },
          {
            name: "proposition",
            type: "text",
          },
          {
            name: "odds",
            type: "decimal",
          },
          {
            name: "voided",
            type: "boolean",
            default: false,
          },
          {
            name: "payout",
            type: "boolean",
            isNullable: true,
            default: false,
          },
          {
            name: "probability",
            type: "decimal",
            isNullable: true,
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
        ],
      }),
      true,
    );

    const table: Table = await queryRunner.getTable(`${SportsDbSchema.NRX}.${tableName}`);

    await Promise.all([
      queryRunner.createForeignKeys(table, [
        new TableForeignKey({
          columnNames: ["eventId"],
          referencedColumnNames: ["id"],
          referencedTableName: "events",
          referencedSchema: SportsDbSchema.NRX,
        }),
        new TableForeignKey({
          columnNames: ["eventParticipantId"],
          referencedColumnNames: ["id"],
          referencedTableName: "eventParticipants",
          referencedSchema: SportsDbSchema.NRX,
        }),
      ]),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(`${SportsDbSchema.NRX}.${tableName}`);
    await queryRunner.dropTable(table, true);
  }
}

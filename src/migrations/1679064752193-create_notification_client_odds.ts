import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

const oddMarketsTableName = "oddMarkets";
const tableName = "clientMarketNotifications";

export class createNotificationClientOdds1679064752193 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: oddMarketsTableName,
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
            name: "name",
            type: "text",
            isNullable: false,
          },
          {
            name: "key",
            type: "text",
            isNullable: false,
            isUnique: true,
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

    await queryRunner.createTable(
      new Table({
        name: tableName,
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
            name: "clientId",
            type: "uuid",
          },
          {
            name: "oddMarketId",
            type: "uuid",
          },
          {
            name: "sms",
            type: "boolean",
            default: false,
          },
          {
            name: "email",
            type: "boolean",
            default: false,
          },
          {
            name: "slack",
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
        ],
      }),
      true,
    );

    const table: Table = await queryRunner.getTable(tableName);

    await Promise.all([
      queryRunner.createForeignKeys(tableName, [
        new TableForeignKey({
          columnNames: ["clientId"],
          referencedColumnNames: ["id"],
          referencedTableName: "clients",
        }),
        new TableForeignKey({
          columnNames: ["oddMarketId"],
          referencedColumnNames: ["id"],
          referencedTableName: oddMarketsTableName,
        }),
      ]),
      queryRunner.createIndex(
        table,
        new TableIndex({
          columnNames: ["oddMarketId"],
        }),
      ),
      queryRunner.createIndex(
        table,
        new TableIndex({
          columnNames: ["oddMarketId", "clientId"],
          isUnique: true,
        }),
      ),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(tableName);
    const oddMarketsTable: Table = await queryRunner.getTable(oddMarketsTableName);
    await queryRunner.dropTable(table, true);
    await queryRunner.dropTable(oddMarketsTable, true);
  }
}

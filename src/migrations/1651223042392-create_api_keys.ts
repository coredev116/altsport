import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

const tableName = "clientApiKeys";

export class createApiKeys1651223042392 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
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
            name: "totalRequestCount",
            type: "int",
            isNullable: false,
            default: 0,
          },
          {
            name: "currentRequesCount",
            type: "int",
            isNullable: false,
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

    await Promise.all([
      queryRunner.createForeignKey(
        tableName,
        new TableForeignKey({
          columnNames: ["clientId"],
          referencedColumnNames: ["id"],
          referencedTableName: "clients",
        }),
      ),
      queryRunner.createIndex(
        tableName,
        new TableIndex({
          columnNames: ["clientId"],
        }),
      ),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(tableName, true);
  }
}

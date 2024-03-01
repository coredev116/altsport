import { MigrationInterface, QueryRunner, Table } from "typeorm";

const tableName = "users";

export class createUsers1651222666321 implements MigrationInterface {
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
            name: "googleUserId",
            type: "text",
            isNullable: false,
          },
          {
            name: "providerId",
            type: "text",
            isNullable: false,
          },
          {
            name: "username",
            type: "text",
            isNullable: false,
            isUnique: true,
          },
          {
            name: "email",
            type: "text",
            isNullable: false,
            isUnique: true,
          },
          {
            name: "password",
            type: "text",
            isNullable: false,
          },
          {
            name: "userType",
            type: "int",
            isNullable: false,
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
    await queryRunner.dropTable(tableName, true);
  }
}

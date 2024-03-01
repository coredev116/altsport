import { MigrationInterface, QueryRunner, TableColumn, Table } from "typeorm";

const clientsTableName = `clients`;
const usersTableName = `users`;

export class modifyClientUsersAddCountry1679144034039 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const clientsTable: Table = await queryRunner.getTable(clientsTableName);
    const usersTable: Table = await queryRunner.getTable(usersTableName);

    const countryColumn: TableColumn = new TableColumn({
      name: "country",
      type: "text",
      default: "'US'",
      isNullable: false,
    });
    const phoneVerifiedColumn: TableColumn = new TableColumn({
      name: "isPhoneVerified",
      type: "boolean",
      default: false,
    });
    const emailVerifiedColumn: TableColumn = new TableColumn({
      name: "isEmailVerified",
      type: "boolean",
      default: false,
    });

    await Promise.all([
      queryRunner.addColumns(clientsTable, [
        countryColumn,
        phoneVerifiedColumn,
        emailVerifiedColumn,
      ]),
      queryRunner.addColumns(usersTable, [countryColumn, phoneVerifiedColumn, emailVerifiedColumn]),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const clientsTable: Table = await queryRunner.getTable(clientsTableName);
    const usersTable: Table = await queryRunner.getTable(usersTableName);

    await Promise.all([
      queryRunner.dropColumns(clientsTable, ["country", "isPhoneVerified", "isEmailVerified"]),
      queryRunner.dropColumns(usersTable, ["country", "isPhoneVerified", "isEmailVerified"]),
    ]);
  }
}

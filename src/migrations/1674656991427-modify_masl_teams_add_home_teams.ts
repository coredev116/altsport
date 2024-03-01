import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const teamsTableName = `${SportsDbSchema.MASL}.teams`;
const eventTeamsTableName = `${SportsDbSchema.MASL}.eventTeams`;

export class modifyMaslTeamsAddHomeTeams1674656991427 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(teamsTableName);
    const eventTeamsTable: Table = await queryRunner.getTable(eventTeamsTableName);

    await Promise.all([
      queryRunner.changeColumn(
        table,
        "name",
        new TableColumn({
          name: "name",
          type: "text",
        }),
      ),
      queryRunner.addColumn(
        eventTeamsTable,
        new TableColumn({
          name: "isHomeTeam",
          type: "boolean",
          default: false,
        }),
      ),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(teamsTableName);
    const eventTeamsTable: Table = await queryRunner.getTable(eventTeamsTableName);

    // likely need to clear the data here otherwise unique might not work

    await Promise.all([
      queryRunner.changeColumn(
        table,
        "name",
        new TableColumn({
          name: "name",
          type: "text",
          isUnique: true,
        }),
      ),
      queryRunner.dropColumn(eventTeamsTable, "isHomeTeam"),
    ]);
  }
}

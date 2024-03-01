import { MigrationInterface, QueryRunner, TableColumn, Table, TableForeignKey } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const tableName = `${SportsDbSchema.JA}.clientFutureOdds`;

export class ModifyJaClientFutureOddsDropAthleteIdAddTeamId1707204607246
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(tableName);

    await queryRunner.dropColumn(table, "athleteId");
    await queryRunner.addColumn(
      table,
      new TableColumn({
        name: "teamId",
        type: "uuid",
      }),
    );

    await queryRunner.createForeignKey(
      table,
      new TableForeignKey({
        columnNames: ["teamId"],
        referencedColumnNames: ["id"],
        referencedTableName: "teams",
        referencedSchema: SportsDbSchema.JA,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(tableName);

    await queryRunner.dropColumn(table, "teamId");
    await queryRunner.addColumn(
      table,
      new TableColumn({
        name: "athleteId",
        type: "uuid",
      }),
    );

    await queryRunner.createForeignKey(
      table,
      new TableForeignKey({
        columnNames: ["athleteId"],
        referencedColumnNames: ["id"],
        referencedTableName: "teams",
        referencedSchema: SportsDbSchema.JA,
      }),
    );
  }
}

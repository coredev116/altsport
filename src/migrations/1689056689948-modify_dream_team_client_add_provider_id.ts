import { MigrationInterface, QueryRunner, Table, TableColumn, TableColumnOptions } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const mxgpDreamTeamTableName = `${SportsDbSchema.MXGP}.clientProjectionDreamTeam`;
const f1DreamTeamTableName = `${SportsDbSchema.F1}.clientProjectionDreamTeam`;
const mgDreamTeamTableName = `${SportsDbSchema.MotoGP}.clientProjectionDreamTeam`;

const columnName: string = "providerId";

const columnAttrs: TableColumnOptions = {
  name: columnName,
  type: "text",
  isNullable: true,
  default: null,
};

export class ModifyDreamTeamClientAddProviderId1689056689948 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const mxgpDreamTeamTable: Table = await queryRunner.getTable(mxgpDreamTeamTableName);
    const f1DreamTeamTable: Table = await queryRunner.getTable(f1DreamTeamTableName);
    const mgDreamTeamTable: Table = await queryRunner.getTable(mgDreamTeamTableName);

    await Promise.all([
      queryRunner.addColumn(mxgpDreamTeamTable, new TableColumn(columnAttrs)),
      queryRunner.addColumn(f1DreamTeamTable, new TableColumn(columnAttrs)),
      queryRunner.addColumn(mgDreamTeamTable, new TableColumn(columnAttrs)),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const mxgpDreamTeamTable: Table = await queryRunner.getTable(mxgpDreamTeamTableName);
    const f1DreamTeamTable: Table = await queryRunner.getTable(f1DreamTeamTableName);
    const mgDreamTeamTable: Table = await queryRunner.getTable(mgDreamTeamTableName);

    await Promise.all([
      queryRunner.dropColumn(mxgpDreamTeamTable, columnName),
      queryRunner.dropColumn(f1DreamTeamTable, columnName),
      queryRunner.dropColumn(mgDreamTeamTable, columnName),
    ]);
  }
}

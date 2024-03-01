import { MigrationInterface, QueryRunner, Table, TableColumn, TableColumnOptions } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const mxgpTableName = `${SportsDbSchema.MXGP}.playerHeadToHeads`;
const f1TableName = `${SportsDbSchema.F1}.playerHeadToHeads`;
const mgTableName = `${SportsDbSchema.MotoGP}.playerHeadToHeads`;

const mxgpDreamTeamTableName = `${SportsDbSchema.MXGP}.projectionDreamTeam`;
const f1DreamTeamTableName = `${SportsDbSchema.F1}.projectionDreamTeam`;
const mgDreamTeamTableName = `${SportsDbSchema.MotoGP}.projectionDreamTeam`;

const columnName: string = "providerId";

const columnAttrs: TableColumnOptions = {
  name: columnName,
  type: "text",
  isNullable: true,
  default: null,
};

export class ModifyApexOddsAddProviderId1688560902821 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const mxgpTable: Table = await queryRunner.getTable(mxgpTableName);
    const f1Table: Table = await queryRunner.getTable(f1TableName);
    const mgTable: Table = await queryRunner.getTable(mgTableName);

    const mxgpDreamTeamTable: Table = await queryRunner.getTable(mxgpDreamTeamTableName);
    const f1DreamTeamTable: Table = await queryRunner.getTable(f1DreamTeamTableName);
    const mgDreamTeamTable: Table = await queryRunner.getTable(mgDreamTeamTableName);

    await Promise.all([
      queryRunner.addColumn(mxgpTable, new TableColumn(columnAttrs)),
      queryRunner.addColumn(f1Table, new TableColumn(columnAttrs)),
      queryRunner.addColumn(mgTable, new TableColumn(columnAttrs)),

      queryRunner.addColumn(mxgpDreamTeamTable, new TableColumn(columnAttrs)),
      queryRunner.addColumn(f1DreamTeamTable, new TableColumn(columnAttrs)),
      queryRunner.addColumn(mgDreamTeamTable, new TableColumn(columnAttrs)),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const mxgpTable: Table = await queryRunner.getTable(mxgpTableName);
    const f1Table: Table = await queryRunner.getTable(f1TableName);
    const mgTable: Table = await queryRunner.getTable(mgTableName);

    const mxgpDreamTeamTable: Table = await queryRunner.getTable(mxgpDreamTeamTableName);
    const f1DreamTeamTable: Table = await queryRunner.getTable(f1DreamTeamTableName);
    const mgDreamTeamTable: Table = await queryRunner.getTable(mgDreamTeamTableName);

    await Promise.all([
      queryRunner.dropColumn(mxgpTable, columnName),
      queryRunner.dropColumn(f1Table, columnName),
      queryRunner.dropColumn(mgTable, columnName),

      queryRunner.dropColumn(mxgpDreamTeamTable, columnName),
      queryRunner.dropColumn(f1DreamTeamTable, columnName),
      queryRunner.dropColumn(mgDreamTeamTable, columnName),
    ]);
  }
}

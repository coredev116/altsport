import { MigrationInterface, QueryRunner, TableIndex, Table } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const nrxProjectionEventOutcomeTableName = `${SportsDbSchema.NRX}.projectionEventOutcome`;
const wslProjectionEventOutcomeTableName = `${SportsDbSchema.WSL}.projectionEventOutcome`;
const slsProjectionEventOutcomeTableName = `${SportsDbSchema.SLS}.projectionEventOutcome`;

const nrxprojectionEventHeatOutcomeTableName = `${SportsDbSchema.NRX}.projectionEventHeatOutcome`;
const wslprojectionEventHeatOutcomeTableName = `${SportsDbSchema.WSL}.projectionEventHeatOutcome`;
const slsprojectionEventHeatOutcomeTableName = `${SportsDbSchema.SLS}.projectionEventHeatOutcome`;

const wslScoresTableName = `${SportsDbSchema.WSL}.scores`;
const slsScoresTableName = `${SportsDbSchema.SLS}.scores`;

export class modifyDropIndexes1657005365517 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await Promise.all([
      queryRunner.dropIndex(
        wslScoresTableName,
        await getTableIndex(queryRunner, wslScoresTableName, "athleteId"),
      ),
      queryRunner.dropIndex(
        slsScoresTableName,
        await getTableIndex(queryRunner, slsScoresTableName, "athleteId"),
      ),

      queryRunner.dropIndex(
        nrxprojectionEventHeatOutcomeTableName,
        await getTableIndex(
          queryRunner,
          nrxprojectionEventHeatOutcomeTableName,
          "eventParticipantId",
        ),
      ),
      queryRunner.dropIndex(
        wslprojectionEventHeatOutcomeTableName,
        await getTableIndex(
          queryRunner,
          wslprojectionEventHeatOutcomeTableName,
          "eventParticipantId",
        ),
      ),
      queryRunner.dropIndex(
        slsprojectionEventHeatOutcomeTableName,
        await getTableIndex(
          queryRunner,
          slsprojectionEventHeatOutcomeTableName,
          "eventParticipantId",
        ),
      ),

      queryRunner.dropIndex(
        nrxProjectionEventOutcomeTableName,
        await getTableIndex(queryRunner, nrxProjectionEventOutcomeTableName, "eventParticipantId"),
      ),
      queryRunner.dropIndex(
        wslProjectionEventOutcomeTableName,
        await getTableIndex(queryRunner, wslProjectionEventOutcomeTableName, "eventParticipantId"),
      ),
      queryRunner.dropIndex(
        slsProjectionEventOutcomeTableName,
        await getTableIndex(queryRunner, slsProjectionEventOutcomeTableName, "eventParticipantId"),
      ),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await Promise.all([
      queryRunner.createIndex(
        wslScoresTableName,
        new TableIndex({
          columnNames: ["athleteId"],
        }),
      ),
      queryRunner.createIndex(
        slsScoresTableName,
        new TableIndex({
          columnNames: ["athleteId"],
        }),
      ),

      queryRunner.createIndex(
        nrxprojectionEventHeatOutcomeTableName,
        new TableIndex({
          columnNames: ["eventParticipantId"],
        }),
      ),
      queryRunner.createIndex(
        wslprojectionEventHeatOutcomeTableName,
        new TableIndex({
          columnNames: ["eventParticipantId"],
        }),
      ),
      queryRunner.createIndex(
        slsprojectionEventHeatOutcomeTableName,
        new TableIndex({
          columnNames: ["eventParticipantId"],
        }),
      ),

      queryRunner.createIndex(
        nrxProjectionEventOutcomeTableName,
        new TableIndex({
          columnNames: ["eventParticipantId"],
        }),
      ),
      queryRunner.createIndex(
        wslProjectionEventOutcomeTableName,
        new TableIndex({
          columnNames: ["eventParticipantId"],
        }),
      ),
      queryRunner.createIndex(
        slsProjectionEventOutcomeTableName,
        new TableIndex({
          columnNames: ["eventParticipantId"],
        }),
      ),
    ]);
  }
}

const getTableIndex = async (
  queryRunner: QueryRunner,
  tableName: string,
  columnName: string,
): Promise<TableIndex> => {
  const table: Table = await queryRunner.getTable(tableName);

  const tableIndex = table.indices.find(
    (index) => index.columnNames.includes(columnName) && index.columnNames.length === 1,
  );

  return tableIndex;
};

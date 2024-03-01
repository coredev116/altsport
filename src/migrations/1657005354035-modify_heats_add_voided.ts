import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const nrxTableName = `${SportsDbSchema.NRX}.roundHeats`;
const wslTableName = `${SportsDbSchema.WSL}.roundHeats`;
const slsTableName = `${SportsDbSchema.SLS}.roundHeats`;

export class modifyHeatsAddVoided1657005354035 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const nrxtable: Table = await queryRunner.getTable(nrxTableName);
    const wsltable: Table = await queryRunner.getTable(wslTableName);
    const slstable: Table = await queryRunner.getTable(slsTableName);

    await Promise.all([
      queryRunner.addColumn(
        nrxtable,
        new TableColumn({
          name: "isHeatWinnerMarketVoided",
          type: "boolean",
          default: false,
        }),
      ),
      queryRunner.addColumn(
        wsltable,
        new TableColumn({
          name: "isHeatWinnerMarketVoided",
          type: "boolean",
          default: false,
        }),
      ),
      queryRunner.addColumn(
        slstable,
        new TableColumn({
          name: "isHeatWinnerMarketVoided",
          type: "boolean",
          default: false,
        }),
      ),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const nrxtable: Table = await queryRunner.getTable(nrxTableName);
    const wsltable: Table = await queryRunner.getTable(wslTableName);
    const slstable: Table = await queryRunner.getTable(slsTableName);

    await Promise.all([
      queryRunner.dropColumn(nrxtable, "isHeatWinnerMarketVoided"),
      queryRunner.dropColumn(wsltable, "isHeatWinnerMarketVoided"),
      queryRunner.dropColumn(slstable, "isHeatWinnerMarketVoided"),
    ]);
  }
}

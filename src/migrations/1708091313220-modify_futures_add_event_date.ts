import { MigrationInterface, QueryRunner, TableColumn, Table } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const sports: SportsDbSchema[] = [
  SportsDbSchema.F1,
  SportsDbSchema.FDRIFT,
  SportsDbSchema.JA,
  SportsDbSchema.MASL,
  SportsDbSchema.MotoGP,
  SportsDbSchema.MOTOCRS,
  SportsDbSchema.MXGP,
  SportsDbSchema.NRX,
  SportsDbSchema.PBR,
  SportsDbSchema.SLS,
  SportsDbSchema.SPR,
  SportsDbSchema.WSL,
];

const futuresTableName: string = "futures";

const columnName: string = "eventDate";

export class ModifyFuturesAddEventDate1708091313220 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await Promise.all(
      sports.map(async (sport) => {
        const table: Table = await queryRunner.getTable(`${sport}.${futuresTableName}`);

        await queryRunner.addColumn(
          table,
          new TableColumn({
            name: columnName,
            type: "timestamptz",
            default: null,
            isNullable: true,
          }),
        );
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await Promise.all(
      sports.map(async (sport) => {
        const table: Table = await queryRunner.getTable(`${sport}.${futuresTableName}`);
        await queryRunner.dropColumn(table, columnName);
      }),
    );
  }
}

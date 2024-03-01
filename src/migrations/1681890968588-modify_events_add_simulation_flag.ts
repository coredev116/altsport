import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const applicableSchemas = [
  SportsDbSchema.MASL,
  SportsDbSchema.NRX,
  SportsDbSchema.PBR,
  SportsDbSchema.SLS,
  SportsDbSchema.SPR,
  SportsDbSchema.WSL,
];
const tableName: string = `events`;

export class ModifyEventsAddSimulationFlag1681890968588 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tables: {
      table: Table;
      tableName: string;
    }[] = await Promise.all(
      applicableSchemas.map(async (schema) => {
        return {
          table: await queryRunner.getTable(`${schema}.${tableName}`),
          tableName,
        };
      }),
    );

    const isSimulationEnabled: TableColumn = new TableColumn({
      name: "isSimulationEnabled",
      type: "boolean",
      default: true,
    });

    await Promise.all(tables.map(({ table }) => queryRunner.addColumn(table, isSimulationEnabled)));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tables: {
      table: Table;
      tableName: string;
    }[] = await Promise.all(
      applicableSchemas.map(async (schema) => {
        return {
          table: await queryRunner.getTable(`${schema}.${tableName}`),
          tableName,
        };
      }),
    );

    await Promise.all(
      tables.map(({ table }) => queryRunner.dropColumn(table, "isSimulationEnabled")),
    );
  }
}

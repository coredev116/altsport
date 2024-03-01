import { MigrationInterface, QueryRunner } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const olderSchema = "wrx";
const newSchema = SportsDbSchema.NRX;

export class modifyWrxNrxSchemaRename1656954763111 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const isOlderSchemaExists = await queryRunner.hasSchema(olderSchema);
    if (isOlderSchemaExists)
      await queryRunner.query(`ALTER SCHEMA ${olderSchema} RENAME TO ${newSchema}`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER SCHEMA ${newSchema} RENAME TO ${olderSchema}`);
  }
}

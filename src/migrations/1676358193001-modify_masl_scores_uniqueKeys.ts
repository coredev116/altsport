import { MigrationInterface, QueryRunner } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const Scores = `${SportsDbSchema.MASL}."scores"`;

export class modifyMaslScoresUniqueKeys1676358193001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await Promise.all([
      queryRunner.query(
        `ALTER TABLE ${Scores} ADD CONSTRAINT Unique_Score UNIQUE ("eventId","teamId","roundId")`,
      ),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await Promise.all([
      queryRunner.query(
        `ALTER TABLE ${Scores} DROP CONSTRAINT Unique_Score UNIQUE ("eventId","teamId","roundId")`,
      ),
    ]);
  }
}

import { MigrationInterface, QueryRunner } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const Scores = `${SportsDbSchema.SLS}."scores"`;

export class SlsScoresUnique1681741884331 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await Promise.all([
      queryRunner.query(
        `ALTER TABLE ${Scores} ADD CONSTRAINT unique_score UNIQUE ("eventId", "roundHeatId", "athleteId")`,
      ),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await Promise.all([
      queryRunner.query(
        `ALTER TABLE ${Scores} DROP CONSTRAINT unique_score UNIQUE ("eventId", "roundHeatId", "athleteId")`,
      ),
    ]);
  }
}

import { MigrationInterface, QueryRunner } from "typeorm";

import { SportsDbSchema } from "../constants/system";

const eventRoundsTableName = `${SportsDbSchema.MASL}."eventRounds"`;
const eventsTableName = `${SportsDbSchema.MASL}."events"`;

export class modifyMaslRemoveNotNull1675000144214 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await Promise.all([
      queryRunner.query(
        `ALTER TABLE ${eventRoundsTableName} ALTER COLUMN "startDate" DROP NOT NULL`,
      ),
      queryRunner.query(`ALTER TABLE ${eventRoundsTableName} ALTER COLUMN "endDate" DROP NOT NULL`),
      queryRunner.query(`ALTER TABLE ${eventsTableName} ALTER COLUMN "startDate" DROP NOT NULL`),
      queryRunner.query(`ALTER TABLE ${eventsTableName} ALTER COLUMN "endDate" DROP NOT NULL`),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await Promise.all([
      queryRunner.query(
        `ALTER TABLE ${eventRoundsTableName} ALTER COLUMN "startDate" SET NOT NULL`,
      ),
      queryRunner.query(`ALTER TABLE ${eventRoundsTableName} ALTER COLUMN "endDate" SET NOT NULL`),
      queryRunner.query(`ALTER TABLE ${eventsTableName} ALTER COLUMN "startDate" SET NOT NULL`),
      queryRunner.query(`ALTER TABLE ${eventsTableName} ALTER COLUMN "endDate" SET NOT NULL`),
    ]);
  }
}

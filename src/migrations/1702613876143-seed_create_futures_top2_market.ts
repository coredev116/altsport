import { MigrationInterface, QueryRunner } from "typeorm";
import { v4 } from "uuid";

import { OddMarkets as Markets } from "../constants/system";

const markets: Markets[] = [Markets.FUTURES_TOP_2];

export class SeedCreateFuturesTop2Market1702613876143 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await Promise.all(
      markets.map(async (market) => {
        // insert the new market
        const oddMarketId = v4();
        await queryRunner.manager.insert("oddMarkets", {
          id: oddMarketId,
          name: market,
          key: market,
        });
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await Promise.all(
      markets.map(async (market) => {
        // find all instances of the dream team market and delete it

        const [marketRow] = await queryRunner.query(
          `SELECT id FROM "oddMarkets" WHERE "key" = '${market}'`,
        );
        if (!marketRow) return;

        await queryRunner.manager.query(
          `DELETE FROM "clientMarketNotifications" WHERE "oddMarketId" = '${marketRow.id}'`,
        );

        await queryRunner.manager.query(`DELETE FROM "oddMarkets" WHERE "id" = '${marketRow.id}'`);
      }),
    );
  }
}

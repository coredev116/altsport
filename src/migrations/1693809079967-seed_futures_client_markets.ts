import { MigrationInterface, QueryRunner } from "typeorm";
import { v4 } from "uuid";

import { OddMarkets as Markets } from "../constants/system";

const markets: Markets[] = [
  Markets.FUTURES_WINNER,
  Markets.FUTURES_TOP_3,
  Markets.FUTURES_TOP_5,
  Markets.FUTURES_TOP_10,
  Markets.FUTURES_MAKE_CUT,
  Markets.FUTURES_MAKE_PLAYOFFS,
];

export class SeedFuturesClientMarkets1693809079967 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const clients = await queryRunner.query(
      `SELECT id FROM clients WHERE "isActive" = true AND "isPhoneVerified" = true`,
    );

    await Promise.all(
      markets.map(async (market) => {
        // insert the new market
        const oddMarketId = v4();
        await queryRunner.manager.insert("oddMarkets", {
          id: oddMarketId,
          name: market,
          key: market,
        });

        // for each client, insert he market as a notification attribute
        await queryRunner.manager.insert(
          "clientMarketNotifications",
          clients.map((client) => ({
            id: v4(),
            clientId: client.id,
            oddMarketId,
            sms: true,
            email: false,
            slack: false,
          })),
        );
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

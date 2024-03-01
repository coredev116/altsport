import { MigrationInterface, QueryRunner } from "typeorm";
import { v4 } from "uuid";

import { OddMarkets as Markets } from "../constants/system";

export class SeedHeatExacta1690796143567 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // insert the new market
    const oddMarketId = v4();
    await queryRunner.manager.insert("oddMarkets", {
      id: oddMarketId,
      name: "Heat Exacta",
      key: Markets.HEAT_EXACTAS,
    });

    const clients = await queryRunner.query(
      `SELECT id FROM clients WHERE "isActive" = true AND "isPhoneVerified" = true`,
    );

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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // find all instances of the dream team market and delete it

    const [exactaMarket] = await queryRunner.query(
      `SELECT id FROM "oddMarkets" WHERE "key" = '${Markets.HEAT_EXACTAS}'`,
    );
    if (!exactaMarket) return;

    await queryRunner.manager.query(
      `DELETE FROM "clientMarketNotifications" WHERE "oddMarketId" = '${exactaMarket.id}'`,
    );

    await queryRunner.manager.query(`DELETE FROM "oddMarkets" WHERE "id" = '${exactaMarket.id}'`);
  }
}

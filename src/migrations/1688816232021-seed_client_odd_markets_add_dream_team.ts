import { MigrationInterface, QueryRunner } from "typeorm";
import { v4 } from "uuid";

import { OddMarkets as Markets } from "../constants/system";

export class SeedClientOddMarketsAddDreamTeam1688816232021 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // insert the new market
    const oddMarketId = v4();
    await queryRunner.manager.insert("oddMarkets", {
      id: oddMarketId,
      name: "Dream Team",
      key: Markets.DREAM_TEAM,
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

    const [dreamTeamMarket] = await queryRunner.query(
      `SELECT id FROM "oddMarkets" WHERE "key" = '${Markets.DREAM_TEAM}'`,
    );

    if (!dreamTeamMarket) return;

    await queryRunner.manager.query(
      `DELETE FROM "clientMarketNotifications" WHERE "oddMarketId" = '${dreamTeamMarket.id}'`,
    );

    await queryRunner.manager.query(
      `DELETE FROM "oddMarkets" WHERE "id" = '${dreamTeamMarket.id}'`,
    );
  }
}

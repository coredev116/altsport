import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import ClientMarketNotifications from "../../../../entities/clientMarketNotifications.entity";
import OddMarkets from "../../../../entities/oddMarkets.entity";

import * as marketExceptions from "../../../../exceptions/markets";

import { MarketNotificationDto } from "./dto/marketNotifications.dto";

@Injectable()
export class MarketNotificationsService {
  constructor(
    @InjectRepository(ClientMarketNotifications)
    private readonly clientMarketNotificationsRepository: Repository<ClientMarketNotifications>,

    @InjectRepository(OddMarkets)
    private readonly marketRepository: Repository<OddMarkets>,
  ) {}

  async updateClientOddMarketNotificationSettings(
    clientId: string,
    payload: MarketNotificationDto,
  ) {
    try {
      const market: OddMarkets = await this.marketRepository.findOne({
        where: {
          key: payload.oddMarketKey,
          isActive: true,
          isArchived: false,
        },
      });
      if (!market) throw marketExceptions.marketNotFound;

      const existingMarket: ClientMarketNotifications =
        await this.clientMarketNotificationsRepository.findOne({
          where: {
            clientId,
            oddMarketId: market.id,
          },
          select: {
            id: true,
          },
        });

      // eslint-disable-next-line unicorn/prefer-ternary
      if (existingMarket)
        await this.clientMarketNotificationsRepository.update(
          {
            id: existingMarket.id,
          },
          {
            sms: payload.isEnabled,
            email: payload.isEnabled,
            slack: payload.isEnabled,
          },
        );
      else
        await this.clientMarketNotificationsRepository.save({
          clientId,
          oddMarketId: market.id,
          sms: payload.isEnabled,
          email: payload.isEnabled,
          slack: payload.isEnabled,
        });

      return true;
    } catch (error) {
      throw error;
    }
  }
}

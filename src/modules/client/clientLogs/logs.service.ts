import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import ClientMarketDownloadLogs from "../../../entities/clientMarketDownloadLogs.entity";

import { ClientMarketDownloadLogDto } from "./dto/clientMarketDownloadLog.dto";

@Injectable()
export default class LogsService {
  constructor(
    @InjectRepository(ClientMarketDownloadLogs)
    private readonly clientMarketDownloadLogsRepository: Repository<ClientMarketDownloadLogs>,
  ) {}

  public async createClientMarketDownloadLogs(
    body: ClientMarketDownloadLogDto,
    userId: string,
  ): Promise<boolean> {
    try {
      const clientMarketDownloadLogs = this.clientMarketDownloadLogsRepository.create({
        clientId: userId,
        marketType: body.marketType,
        futureType: body.futureType,
        sportType: body.sportType,
        isActive: true,
        isArchived: false,
      });
      await this.clientMarketDownloadLogsRepository.save(clientMarketDownloadLogs);

      return true;
    } catch (error) {
      throw error;
    }
  }
}

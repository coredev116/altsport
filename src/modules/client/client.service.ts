import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import ClientApiKeys from "../../entities/clientApiKeys.entity";

@Injectable()
export default class ClientService {
  constructor(
    @InjectRepository(ClientApiKeys)
    private readonly clientApiKeysRepository: Repository<ClientApiKeys>,
  ) {}

  public async getClientApiKey(apiKey: string): Promise<ClientApiKeys> {
    const clienKey = await this.clientApiKeysRepository.findOne({
      select: ["id", "currentRequestCount", "totalRequestCount"],
      where: {
        apiKey,
        isArchived: false,
        isActive: true,
      },
    });

    return clienKey;
  }

  public async updateClientApiKey(id: string): Promise<boolean> {
    await this.clientApiKeysRepository.increment({ id }, "currentRequestCount", 1);
    return true;
  }
}

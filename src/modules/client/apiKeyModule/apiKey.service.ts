import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import ClientApiKeys from "../../../entities/clientApiKeys.entity";

@Injectable()
export default class ApiKeyService {
  constructor(
    @InjectRepository(ClientApiKeys)
    private readonly clientApiKeysRepository: Repository<ClientApiKeys>,
  ) {}

  public async fetchClientApis(): Promise<ClientApiKeys[]> {
    const clientKeys = await this.clientApiKeysRepository.find({
      relations: ["client"],
    });

    return clientKeys;
  }

  async createClientApiKey(body): Promise<boolean> {
    try {
      const apiKeys = body.items.map((apiKey) => this.clientApiKeysRepository.create(apiKey));
      await this.clientApiKeysRepository.save(apiKeys);

      return true;
    } catch (error) {
      throw error;
    }
  }

  public async archiveClientApiKey(id: string): Promise<boolean> {
    await this.clientApiKeysRepository.update({ id }, { isActive: false, isArchived: true });
    return true;
  }
}

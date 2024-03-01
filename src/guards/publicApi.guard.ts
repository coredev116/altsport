import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";

import * as systemException from "../exceptions/system";
import * as authException from "../exceptions/auth";

import { PUBLIC_API_KEY_HEADER } from "../constants/auth";

import ClientService from "../modules/client/client.service";

@Injectable()
export default class PublicApiGuard implements CanActivate {
  constructor(private readonly clientService: ClientService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    try {
      if (!request.get(PUBLIC_API_KEY_HEADER)) throw authException.forbidden;

      const clientApiData = await this.clientService.getClientApiKey(
        request.get(PUBLIC_API_KEY_HEADER),
      );
      if (!clientApiData) throw authException.forbidden;

      if (clientApiData.currentRequestCount >= clientApiData.totalRequestCount)
        throw systemException.publicApiUsageLimit;

      await this.clientService.updateClientApiKey(clientApiData.id);
      return true;
    } catch (error) {
      throw error;
    }
  }
}

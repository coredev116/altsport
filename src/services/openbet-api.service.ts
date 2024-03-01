import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios, { AxiosInstance } from "axios";
import { v4 } from "uuid";

import {
  IOpenBetAuthResponse,
  IFixtureBodyPayload,
  IFixturePayloadResponse,
} from "../interfaces/openbet";

const BASE_URL = "https://openbet.proxy.altsportsdata.com";

@Injectable()
export default class OpenBetApiService {
  private serverEnvironment: string | null = null;
  private accessToken: string | null = null;
  private tokenExpirationTime: number | null = null;
  private refreshToken: string | null = null;
  private baseAxiosInstance: AxiosInstance | null = null;
  private isStaging: boolean;
  private isRelease: boolean;
  private isDevelop: boolean;

  constructor(private readonly configService: ConfigService) {
    const clientId = this.configService.get<string>("openBetClient.clientId");
    const clientSecret = this.configService.get<string>("openBetClient.secretKey");
    const proxyApiKey = this.configService.get<string>("openBetClient.proxyApiKey");

    this.isStaging = this.configService.get<boolean>("isStaging");
    this.isRelease = this.configService.get<boolean>("isRelease");
    this.isDevelop = this.configService.get<boolean>("isDevelop");

    if (this.isStaging) this.serverEnvironment = "stage";
    else if (this.isRelease) this.serverEnvironment = "prod";
    else this.serverEnvironment = "uat";

    this.baseAxiosInstance = axios.create({
      baseURL: BASE_URL,
      timeout: 25_000,
      headers: {
        "x-server-env": this.serverEnvironment,
        "x-api-key": proxyApiKey,
        "x-client-id": clientId,
        "x-client-secret": clientSecret,
      },
    });
  }

  isAllowed(): boolean {
    // FIXME: temporarily only enabled on development
    return this.isDevelop;
    // return this.isDevelop || this.isRelease || this.isStaging;
  }

  async heartbeat(): Promise<boolean> {
    try {
      if (!this.isAllowed()) return false;

      const accessToken: string = await this.getAccessToken();
      const response = await this.baseAxiosInstance.post(
        `/partner-consumer/api/1.0/heartbeat`,
        {
          header: {
            timestamp: new Date().toISOString(),
            trackingId: v4(),
          },
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      throw new Error(`OPENBET: heatbeat failed: ${error?.response?.data}`);
    }
  }

  public async createFixture(fixtureData: IFixtureBodyPayload): Promise<IFixturePayloadResponse> {
    try {
      if (!this.isAllowed()) return null;

      const accessToken: string = await this.getAccessToken();
      const response = await this.baseAxiosInstance.post<IFixturePayloadResponse>(
        "partner-consumer/api/1.0/snapshot",
        fixtureData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      throw new Error(
        `OPENBET: create fixture failed: ${
          JSON.stringify(error?.response?.data) || error?.response || error?.message || error
        }`,
      );
    }
  }

  async updateFixture(fixtureData: IFixtureBodyPayload): Promise<IFixturePayloadResponse> {
    try {
      if (!this.isAllowed()) return null;

      const accessToken: string = await this.getAccessToken();
      const response = await this.baseAxiosInstance.post<IFixturePayloadResponse>(
        "partner-consumer/api/1.0/delta",
        fixtureData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      throw new Error(`OPENBET: update fixture failed: ${JSON.stringify(error?.response?.data)}`);
    }
  }

  private async getAccessToken(): Promise<string> {
    if (!this.accessToken || (this.tokenExpirationTime && Date.now() >= this.tokenExpirationTime)) {
      try {
        const response = await this.baseAxiosInstance.post<IOpenBetAuthResponse>(
          `/auth/realms/sgdigital/protocol/openid-connect/token`,
        );

        this.accessToken = response.data.access_token;
        this.tokenExpirationTime = Date.now() + response.data.expires_in * 1_000;
        this.refreshToken = response.data.refresh_token || this.refreshToken;
        return this.accessToken;
      } catch (error) {
        throw new Error(`OPENBET: auth failed: ${error?.response?.data}`);
      }
    }

    return this.accessToken;
  }
}

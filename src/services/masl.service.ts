import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios, { AxiosInstance } from "axios";
import { differenceInMinutes } from "date-fns";

import AuthTicket from "../interfaces/masl/authTicket";
import Games, { GameSummary } from "../interfaces/masl/games";
import Leagues from "../interfaces/masl/leagues";
import Seasons from "../interfaces/masl/seasons";
import Teams from "../interfaces/masl/teams";

@Injectable()
export default class MaslService {
  private apiInstance: AxiosInstance;
  private tokenLastFetchTime: Date;
  private token: string;

  constructor(private configService: ConfigService) {
    const baseUrl = "https://stats.api.digitalshift.ca";

    this.apiInstance = axios.create({
      baseURL: baseUrl,
      timeout: 50_000,
    });

    this.tokenLastFetchTime = new Date();
  }

  private async getToken() {
    const now: Date = new Date();
    const difference: number = differenceInMinutes(now, this.tokenLastFetchTime);
    if (difference > 15 || !this.token) {
      // refetch token
      this.token = await this.getAuthTicket();
      this.tokenLastFetchTime = now;
    }
    return this.token;
  }

  private async getAuthTicket(): Promise<string> {
    try {
      const apiKey = this.configService.get("maslApiKey");

      const {
        data: {
          ticket: { hash },
        },
      } = await this.apiInstance.get<AuthTicket>("/login", { params: { key: apiKey } });

      return hash;
    } catch (error) {
      throw error;
    }
  }

  async getGames(seasonId: number): Promise<Games> {
    try {
      const token: string = await this.getToken();

      const { data } = await this.apiInstance.get<Games>(`/season/${seasonId}/games`, {
        params: {
          ticket: token,
        },
      });

      return data;
    } catch (error) {
      throw error;
    }
  }

  async getLeagues(): Promise<Leagues> {
    try {
      const token: string = await this.getToken();
      const { data } = await this.apiInstance.get<Leagues>(`/leagues`, {
        params: {
          ticket: token,
        },
      });

      return data;
    } catch (error) {
      throw error;
    }
  }

  async getSeason(leagueId: number): Promise<Seasons> {
    try {
      const token: string = await this.getToken();

      const { data } = await this.apiInstance.get<Seasons>(`/league/${leagueId}/seasons`, {
        params: {
          ticket: token,
        },
      });

      return data;
    } catch (error) {
      throw error;
    }
  }

  async getTeams(seasonId: number): Promise<Teams> {
    try {
      const token: string = await this.getToken();

      const { data } = await this.apiInstance.get<Teams>(`/season/${seasonId}/teams`, {
        params: {
          ticket: token,
        },
      });

      return data;
    } catch (error) {
      throw error;
    }
  }

  async getGameSummary(gameProviderId: string): Promise<GameSummary> {
    try {
      const token: string = await this.getToken();

      const { data } = await this.apiInstance.get<GameSummary>(`/game/${gameProviderId}/summary`, {
        params: {
          ticket: token,
        },
      });

      return data;
    } catch (error) {
      throw error;
    }
  }
}

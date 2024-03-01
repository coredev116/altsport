import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios, { AxiosInstance } from "axios";

import { ISetScoringPlayers, ISetScoringPlayersExteral } from "../interfaces/ja/api";

@Injectable()
export default class JaiService {
  private apiInstance: AxiosInstance;

  constructor(private configService: ConfigService) {
    const baseUrl = "https://jaialaiworld.com/api";
    const apiKey = this.configService.get("jaiAlaiApiKey");

    this.apiInstance = axios.create({
      baseURL: baseUrl,
      timeout: 50_000,
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
  }

  async getSetPlayers(setScoringId: number): Promise<ISetScoringPlayers[]> {
    try {
      const { data } = await this.apiInstance.get<ISetScoringPlayersExteral[]>(
        `/h2h/set_players/${setScoringId}`,
      );

      return data.map((row) => ({
        id: row.id,
        playerId: row.player_id,
        setScoringId: row.set_scoring_id,
      }));
    } catch (error) {
      throw error;
    }
  }
}

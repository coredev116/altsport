import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios, { AxiosInstance } from "axios";
import { addSeconds, isAfter } from "date-fns";

import IAuthTicket from "../interfaces/wsl/authTicket";
import IEventResponse from "../interfaces/wsl/event";
import IYearEvent from "../interfaces/wsl/yearEvents";
import ITourEvents from "../interfaces/wsl/toursEvents";
import ITours, { ITour } from "../interfaces/wsl/tours";
import IEventAlt from "../interfaces/wsl/eventAlt";
import ITourRanks from "../interfaces/wsl/tourRanks";
import IAthleteRanks from "../interfaces/wsl/athleteRanks";
import ISeasonRanks from "../interfaces/wsl/seasonRanks";

import { Gender } from "../constants/system";

const MENS_TOUR_ID = "1";
const WOMENS_TOUR_ID = "2";

@Injectable()
export default class WslService {
  private apiInstance: AxiosInstance;
  private tokenExpiryDate: Date;
  private token: string;

  constructor(private configService: ConfigService) {
    const baseUrl = "https://api.worldsurfleague.com/v1";

    const clientId: string = this.configService.get("wslClientId");

    this.apiInstance = axios.create({
      baseURL: baseUrl,
      timeout: 50_000,
      params: {
        appKey: clientId,
      },
    });

    this.tokenExpiryDate = null;
  }

  private async getToken() {
    const now: Date = new Date();
    const hasExpired: boolean = this.tokenExpiryDate ? isAfter(now, this.tokenExpiryDate) : true;
    if (hasExpired || !this.token) {
      // refetch token
      const { expiryDate, token } = await this.getAuthTicket();

      this.tokenExpiryDate = expiryDate;
      this.token = token;
    }

    return this.token;
  }

  private async getAuthTicket(): Promise<{
    token: string;
    expiryDate: Date;
  }> {
    try {
      const clientId = this.configService.get("wslClientId");
      const clientSecret = this.configService.get("wslClientSecret");

      const now: Date = new Date();

      const {
        data: { access_token, expires_in },
      } = await this.apiInstance.post<IAuthTicket>(
        `/oauth/token`,
        {
          grant_type: "client_credentials",
        },
        {
          params: {
            client_id: clientId,
            client_secret: clientSecret,
          },
        },
      );

      return {
        token: access_token,
        // subtracting 15 minutes so it expired
        expiryDate: addSeconds(now, expires_in - 900),
      };
    } catch (error) {
      throw error;
    }
  }

  async fetchEventDetails(externalEventId: string): Promise<IEventResponse> {
    try {
      const token: string = await this.getToken();

      const { data } = await this.apiInstance.get<IEventResponse>("/event/details", {
        params: {
          eventId: externalEventId,
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      return data;
    } catch (error) {
      throw error;
    }
  }

  async fetchEventAltDetails(externalEventId: string): Promise<IEventAlt> {
    try {
      const token: string = await this.getToken();

      const { data } = await this.apiInstance.get<IEventAlt>("/event/heats", {
        params: {
          eventId: externalEventId,
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      return data;
    } catch (error) {
      throw error;
    }
  }

  async fetchEventsByYear(year: number): Promise<ITourEvents> {
    try {
      const token: string = await this.getToken();

      const { data } = await this.apiInstance.get<IYearEvent>("/site/eventsinyear", {
        params: {
          year,
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      const {
        site: { eventsInYear },
      } = data;

      const { months } = eventsInYear[year];

      const resultTours: ITourEvents = {
        mens: [],
        womens: [],
      };

      Object.keys(months).forEach((key) => {
        const row = months[key];
        const { tours } = row;

        Object.keys(tours)
          .filter((toursKey) => [MENS_TOUR_ID, WOMENS_TOUR_ID].includes(toursKey))
          .forEach((toursKey) => {
            const { events = [] } = tours[toursKey];

            if (toursKey === MENS_TOUR_ID)
              resultTours.mens.push(
                ...events.map((itemRow) => ({
                  month: +key,
                  eventId: itemRow.eventId,
                })),
              );
            else if (toursKey === WOMENS_TOUR_ID)
              resultTours.womens.push(
                ...events.map((itemRow) => ({
                  month: +key,
                  eventId: itemRow.eventId,
                })),
              );
          });
      });

      return resultTours;
    } catch (error) {
      throw error;
    }
  }

  async fetchTours(): Promise<ITour[]> {
    try {
      const token: string = await this.getToken();

      const { data } = await this.apiInstance.get<ITours>("/site/tours", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { tours } = data;

      const rowTours: ITour[] = Object.keys(tours)
        .filter((key) => [MENS_TOUR_ID, WOMENS_TOUR_ID].includes(key))
        .map((key) => {
          const row = tours[key];

          return {
            id: row.tourId,
            name: row.name,
            gender: row.gender === "M" ? Gender.MALE : Gender.FEMALE,
            year: +row.eventsDefaultYear,
          };
        });

      return rowTours;
    } catch (error) {
      throw error;
    }
  }

  async fetchAthleteRanks(rankId: string): Promise<IAthleteRanks> {
    try {
      const token: string = await this.getToken();

      const { data } = await this.apiInstance.get<IAthleteRanks>("/rank/athletes", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          rankId,
        },
      });

      return data;
    } catch (error) {
      throw error;
    }
  }

  async fetchSeasonRanking(gender: Gender): Promise<ISeasonRanks[]> {
    try {
      const token: string = await this.getToken();

      const tourId: string = gender === Gender.MALE ? MENS_TOUR_ID : WOMENS_TOUR_ID;

      const { data } = await this.apiInstance.get<ITourRanks>("/tour/ranks", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          tourId,
        },
      });

      const { tours } = data;

      const tour = tours[tourId];

      // find the latest rank id
      const rankId: string = tour.searchResults.tourRanks.rankIds.sort((a, b) => +b - +a)[0];

      const ranksResult = await this.fetchAthleteRanks(rankId);

      const { athletes } = ranksResult;

      const seasonRanks: ISeasonRanks[] = Object.values(athletes).map((row) => {
        const { rankStats, ...athlete } = row;

        const rankData = rankStats[rankId];

        return {
          athlete,
          rank: rankData?.rank,
          points: rankData?.points,
          heatWinPercent: rankData?.heatWinPercent,
          avgHeatScore: rankData?.avgHeatScore,
          maxHeatScore: rankData?.maxHeatScore,
          avgWaveScore: rankData?.avgWaveScore,
          maxWaveScore: rankData?.maxWaveScore,
        };
      });

      return seasonRanks;
    } catch (error) {
      throw error;
    }
  }
}

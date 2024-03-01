import { Injectable } from "@nestjs/common";
import axios, { AxiosInstance } from "axios";

import Tours from "../interfaces/pbr/tours";
import Events from "../interfaces/pbr/events";
import Result from "../interfaces/pbr/results";
import Athlete from "../interfaces/pbr/athlete";
import Bull from "../interfaces/pbr/bull";

@Injectable()
export default class PbrService {
  private apiInstance: AxiosInstance;

  constructor() {
    const baseUrl = "https://data.pbr.com/api/";

    this.apiInstance = axios.create({
      baseURL: baseUrl,
      timeout: 50_000,
    });
  }

  async getTours(year: number): Promise<Tours[]> {
    try {
      const { data } = await this.apiInstance.get<Tours[]>(`/Events/series?Season=${year}`);

      return data;
    } catch (error) {
      throw error;
    }
  }

  async getEvents(year: number): Promise<Events[]> {
    try {
      const { data } = await this.apiInstance.get<Events[]>(`/Events/min?Year=${year}`);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getResults(eventId: number): Promise<Result> {
    try {
      const { data } = await this.apiInstance.get<Result>(`/Results/${eventId}`);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getBull(bullId: number): Promise<Bull> {
    const { data } = await this.apiInstance.get<Bull>(`/Bulls/${bullId}`);

    return data;
  }

  async getAthlete(athleteId: number): Promise<Athlete> {
    const { data } = await this.apiInstance.get<Athlete>(`/Riders/${athleteId}`);

    return data;
  }
}
